# QuickBite notes

## Phase 1: Data model

### Why we design the data model first

MongoDB doesn't force a schema, and it doesn't join tables for us. We decide the shape of every document ourselves, and that shape decides:

- how many queries a page needs
- how big a document can grow (the limit is 16 MB)
- how many documents we must update when something changes

Changing the shape later means migrating every stored document. In Lesson 3 the `$jsonSchema` validators will lock the shape in, so we decide it on paper first.

**Main rule:** data that is read together is stored together.

- **Embed:** put the data inside the parent document, as a nested object or an array.
- **Reference:** store only the other document's `_id`, and fetch that document separately when needed.

### The three questions (plus one)

| Question | If the answer is… | …then | Why |
| --- | --- | --- | --- |
| 1. Are they read together? | Yes | lean towards embed | One query instead of two |
| 2. How many: a few, or unbounded? | Unbounded | reference | A document can't be larger than 16 MB, and big arrays slow down every read and update |
| 3. Is it shared by many documents, or written often by many people? | Yes | reference | Otherwise one change means updating many copies, or one busy "hot spot" document |
| Bonus: do we need the value as it was at that moment? | Yes | embed a copy | Old records must not change when the original changes |

Question 3 does **not** mean "can it be edited on its own?". Almost anything can.

### Decisions

| # | Relationship | Read together? | How many? | Shared / hot spot? | Decision |
| --- | --- | --- | --- | --- | --- |
| 1 | users → address | Yes | A few | No | **Embed** |
| 2 | users → wallet | Yes | One | No | **Embed** |
| 3 | restaurants → owner | Rarely | One (but an owner can have several restaurants) | Yes | **Reference** `ownerId` |
| 4 | restaurants → dishes | Often | Hundreds, keeps growing | Yes (stock) | **Reference**: `dishes` collection |
| 5 | restaurants → reviews | Only the latest few | Unbounded | Yes | **Reference**: `reviews` collection, plus the latest 5 embedded |
| 6 | orders → items | Always | A few | No, frozen at order time | **Embed** a snapshot |
| 7 | orders → customer, restaurant, rider | Sometimes | One each, shared by many orders | Yes | **Reference** by id |
| 8 | reviews → customer, restaurant, order | Sometimes | One each, shared by many reviews | Yes | **Reference** by id |

### Why each decision

1. **users → address: embed.** The address belongs only to this user, there are only a few (home, work), and it rarely changes. It can be one object or a small array. Each address has a GeoJSON `location`.
2. **users → wallet: embed `wallet: { balance }`.** It's one number owned by one user, and only that user's orders and top-ups change it. A transaction history would keep growing, so that would need its own collection.
3. **restaurants → owner: reference `ownerId`.** The owner is already a document in `users`. Copying their email, phone and password hash into every restaurant would duplicate private data, and customers never see it anyway.
4. **restaurants → dishes: reference, with `restaurantId` on each dish.** A menu can have hundreds of dishes (Phase 3 imports a 1,000-row CSV). Dishes are also searched on their own (Phases 4 and 5). Stock changes on every order, so embedding would turn the restaurant document into a hot spot.
5. **restaurants → reviews: reference, with `restaurantId` on each review.** Reviews keep coming forever. The restaurant page shows only a few, so the restaurant also keeps a copy of the latest 5 (subset pattern, Phase 7).
6. **orders → items: embed a snapshot** (`dishId`, `name`, `price`, `qty`). The order must keep the name and price from order time, even if the dish changes later.
7. **orders → customer, restaurant, rider: reference** `customerId`, `restaurantId` and `riderId`. They already live in `users` and `restaurants`, and each one is shared by many orders. `riderId` is `null` until a rider claims the order.
8. **reviews → customer, restaurant, order: reference** `customerId`, `restaurantId` and `orderId`. Same reason as 7. There's one review per order, so `orderId` gets a unique index in Phase 7.

### Location format

Every location is GeoJSON, and **longitude comes first**:

```js
location: { type: "Point", coordinates: [77.2090, 28.6139] }   // [lng, lat]: Delhi
```

### What I got wrong at first

- **Wallet:** I chose reference. But it's one number owned by one user, so it's embedded.
- **Dishes:** I chose embed because the menu is shown with the restaurant. But menus grow, dishes are searched on their own, and stock changes on every order.
- **Question 3:** I read it as "can it change on its own?". It really asks "is it shared, or written often by many people?".

### Example documents

One example per collection, built from the decisions above. Money fields are plain numbers for now. Lesson 2 gives every field its BSON type.

#### users

```js
{
  _id: ObjectId("..."),
  name: "Himanshu",
  email: "himanshu@yopmail.com",
  passwordHash: "$2a$10$...",              // bcrypt hash, never the real password
  role: "customer",                        // customer | owner | rider | admin
  addresses: [
    {
      label: "home",
      line1: "12 MG Road",
      city: "Delhi",
      pincode: "110001",
      location: { type: "Point", coordinates: [77.2090, 28.6139] }   // [lng, lat]
    }
  ],
  wallet: { balance: 500.00 },             // money
  createdAt: ISODate("2024-05-20T08:00:00Z")
}
```

#### restaurants

```js
{
  _id: ObjectId("..."),
  name: "Taj Hotel",
  ownerId: ObjectId("..."),                // → users
  cuisines: ["North Indian", "Italian"],
  address: { line1: "8 Janpath", city: "Delhi", pincode: "110001" },
  location: { type: "Point", coordinates: [77.2195, 28.6250] },     // [lng, lat]
  isOpen: true,
  hours: { open: "09:00", close: "21:00" },  // 24-hour HH:MM compares correctly as text
  ratingSum: 540,
  ratingCount: 120,
  ratingAvg: 4.5,                          // stored ratingSum / ratingCount (computed pattern)
  lifetimeOrders: 1500,                    // counter that can grow very large
  latestReviews: [                         // copy of the newest 5 reviews (subset pattern)
    {
      reviewId: ObjectId("..."),
      customerName: "John Doe",
      rating: 5,
      text: "Great food and service!",
      createdAt: ISODate("2024-06-01T12:00:00Z")
    }
  ],
  createdAt: ISODate("2024-01-10T09:00:00Z")
}
```

#### dishes

```js
{
  _id: ObjectId("..."),
  restaurantId: ObjectId("..."),           // → restaurants
  name: "Paneer Butter Masala",
  price: 250.00,                           // money
  stock: 10,
  isVeg: true,
  tags: ["paneer", "spicy", "bestseller"],
  createdAt: ISODate("2024-06-01T09:00:00Z")
}
```

#### orders

```js
{
  _id: ObjectId("..."),
  customerId: ObjectId("..."),             // → users
  restaurantId: ObjectId("..."),           // → restaurants
  riderId: null,                           // set when a rider claims the order
  items: [                                 // snapshot: name and price at order time
    { dishId: ObjectId("..."), name: "Paneer Butter Masala", price: 250.00, qty: 2 }
  ],
  deliveryAddress: {                       // snapshot of the customer's address at order time
    line1: "12 MG Road",
    city: "Delhi",
    pincode: "110001",
    location: { type: "Point", coordinates: [77.2090, 28.6139] }
  },
  total: 500.00,                           // money
  status: "placed",
  idempotencyKey: UUID("3b241101-e2bb-4255-8caf-4136c566a962"),    // stops duplicate orders (Phase 6)
  createdAt: ISODate("2024-06-01T10:00:00Z"),
  deliveredAt: null                        // set when the order is delivered
}
```

`status` is always one of: `placed` → `accepted` → `preparing` → `ready` → `picked_up` → `delivered`, or `cancelled`.

#### reviews

```js
{
  _id: ObjectId("..."),
  customerId: ObjectId("..."),             // → users
  restaurantId: ObjectId("..."),           // → restaurants
  orderId: ObjectId("..."),                // → orders (one review per order)
  rating: 5,
  text: "Great food and service!",
  createdAt: ISODate("2024-06-01T12:00:00Z")
}
```
