import { showTaskDetails } from './tasks.js';

export function updateStatistics() {
    fetch('/api/v1/tasks')
        .then(response => response.json())
        .then(data => {
            const totalTasks = data.length;
            let taskLabel;

            // Правильное определение склонения
            if (totalTasks % 10 === 1 && totalTasks % 100 !== 11) {
                taskLabel = 'активная задача';
            } else if (totalTasks % 10 >= 2 && totalTasks % 10 <= 4 && (totalTasks % 100 < 10 || totalTasks % 100 >= 20)) {
                taskLabel = 'активные задачи';
            } else {
                taskLabel = 'активных задач';
            }

            const result = `${totalTasks} ${taskLabel}`;

            // Подсчёт завершённых задач (is_completed === 1)
            const countCompletedTasks = Math.round((data.filter(task => task.is_completed === 1).length / totalTasks) * 100) + ' %';

            // Обновление текста статистики на странице
            document.getElementById('total-tasks').textContent = result;
            document.getElementById('completed-tasks').textContent = countCompletedTasks;

            // Поиск последней активной задачи (is_completed === 0)
            const lastTask = data.filter(task => task.is_completed === 0).sort((a, b) => new Date(b.task_created_date) - new Date(a.task_created_date))[0];
            if (lastTask) {
                displayLastTask(lastTask);
            }

            // Обработка последнего обновления (задача с максимальным id)
            const lastUpdatedTask = data.reduce((maxTask, task) => (task.id > maxTask.id ? task : maxTask), data[0]);
            const lastUpdatedDate = lastUpdatedTask ? formatDate(lastUpdatedTask.task_created_date) : 'неизвестно';
            document.getElementById('last-updated').textContent = lastUpdatedDate;

            // Подсчёт оставшихся задач (is_completed !== 1)
            const remainingTasksCount = data.filter(task => task.is_completed !== 1).length;
            document.getElementById('remaining-tasks').textContent = remainingTasksCount;
        })
        .catch(error => console.error('Ошибка при обновлении статистики:', error));
}

function displayLastTask(task) {
    const statsContainer = document.querySelector('.statistics-container');
    statsContainer.innerHTML = `
    <h3>Последнее обновление</h3>
    <div class="last-task" style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
        <div class="task-card" style="background-color: ${task.task_color || '#28A745'}; text-align: center;">
            <strong>${task.task_title}</strong><br>
            ${task.task_created_until_date ? `До: ${task.task_created_until_date}` : 'Без срока'}
        </div>
        <button class="view-task-btn" data-task-id="${task.id}">Перейти к задаче</button>
    </div>
`;

    const viewButton = statsContainer.querySelector('.view-task-btn');
    viewButton.addEventListener('click', () => {
        showTaskDetails(task);
    });
}

// Функция для форматирования даты в MM/DD/YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяц: 01, 02, ..., 12
    const day = String(date.getDate()).padStart(2, '0'); // День: 01, 02, ..., 31
    const year = date.getFullYear(); // Год: 2025

    return `${month}/${day}/${year}`;
}
