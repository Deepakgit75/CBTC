document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task-button');
    const filterButtons = document.querySelectorAll('.filter-button');

    addTaskButton.addEventListener('click', addTask);
    filterButtons.forEach(button => button.addEventListener('click', filterTasks));

    loadTasks();

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText === '') return;

        const taskItem = createTaskItem(taskText);
        taskList.appendChild(taskItem);
        newTaskInput.value = '';

        saveTasks();
    }

    function createTaskItem(taskText, isCompleted = false) {
        const li = document.createElement('li');
        const timestamp = new Date().toLocaleString();
        li.textContent = `${taskText} (Added: ${timestamp})`;

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.className = 'complete-button';
        completeButton.addEventListener('click', () => {
            li.classList.toggle('completed');
            completeButton.textContent = li.classList.contains('completed') ? 'Undo' : 'Complete';
            saveTasks();
        });

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.addEventListener('click', () => editTask(li));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(li);
            saveTasks();
        });

        li.appendChild(completeButton);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        if (isCompleted) {
            li.classList.add('completed');
            completeButton.textContent = 'Undo';
        }

        return li;
    }

    function editTask(taskItem) {
        const taskText = taskItem.firstChild.textContent.split(' (Added: ')[0];
        const newTaskText = prompt('Edit your task', taskText);
        if (newTaskText) {
            taskItem.firstChild.textContent = `${newTaskText} (Added: ${new Date().toLocaleString()})`;
            saveTasks();
        }
    }

    function filterTasks(e) {
        const filter = e.target.getAttribute('data-filter');
        const tasks = taskList.children;
        for (let task of tasks) {
            switch (filter) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'active':
                    task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
                    break;
                case 'completed':
                    task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                    break;
            }
        }
    }

    function saveTasks() {
        const tasks = [];
        for (let task of taskList.children) {
            tasks.push({
                text: task.firstChild.textContent.split(' (Added: ')[0],
                isCompleted: task.classList.contains('completed')
            });
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        for (let task of tasks) {
            const taskItem = createTaskItem(task.text, task.isCompleted);
            taskList.appendChild(taskItem);
        }
    }
});
