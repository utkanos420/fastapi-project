import { addTask, loadTasks, toggleCompletedTasks } from './modules/tasks.js';
import { updateStatistics } from './modules/tasks-stats.js';
import './modules/tasks-chart.js';

document.querySelectorAll('.color-block').forEach(block => {
    block.addEventListener('click', function() {
        const selectedColor = this.getAttribute('data-color');
        document.getElementById('custom-color-block').style.backgroundColor = selectedColor;
        document.getElementById('task-color').value = selectedColor;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateStatistics();
});

document.getElementById('showCompleted').addEventListener('click', toggleCompletedTasks);

document.getElementById('add-task').addEventListener('click', () => {
    document.getElementById('task-modal').classList.remove('hidden');
});

document.getElementById('task-color').addEventListener('input', function(event) {
    const selectedColor = event.target.value;
    document.getElementById('task-color').style.backgroundColor = selectedColor;
});

document.getElementById('delete-task').addEventListener('click', () => {
    const taskId = document.getElementById('delete-task').dataset.taskId;
    if (!taskId) {
        console.error('Не найден ID задачи.');
        return;
    }

    fetch(`/api/v1/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: 1 }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Задача завершена:', data);
        loadTasks();
        updateStatistics();
        document.getElementById('task-detail-modal').classList.add('hidden');
    })
    .catch(error => console.error('Ошибка при завершении задачи:', error));
});


document.getElementById('save-task').addEventListener('click', () => {
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const dueDate = new Date(document.getElementById('task-date').value).toISOString().split('T')[0];
    const color = document.getElementById('task-color').value;

    if (!title || !desc || !dueDate) {
        alert('Заполните все поля!');
        return;
    }

    const taskData = {
        task_title: title,
        task_description: desc,
        task_importance: 0,
        task_created_date: new Date().toISOString(),
        task_created_until_date: dueDate,
        is_completed: 0,
        task_color: color
    };

    console.log('Отправляемые данные:', taskData);
    addTask(taskData, color);
    document.getElementById('task-modal').classList.add('hidden');
});

document.getElementById('close-task-modal').addEventListener('click', () => {
    document.getElementById('task-modal').classList.add('hidden');
});

document.getElementById('close-detail').addEventListener('click', () => {
    document.getElementById('task-detail-modal').classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

function checkWindowSize() {
    const warning = document.getElementById('resize-warning');
    if (window.innerWidth < 800) { // Устанавливаем минимальную ширину для отображения предупреждения
        warning.style.display = 'block';
    } else {
        warning.style.display = 'none';
    }
}

// Проверка при загрузке страницы и при изменении размера окна
window.addEventListener('load', checkWindowSize);
window.addEventListener('resize', checkWindowSize);

