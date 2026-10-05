# Node.js Mastery

```
practice/     learning code, grouped by topic (fs, events, streams, ...)
challenges/   mini-challenges, grouped by topic, same names as practice/
projects/     one folder per project (each self-contained)
```

Files are numbered per topic: `practice/fs/01-open-read-watch.js`, `challenges/fs/01-journal.js`.

Run from the repo root, e.g. `node challenges/fs/01-journal.js`.
Add a new project with `mkdir projects/<name>`.

## Projects

Each project is self-contained, with its own `package.json` and `node_modules`:

```
mkdir projects/<name> && cd projects/<name>
npm init -y
npm pkg set type=module
```

Run its scripts from inside its folder. The root `package.json` only serves `practice/` and `challenges/`.

| Project | Spec |
|---|---|
| [Folder Info](projects/Folder%20Info/) | https://roadmap.sh/projects/nodejs-folder-info |
