// To-Do List Application with Local Storage

class Task {
    constructor(title) {
        this.title = title;
        this.completed = false;
    }
}

class ToDoList {
    constructor() {
        this.tasks = this.loadTasks();
    }

    loadTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addTask(title) {
        const task = new Task(title);
        this.tasks.push(task);
        this.saveTasks();
    }

    removeTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
    }

    toggleTask(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
        this.saveTasks();
    }

    renderTasks(container) {
        container.innerHTML = '';
        this.tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.innerHTML = `
                <input type='checkbox' ${task.completed ? 'checked' : ''} onclick='todoList.toggleTask(${index})'>
                <span class='title'>${task.title}</span>
                <button onclick='todoList.removeTask(${index})'>Delete</button>
            `;
            container.appendChild(taskElement);
        });
    }
}

const todoList = new ToDoList();
const taskContainer = document.getElementById('taskContainer');

document.getElementById('addTaskBtn').onclick = function() {
    const taskTitle = document.getElementById('taskInput').value;
    if (taskTitle) {
        todoList.addTask(taskTitle);
        todoList.renderTasks(taskContainer);
        document.getElementById('taskInput').value = '';
    }
};

todoList.renderTasks(taskContainer);