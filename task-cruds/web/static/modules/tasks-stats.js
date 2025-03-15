
// tasks-stats.js
import { showTaskDetails } from './tasks.js';

export function updateStatistics() {
    fetch('/api/v1/tasks')
        .then(response => response.json())
        .then(data => {
            const totalTasks = data.length + ' активная задача';

            const archivedTasks = data.filter(task => task.is_archived === 1).length;
            const averageImportance = data.reduce((sum, task) => sum + task.task_importance, 0) / totalTasks || 0;
            const countCompletedTasks = (data.filter(task => task.is_archived === 0).length / data.length) * 100 + ' %';

            // Обновляем отображение статистики
            document.getElementById('total-tasks').textContent = totalTasks;
            document.getElementById('completed-tasks').textContent = countCompletedTasks;

            // Получаем последнее незавершенное задание
            const lastTask = data.filter(task => task.is_completed !== 1).sort((a, b) => new Date(b.task_created_date) - new Date(a.task_created_date))[0];
            if (lastTask) {
                // Добавляем блок с последней задачей в статистику
                displayLastTask(lastTask);
            }
        })
        .catch(error => console.error('Ошибка при обновлении статистики:', error));
}

function displayLastTask(task) {
    const statsContainer = document.querySelector('.statistics-container');
    statsContainer.innerHTML = `
        <h3>Последнее обновление</h3>
        <div class="last-task">
            <div class="task-card" style="background-color: ${task.task_color || '#28A745'}">
                <strong>${task.task_title}</strong><br>
                ${task.task_created_until_date ? `До: ${task.task_created_until_date}` : 'Без срока'}
            </div>
            <button class="view-task-btn" data-task-id="${task.id}">Перейти к задаче</button>
        </div>
    `;

    // Добавляем обработчик на кнопку перехода к задаче
    const viewButton = statsContainer.querySelector('.view-task-btn');
    viewButton.addEventListener('click', () => {
        showTaskDetails(task);
    });
}
