
// main.js
import { addTask, loadTasks, toggleCompletedTasks } from './modules/tasks.js';
import { updateStatistics } from './modules/tasks-stats.js';

document.querySelectorAll('.color-block').forEach(block => {
    block.addEventListener('click', function() {
        // Обновляем выбранный цвет
        const selectedColor = this.getAttribute('data-color');
        document.getElementById('custom-color-block').style.backgroundColor = selectedColor;
        document.getElementById('task-color').value = selectedColor;  // Если нужно, можно использовать скрытое поле input[type="color"]
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateStatistics(); // Обновляем статистику при загрузке страницы
});

document.getElementById('showCompleted').addEventListener('click', toggleCompletedTasks);

document.getElementById('add-task').addEventListener('click', () => {
    document.getElementById('task-modal').classList.remove('hidden');
});

document.getElementById('task-color').addEventListener('input', function(event) {
    const selectedColor = event.target.value;
    // Обновляем цвет полоски с помощью выбранного значения
    document.getElementById('task-color').style.backgroundColor = selectedColor;
});

// Сохраняем выбранный цвет задачи
document.getElementById('save-task').addEventListener('click', () => {
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const dueDate = document.getElementById('task-date').value;
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
    };

    addTask(taskData, color);
    document.getElementById('task-modal').classList.add('hidden');
});

// Закрытие модальных окон
document.getElementById('close-task-modal').addEventListener('click', () => {
    document.getElementById('task-modal').classList.add('hidden');
});

document.getElementById('close-detail').addEventListener('click', () => {
    document.getElementById('task-detail-modal').classList.add('hidden');
});

// Загрузка задач при открытии страницы
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});
