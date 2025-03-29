// tasks-chart.js
import { getTasks } from './task.js';

let taskChartInstance = null;

export async function initTaskChart() {
    try {
        await waitForDependencies();
        const canvas = document.getElementById('taskChart');
        if (!canvas) {
            console.warn('Canvas element not found');
            return;
        }
        
        const tasks = await getTasks();
        renderChart(canvas, tasks);
    } catch (error) {
        console.error('Chart initialization error:', error);
        showError();
    }
}

function waitForDependencies() {
    return new Promise((resolve) => {
        const check = () => {
            if (window.Chart && window.chroma) resolve();
            else setTimeout(check, 100);
        };
        check();
    });
}

function renderChart(canvas, tasks) {
    const ctx = canvas.getContext('2d');
    const { chartData, dateRange } = prepareChartData(tasks);
    
    // Удаляем предыдущий график если существует
    if (taskChartInstance) {
        taskChartInstance.destroy();
    }
    
    // Если нет данных для отображения
    if (chartData.labels.length === 0) {
        canvas.style.display = 'none';
        const container = canvas.parentElement;
        container.innerHTML = '<p class="no-data-message">Нет задач с указанными сроками выполнения</p>';
        return;
    }
    
    taskChartInstance = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: getChartOptions(dateRange)
    });
}

function prepareChartData(tasks) {
    const validTasks = tasks
        .filter(task => task.task_created_until_date)
        .sort((a, b) => new Date(a.task_created_until_date) - new Date(b.task_created_until_date));
    
    return {
        chartData: {
            labels: validTasks.map(task => task.task_title),
            datasets: [{
                label: 'Дней до дедлайна',
                data: validTasks.map(task => calculateDaysUntilDue(task.task_created_until_date)),
                backgroundColor: validTasks.map(task => getValidColor(task.task_color)),
                borderColor: validTasks.map(task => chroma(getValidColor(task.task_color)).darken(0.5).hex()),
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        dateRange: {
            min: new Date(Math.min(...validTasks.map(t => new Date(t.task_created_until_date)))),
            max: new Date(Math.max(...validTasks.map(t => new Date(t.task_created_until_date))))
        }
    };
}

function calculateDaysUntilDue(dueDate) {
    const diff = new Date(dueDate) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getValidColor(color) {
    try {
        return color && chroma.valid(color) ? color : '#36A2EB';
    } catch {
        return '#36A2EB';
    }
}

function getChartOptions(dateRange) {
    return {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: { day: 'd MMM' },
                    tooltipFormat: 'd MMM yyyy'
                },
                min: dateRange.min,
                max: dateRange.max,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#aaa'
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#fff',
                    font: {
                        size: 12
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#424242',
                titleColor: '#fff',
                bodyColor: '#eee',
                callbacks: {
                    label: (context) => {
                        const task = tasks.find(t => t.task_title === context.label);
                        const date = new Date(task.task_created_until_date).toLocaleDateString('ru-RU');
                        return [
                            `Срок: ${date}`,
                            `Статус: ${task.is_completed ? 'Выполнена' : 'Не выполнена'}`,
                            task.task_description || 'Без описания'
                        ];
                    }
                }
            }
        }
    };
}

function showError() {
    const container = document.querySelector('.chart-container');
    if (container) {
        container.innerHTML = '<p class="error-message">Не удалось загрузить график</p>';
    }
}

document.addEventListener('DOMContentLoaded', initTaskChart);