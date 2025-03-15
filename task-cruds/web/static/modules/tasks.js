
// tasks.js

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
    if (!showCompleted && task.is_completed === 1) return; // Скрываем выполненные, если флаг отключен

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
export function showTaskDetails(task) {
    document.getElementById('detail-title').textContent = task.task_title;
    document.getElementById('detail-desc').textContent = task.task_description;
    document.getElementById('detail-date').textContent = task.task_created_until_date;
    document.getElementById('task-detail-modal').classList.remove('hidden');
}

let showCompleted = false; // Флаг для отображения выполненных задач

// Загрузка всех задач с учетом фильтрации
export function loadTasks() {
    fetch('/api/v1/tasks')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.task-container').innerHTML = "";
            data.forEach(task => renderTask(task, "#28A745"));
        })
        .catch(error => console.error('Ошибка при загрузке задач:', error));
}

// Переключение отображения выполненных задач
export function toggleCompletedTasks() {
    showCompleted = !showCompleted;
    document.getElementById('showCompleted').textContent = showCompleted ? "Скрыть выполненные" : "Показать выполненные";
    loadTasks(); // Перезагрузка списка с учетом флага
}
