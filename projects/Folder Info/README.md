# Folder Info

A small Node.js CLI that inspects a folder and reports how many files and subfolders it contains.

Built for the [Folder Info](https://roadmap.sh/projects/nodejs-folder-info) project on roadmap.sh.

## Usage

Run it from inside this folder:

```
node folder-info.js              # inspect the current folder
node folder-info.js <path>       # inspect another folder
```

`<path>` can be relative or absolute. Wrap it in quotes if it contains spaces.

## Output

```
{
  folder: 'nodejs',
  path: 'C:\\Projects\\practice\\nodejs',
  file: 4,
  folders: 5
}
```

| Field | Meaning |
|---|---|
| `folder` | Name of the inspected folder |
| `path` | Its absolute path |
| `file` | Number of files directly inside it |
| `folders` | Number of everything else directly inside it: subfolders, plus any symlinks or junctions |

Only the top level is counted, not the contents of subfolders. Hidden files are included.

## Errors

If the folder doesn't exist or can't be read, Node's error and stack trace are printed and the exit code is 1.

## Requirements

Node.js (tested on v24). No dependencies.

The script uses ES module imports, which work here because the repo's root `package.json` sets `"type": "module"`.
