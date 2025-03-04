document.getElementById('add-task').addEventListener('click', function() {
    document.getElementById('task-modal').classList.remove('hidden');
});

document.getElementById('save-task').addEventListener('click', function() {
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const date = document.getElementById('task-date').value;
    const color = document.getElementById('task-color').value;
    const taskContainer = document.querySelector('.task-container');
    
    if (title.trim() !== "" && date !== "") {
        const task = document.createElement('div');
        task.innerHTML = `<strong>${title}</strong><br>${date}`;
        task.style.backgroundColor = color;
        task.classList.add('task');
        task.dataset.desc = desc;
        task.dataset.date = date;
        task.dataset.title = title;
        
        task.addEventListener('click', function() {
            document.getElementById('detail-title').textContent = task.dataset.title;
            document.getElementById('detail-desc').textContent = task.dataset.desc;
            document.getElementById('detail-date').textContent = task.dataset.date;
            document.getElementById('task-detail-modal').classList.remove('hidden');
            
            document.getElementById('delete-task').onclick = function() {
                task.remove();
                document.getElementById('task-detail-modal').classList.add('hidden');
            };
        });
        
        taskContainer.appendChild(task);
    }
    
    document.getElementById('task-modal').classList.add('hidden');
});

document.getElementById('close-detail').addEventListener('click', function() {
    document.getElementById('task-detail-modal').classList.add('hidden');
});

// Новый код для работы с API
document.addEventListener('DOMContentLoaded', function () {
    // GET-запрос для получения всех заданий с сервера
    fetch('http://127.0.0.1:1447/api/v1/tasks/')
        .then(response => response.json())  // Преобразуем ответ в JSON
        .then(data => {
            console.log('Задания на сервере:', data);  // Выводим все задания в консоль

            // Проходим по всем задачам и отображаем их на странице
            const taskContainer = document.querySelector('.task-container');
            data.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.classList.add('task');
                taskElement.style.backgroundColor = "#1e1e1e"; // Можешь выбрать подходящий цвет

                // Заполняем содержимое задачи
                taskElement.innerHTML = `
                    <strong>${task.task_title}</strong><br>
                    ${task.task_created_date}<br>
                    ${task.task_description}<br>
                    Важность: ${task.task_importance}
                `;

                // Добавляем обработчик для клика по задаче
                taskElement.addEventListener('click', function () {
                    document.getElementById('detail-title').textContent = task.task_title;
                    document.getElementById('detail-desc').textContent = task.task_description;
                    document.getElementById('detail-date').textContent = task.task_created_until_date;
                    document.getElementById('task-detail-modal').classList.remove('hidden');
                });

                taskContainer.appendChild(taskElement);
            });
        })
        .catch(error => {
            console.error('Ошибка при запросе:', error);  // Обрабатываем ошибки
        });
});
