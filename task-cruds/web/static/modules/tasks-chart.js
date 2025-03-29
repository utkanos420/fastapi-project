// tasks-chart.js
import { getTasks } from './task.js';

// Глобальная переменная для хранения экземпляра графика
let taskChartInstance = null;

export async function initTaskChart() {
    try {
        // Ожидаем загрузки всех зависимостей
        await waitForDependencies();
        
        const canvas = document.getElementById('taskChart');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        const tasks = await getTasks();
        renderChart(canvas, tasks);
    } catch (error) {
        console.error('Failed to initialize chart:', error);
        showErrorMessage();
    }
}

function waitForDependencies() {
    return new Promise((resolve) => {
        const checkDeps = () => {
            if (window.Chart && window.chroma) {
                resolve();
            } else {
                setTimeout(checkDeps, 100);
            }
        };
        checkDeps();
    });
}

function renderChart(canvas, tasks) {
    const ctx = canvas.getContext('2d');
    const preparedData = prepareChartData(tasks);
    
    // Удаляем предыдущий график если существует
    if (taskChartInstance) {
        taskChartInstance.destroy();
    }
    
    // Если нет данных для отображения
    if (preparedData.labels.length === 0) {
        canvas.style.display = 'none';
        const container = canvas.parentElement;
        container.innerHTML = '<p class="no-data-message">Нет задач с указанными сроками выполнения</p>';
        return;
    }
    
    taskChartInstance = new Chart(ctx, {
        type: 'bar',
        data: preparedData,
        options: getChartOptions()
    });
}

function prepareChartData(tasks) {
    const validTasks = tasks
        .filter(task => task.task_created_until_date)
        .sort((a, b) => new Date(a.task_created_until_date) - new Date(b.task_created_until_date));
    
    return {
        labels: validTasks.map(task => task.task_title),
        datasets: [{
            label: 'Дней до дедлайна',
            data: validTasks.map(task => calculateDaysUntilDue(task.task_created_until_date)),
            backgroundColor: validTasks.map(task => getValidColor(task.task_color)),
            borderColor: validTasks.map(task => chroma(getValidColor(task.task_color)).darken(0.5).hex()),
            borderWidth: 1,
            borderRadius: 4
        }]
    };
}

function getValidColor(color) {
    try {
        return color && chroma.valid(color) ? color : '#36A2EB';
    } catch {
        return '#36A2EB';
    }
}

function calculateDaysUntilDue(dueDate) {
    const diff = new Date(dueDate) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const days = context.raw;
                        return `${days} ${days % 10 === 1 ? 'день' : 'дней'} до дедлайна`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Дней до дедлайна' }
            },
            x: {
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    };
}

function showErrorMessage() {
    const container = document.querySelector('.chart-container');
    if (container) {
        container.innerHTML = '<p class="error-message">Не удалось загрузить график</p>';
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initTaskChart);