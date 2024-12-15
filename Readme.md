![NPM Downloads](https://img.shields.io/npm/dy/sisi-cli?style=flat)

## Description

Stay organized on the go! A lightweight CLI app to manage your tasks and boost productivity, right from the command line!



## Installation

```
npm i -g sisi-cli
```


## Usage

- **`sisi ls`** - Lists all your tasks [`sisi list` also does the same].

- **`sisi add "task_name"`** - Creates a new todo. Example: `sisi add "Fix bug: works on my machine. 🤷‍♂️"`.

- **`sisi edit <index> <"task_name">`** - Edits a todo. [`sisi modify` also does the same]. Example: `sisi edit 2 "I just edited the task in index 2"`.

- **`sisi complete <task_index>`** - Marks a todo as completed.

- **`sisi pending <task_index>`** - Marks a todo as pending.

- **`sisi delete <index1,index2,...>`** - Delete todos. [`sisi remove` also does the same].

- **`sisi help`** - Displays available commands.



## Windows

If you're on Windows, do yourself a favor and use [Windows Terminal](https://github.com/microsoft/terminal) instead of `cmd.exe`.



## Maintainer

- [Sree Shivesh](https://github.com/shivxsh)