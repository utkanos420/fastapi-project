// tasks-chart.js
import { getTasks } from './task.js';

let taskTimelineInstance = null;

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
    const { timelineData, dateRange } = prepareTimelineData(tasks);
    
    // Очищаем предыдущий график
    if (taskTimelineInstance) taskTimelineInstance.destroy();
    
    // Создаём временную шкалу
    taskTimelineInstance = new Chart(ctx, {
        type: 'bar',
        data: timelineData,
        options: getTimelineOptions(dateRange)
    });
}

function prepareTimelineData(tasks) {
    const validTasks = tasks
        .filter(task => task.task_created_until_date)
        .sort((a, b) => new Date(a.task_created_until_date) - new Date(b.task_created_until_date));
    
    // Определяем диапазон дат
    const dates = validTasks.map(t => new Date(t.task_created_until_date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    minDate.setDate(minDate.getDate() - 2);
    maxDate.setDate(maxDate.getDate() + 2);
    
    // Формируем данные для графика
    const datasets = validTasks.map(task => ({
        label: task.task_title,
        data: [{
            x: task.task_created_until_date,
            y: 0,
            task: task
        }],
        backgroundColor: getValidColor(task.task_color),
        borderColor: chroma(getValidColor(task.task_color)).darken(0.5).hex(),
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 20
    }));
    
    return {
        timelineData: {
            datasets: datasets
        },
        dateRange: { min: minDate, max: maxDate }
    };
}

function getValidColor(color) {
    try {
        return color && chroma.valid(color) ? color : '#36A2EB';
    } catch {
        return '#36A2EB';
    }
}

function getTimelineOptions(dateRange) {
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
                position: 'bottom',
                grid: {
                    display: true,
                    color: 'rgba(0,0,0,0.05)'
                },
                ticks: {
                    autoSkip: false,
                    maxRotation: 0
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
}

function showError() {
    const container = document.querySelector('.chart-container');
    if (container) {
        container.innerHTML = '<p class="error">Не удалось загрузить временную шкалу</p>';
    }
}

document.addEventListener('DOMContentLoaded', initTaskChart);