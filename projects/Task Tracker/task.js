const method = process.argv[2];
/*
# Adding a new task
task-cli add "Buy groceries"
# Output: Task added successfully (ID: 1)

# Updating and deleting tasks
task-cli update 1 "Buy groceries and cook dinner"
task-cli delete 1

# Marking a task as in progress or done
task-cli mark-in-progress 1
task-cli mark-done 1

# Listing all tasks
task-cli list

# Listing tasks by status
task-cli list done
task-cli list todo
task-cli list in-progress


id: A unique identifier for the task
description: A short description of the task
status: The status of the task (todo, in-progress, done)
createdAt: The date and time when the task was created
updatedAt: The date and time when the task was last updated
*/

switch (method) {
  case "add":
    console.log("add");
    const description = process.argv[3];
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
