const method = process.argv[2];

const payload = {
    id:
}

switch (method) {
  case "add":
    console.log("add");

    break;
  case "update":
    console.log("update");
    break;
  case "delete":
    console.log("delete");
    break;
  case "mark-in-progress":
    console.log("mark progress");
    break;
  case "mark-done":
    console.log("mark-done");
    break;
  case "mark-todo":
    console.log("mark todo");
    break;
  case "progress":
    console.log("progress");
    break;
  case "done":
    console.log("done");
    break;
  case "todo":
    console.log("todo");
    break;
  default:
    console.log("wrong number!");
}
