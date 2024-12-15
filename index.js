#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const chalk = require('chalk');

const tasksFilePath = path.join(__dirname, 'tasks.json');


//Load Task
const loadTodos = () => {
    try {

        const rawData = fs.readFileSync(tasksFilePath);
        const jsonData = JSON.parse(rawData.toString());

        return jsonData;

    } catch (e) {
        return [];
    }
}

//Save task
const saveTodos = (todos) => {
    const jsonTasks = JSON.stringify(todos);
    fs.writeFileSync(tasksFilePath, jsonTasks);
}

//List Task
yargs.command({
    command: 'ls',
    describe: 'List all tasks',
    aliases: 'list',
    handler() {
        const todos = loadTodos();

        if (todos.length === 0) {
            console.log(chalk.yellow('No tasks to show. Add using '), chalk.cyan("sisi add \"task_name\" "));
        }
        else {
            console.log(chalk.yellowBright("Your tasks ✨"));
            todos.forEach((todo, index) => {
                console.log(`${chalk.magenta.bold('[' + index + '].')} ${chalk.cyan(todo.task)} --- ${todo.completed ? chalk.bgGreen.bold('Completed') + '✅' : chalk.bgRed.bold('Pending') + '⚠️'}`);
            });
        }
    }
});

//Mark as completed
yargs.command({
    command: 'complete <index>',
    describe: 'Marking a task as complete',
    positional: ('index', {
        describe: 'Task index',
        demandOption: true,
        type: 'number'
    }),
    //builder: {
    // index: {
    //     describe: 'Task index',
    //     demandOption: true,
    //     type: 'number'
    // }
    // },
    handler(argv) {
        const todos = loadTodos();
        const indexToMark = argv.index;

        if (indexToMark >= todos.length || indexToMark < 0) {
            console.log(chalk.red("Task not found. Invalid task index"));
        }
        else {
            const todo = todos[indexToMark]

            if (todo.completed === true) {
                console.log(chalk.green(`The task "${todo.task}" has already been completed!\n`));
                // return;
            }
            else if (todo.completed === false) {
                todo.completed = true;
                console.log(chalk.green(`Marked task "${todo.task}" as completed!\n`));
            }

            saveTodos(todos);

            const newTodos = loadTodos();

            console.log(chalk.yellowBright("Your tasks ✨"));
            newTodos.forEach((todo, index) => {
                console.log(`${chalk.magenta.bold('[' + index + '].')} ${chalk.cyan(todo.task)} --- ${todo.completed ? chalk.bgGreen.bold('Completed') + '✅' : chalk.bgRed.bold('Pending') + '⚠️'}`);
            });
        }

    }
});

//Mark as pending
yargs.command({
    command: 'pending <index>',
    describe: 'Marking a task as pending',
    positional: ('index', {
        describe: 'Task index',
        demandOption: true,
        type: 'number'
    }),
    // builder: {
    //     index: {
    //         describe: 'Task index',
    //         demandOption: true,
    //         type: 'number'
    //     }
    // },
    handler(argv) {
        const todos = loadTodos();
        const indexToMark = argv.index;

        if (indexToMark >= todos.length || indexToMark < 0) {
            console.log(chalk.red("Task not found. Invalid task index"));
        }
        else {
            const todo = todos[indexToMark]

            if (todo.completed === false) {
                console.log(chalk.green(`The task "${todo.task}" is yet to be completed!\n`));
            }
            else if (todo.completed === true) {
                todo.completed = false;
                console.log(chalk.green(`Marked task "${todo.task}" as pending!\n`));
            }

            saveTodos(todos);

            const newTodos = loadTodos();

            console.log(chalk.yellowBright("Your tasks ✨"));
            newTodos.forEach((todo, index) => {
                console.log(`${chalk.magenta.bold('[' + index + '].')} ${chalk.cyan(todo.task)} --- ${todo.completed ? chalk.bgGreen.bold('Completed') + '✅' : chalk.bgRed.bold('Pending') + '⚠️'}`);
            });

        }

    }
});

//Create Task
yargs.command({
    command: 'add <task>',
    describe: 'Add a new task',
    positional: ('task', {
        describe: 'Task description',
        demandOption: true,
        type: 'string'
    }),
    // builder: {
    //     task: {
    //         describe: 'Task description',
    //         demandOption: true,
    //         type: 'string'
    //     }
    // },
    handler(argv) {
        // argv = parseTaskArgument(argv);
        const todos = loadTodos();

        todos.push({
            task: argv.task,
            completed: false
        });

        saveTodos(todos);

        console.log(chalk.blue(`Added new todo: ${argv.task}\n`));

        const newTodos = loadTodos();

        console.log(chalk.yellowBright("Your tasks ✨"));
        newTodos.forEach((todo, index) => {
            console.log(`${chalk.magenta.bold('[' + index + '].')} ${chalk.cyan(todo.task)} --- ${todo.completed ? chalk.bgGreen.bold('Completed') + '✅' : chalk.bgRed.bold('Pending') + '⚠️'}`);
        });
    }
});

//Edit task
yargs.command({
    command: 'edit <index> <task>',
    describe: 'Edit a task using its index',
    aliases: 'modify <index> <task>',
    positional: ('index', {
        describe: 'Task index',
        demandOption: true,
        type: 'number'
    }),
    positional: ('task', {
        describe: 'Task name',
        demandOption: true,
        type: 'string'
    }),
    handler(argv) {
        const todos = loadTodos();

        const indexToEdit = argv.index;
        const updatedTask = argv.task;

        if (indexToEdit >= todos.length || indexToEdit < 0) {
            console.log(chalk.red('Invalid index or command! Try using ', chalk.cyan('sisi edit <index> <"task_name">')));
            return;
        }

        todos[indexToEdit].task = updatedTask;
        console.log(chalk.green(`Your task at index ${indexToEdit} has been edited successfully!\n`));

        saveTodos(todos);

        console.log(chalk.yellowBright("Your tasks ✨"));
        todos.forEach((todo, index) => {
            console.log(`${chalk.magenta.bold('[' + index + '].')} ${chalk.cyan(todo.task)} --- ${todo.completed ? chalk.bgGreen.bold('Completed') + '✅' : chalk.bgRed.bold('Pending') + '⚠️'}`);
        });
    }

});

//Delete Task
yargs.command({
    command: 'delete <index>',
    describe: 'Delete a task (or) Delete multiple tasks',
    aliases: 'remove <index>',
    positional: ('index', {
        describe: 'Task index',
        demandOption: true,
        type: 'string'
    }),
    // builder: {
    //     index: {
    //         describe: 'Task index',
    //         demandOption: true,
    //         type: 'string'
    //     }
    // },
    handler(argv) {
        const todos = loadTodos();

        if (todos.length === 0) {
            console.log(chalk.yellow('No tasks to show. Add using '), chalk.cyan("sisi add \"task_name\""));
            return;
        }

        let filteredTodos = [];
        let deletedTodos = [];
        let invalidIndices = [];
        let indicesToDelete = [];

        argv.index = String(argv.index);

        const inputIndices = argv.index;

        if (inputIndices.includes(" ") && inputIndices.split(" ").length > 1) {
            inputIndices.split(" ").forEach(i => {
                i = parseInt(i.trim());
                if (!isNaN(i) && i !== "") {
                    indicesToDelete.push(i);
                }
            });
        }
        else if (inputIndices.includes(",") && inputIndices.split(",").length > 1) {
            inputIndices.split(",").forEach(i => {
                i = parseInt(i.trim());
                if (!isNaN(i) && i !== "") {
                    indicesToDelete.push(i);
                }
            });
        }
        else if (inputIndices.trim().split(" ").length === 1) {
            const idx = parseInt(inputIndices.trim());
            indicesToDelete.push(idx);
        }

        todos.forEach((todo, index) => {
            if (!indicesToDelete.includes(index)) {
                filteredTodos.push(todo);
            }
        });

        saveTodos(filteredTodos);

        todos.forEach((todo, index) => {
            if (indicesToDelete.includes(index)) {
                deletedTodos.push(todo);
                return;
            }
        });

        indicesToDelete.forEach(i => {
            if (i >= todos.length) {
                invalidIndices.push(i);
            }
        })

        deletedTodos.map(todo => console.log(chalk.blue(`Your task: ${todo.task}, has been removed!\n`)));

        if (invalidIndices.length === 1) {
            console.log(chalk.red(`Invalid index: ${invalidIndices[0]}`));
        }
        else if (invalidIndices.length > 1) {
            console.log(chalk.red(`Invalid indices: ${[...invalidIndices]}`));
        }

        const newTodos = loadTodos();

        if (newTodos.length > 0) {
            console.log(chalk.yellowBright("Your tasks ✨"));
            newTodos.forEach((todo, index) => {
                console.log(`${chalk.magenta.bold('[' + index + '].')} ${chalk.cyan(todo.task)} --- ${todo.completed ? chalk.bgGreen.bold('Completed') + '✅' : chalk.bgRed.bold('Pending') + '⚠️'}`);
            });
        }
        else {
            console.log(chalk.yellow('No tasks to show. Add using '), chalk.cyan("sisi add \"task_name\""));
        }

    }
});

yargs.scriptName("sisi");
yargs.parse();