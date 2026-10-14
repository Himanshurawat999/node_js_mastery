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

data formate
id: A unique identifier for the task
description: A short description of the task
status: The status of the task (todo, in-progress, done)
createdAt: The date and time when the task was created
updatedAt: The date and time when the task was last updated
*/

import path from "node:path";
import fs from "node:fs";

const method = process.argv[2];

const DB_PATH = path.join(import.meta.dirname, "db.json");

const date = new Date().toISOString();

const readTasks = () => {
  if (!fs.existsSync(DB_PATH)) return [];
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return raw.trim() ? JSON.parse(raw) : [];
};

const writeTasks = (tasks) =>
  fs.writeFileSync(DB_PATH, JSON.stringify(tasks, null, 2));

const getNextId = (tasks) => (tasks.length ? tasks.length + 1 : 1);

switch (method) {
  case "add": {
    const description = process.argv[3];
    if (!description) {
      console.log('usage: node task.js add "Description"');
      break;
    }
    const tasks = readTasks();
    const task = {
      id: getNextId(tasks),
      description,
      status: "todo",
      createdAt: date,
      updatedAt: date,
    };
    tasks.push(task);
    writeTasks(tasks);
    console.log(`Task added successfully (ID: ${task.id})`);
    break;
  }

  case "update": {
    const id = Number(process.argv[3]);
    const newDescription = process.argv[4];
    const tasks = readTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      console.log(`Task with id: ${id} not found`);
      break;
    }
    task.description = newDescription;
    task.updatedAt = date;
    writeTasks(tasks);
    console.log(`Task updated successfully (ID: ${task.id})`);
    break;
  }

  case "delete": {
    console.log("delete");
    break;
  }
  case "mark-in-progress": {
    console.log("mark progress");
    break;
  }
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
