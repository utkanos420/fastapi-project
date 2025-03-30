import { showTaskDetails } from './tasks.js';

export function updateStatistics() {
    fetch('/api/v1/tasks')
        .then(response => response.json())
        .then(data => {
            const totalTasks = data.length;
            let taskLabel;

            if (totalTasks % 10 === 1 && totalTasks % 100 !== 11) {
                taskLabel = 'активная задача';
            } else if (totalTasks % 10 >= 2 && totalTasks % 10 <= 4 && (totalTasks % 100 < 10 || totalTasks % 100 >= 20)) {
                taskLabel = 'активные задачи';
            } else {
                taskLabel = 'активных задач';
            }

            const result = `${totalTasks} ${taskLabel}`;
            const countCompletedTasks = Math.round((data.filter(task => task.is_completed === 1).length / data.length) * 100) + ' %';

            document.getElementById('total-tasks').textContent = result;
            document.getElementById('completed-tasks').textContent = countCompletedTasks;

            const lastTask = data.filter(task => task.is_completed !== 1).sort((a, b) => new Date(b.task_created_date) - new Date(a.task_created_date))[0];
            if (lastTask) {
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

    const viewButton = statsContainer.querySelector('.view-task-btn');
    viewButton.addEventListener('click', () => {
        showTaskDetails(task);
    });
}
