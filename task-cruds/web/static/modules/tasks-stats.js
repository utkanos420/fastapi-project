// static/modules/statistics.js

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
            //document.getElementById('archived-tasks').textContent = archivedTasks;
            //document.getElementById('avg-importance').textContent = averageImportance.toFixed(2);
            document.getElementById('completed-tasks').textContent = countCompletedTasks
        })
        .catch(error => console.error('Ошибка при обновлении статистики:', error));
}
