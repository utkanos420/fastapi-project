import { getTasks } from './task.js';

let taskChartInstance = null;

export async function initTaskChart() {
    try {
        await waitForDependencies();
        const canvas = document.getElementById('taskChart');
        if (!canvas) return;
        
        const tasks = await getTasks();
        renderTimeline(canvas, tasks);
    } catch (error) {
        console.error('Ошибка инициализации:', error);
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

function renderTimeline(canvas, tasks) {
    const ctx = canvas.getContext('2d');
    const { data, options } = prepareTimelineData(tasks);
    
    if (taskChartInstance) taskChartInstance.destroy();
    
    if (data.datasets[0].data.length === 0) {
        canvas.style.display = 'none';
        canvas.parentElement.innerHTML = '<p class="no-data">Нет задач для отображения</p>';
        return;
    }
    
    taskChartInstance = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

function prepareTimelineData(tasks) {
    const validTasks = tasks
        .filter(task => task.task_created_until_date)
        .sort((a, b) => new Date(a.task_created_until_date) - new Date(b.task_created_until_date));
    
    const dates = validTasks.map(t => new Date(t.task_created_until_date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    minDate.setDate(minDate.getDate() - 2);
    maxDate.setDate(maxDate.getDate() + 2);
    
    const data = {
        labels: validTasks.map(task => task.task_title),
        datasets: [{
            label: 'Задачи',
            data: validTasks.map(task => ({
                x: task.task_created_until_date,
                y: 1,
                task: task
            })),
            backgroundColor: validTasks.map(task => getValidColor(task.task_color)),
            borderColor: validTasks.map(task => chroma(getValidColor(task.task_color)).darken(0.5).hex()),
            borderWidth: 1,
            borderRadius: 4,
            barThickness: 20
        }]
    };
    
    const options = {
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
                min: minDate,
                max: maxDate,
                position: 'bottom',
                grid: {
                    display: true,
                    color: 'rgba(255,255,255,0.1)'
                }
            },
            y: {
                display: false,
                beginAtZero: true
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    title: (items) => items[0].raw.task.task_title,
                    label: (item) => {
                        const task = item.raw.task;
                        const date = new Date(task.task_created_until_date).toLocaleDateString('ru-RU');
                        return [
                            `Срок: ${date}`,
                            `Статус: ${task.is_completed ? '✅ Выполнена' : '❌ Не выполнена'}`,
                            task.task_description || 'Без описания'
                        ];
                    }
                }
            }
        }
    };
    
    return { data, options };
}

function getValidColor(color) {
    try {
        return color && chroma.valid(color) ? color : '#36A2EB';
    } catch {
        return '#36A2EB';
    }
}

function showError() {
    const container = document.querySelector('.chart-container');
    if (container) {
        container.innerHTML = '<p class="error">Не удалось загрузить временную шкалу</p>';
    }
}

document.addEventListener('DOMContentLoaded', initTaskChart);