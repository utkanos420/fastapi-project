// static/modules/tasks.js

export function addTask(taskData, color) {
    fetch('/api/v1/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Задача добавлена:', data);
        renderTask(taskData, color);
    })
    .catch(error => console.error('Ошибка при добавлении задачи:', error));
}

// Отображение задачи в UI
function renderTask(task, color) {
    const taskContainer = document.querySelector('.task-container');
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.style.backgroundColor = color;

    taskElement.innerHTML = `
        <strong>${task.task_title}</strong><br>
        ${task.task_created_until_date ? `${task.task_created_until_date}` : 'Без срока'}
    `;

    taskElement.addEventListener('click', () => showTaskDetails(task));
    taskContainer.appendChild(taskElement);
}

// Отображение деталей задачи
function showTaskDetails(task) {
    document.getElementById('detail-title').textContent = task.task_title;
    document.getElementById('detail-desc').textContent = task.task_description;
    document.getElementById('detail-date').textContent = task.task_created_until_date;
    document.getElementById('task-detail-modal').classList.remove('hidden');
}

// Загрузка всех задач
export function loadTasks() {
    fetch('/api/v1/tasks')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.task-container').innerHTML = "";
            data.forEach(task => renderTask(task, "#1e1e1e"));
        })
        .catch(error => console.error('Ошибка при загрузке задач:', error));
}
