document.getElementById('add-task').addEventListener('click', function() {
    document.getElementById('task-modal').classList.remove('hidden');
});

document.getElementById('save-task').addEventListener('click', function() {
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const color = document.getElementById('task-color').value; // Цвет задачи
    
    // Дата создания задачи будет установлена как текущая дата
    const createdDate = new Date().toISOString(); // Преобразуем в формат ISO
    const createdUntilDate = ""; // Пусть пока будет пустое значение (это поле можно использовать по желанию)

    // Формируем объект с задачей
    const taskData = {
        task_title: title,
        task_description: desc,
        task_importance: 0,  // Можно изменить, если нужно
        task_created_date: createdDate,
        task_created_until_date: createdUntilDate,
        is_archived: 1,  // Архивировано по умолчанию
    };

    // Отправляем данные на сервер
    fetch('/api/v1/tasks/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Задача успешно добавлена:', data);
        
        // Создаем элемент задачи на странице
        const taskContainer = document.querySelector('.task-container');
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.style.backgroundColor = color;  // Цвет задачи

        taskElement.innerHTML = `
            <strong>${title}</strong><br>
            ${createdDate}<br>
            ${desc}<br>
            Важность: 0<br>
            Архивирован: ${taskData.is_archived === 1 ? 'Да' : 'Нет'}
        `;

        taskElement.addEventListener('click', function () {
            document.getElementById('detail-title').textContent = title;
            document.getElementById('detail-desc').textContent = desc;
            document.getElementById('detail-date').textContent = createdUntilDate;
            document.getElementById('task-detail-modal').classList.remove('hidden');
        });

        taskContainer.appendChild(taskElement);
    })
    .catch(error => {
        console.error('Ошибка при добавлении задачи:', error);
    });

    document.getElementById('task-modal').classList.add('hidden');
});

document.getElementById('close-detail').addEventListener('click', function() {
    document.getElementById('task-detail-modal').classList.add('hidden');
});

// Логика для получения всех задач
document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/v1/tasks')
        .then(response => response.json())
        .then(data => {
            const taskContainer = document.querySelector('.task-container');
            data.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.classList.add('task');
                taskElement.style.backgroundColor = "#1e1e1e"; // Цвет задачи

                taskElement.innerHTML = `
                    <strong>${task.task_title}</strong><br>
                    ${task.task_created_date}<br>
                    ${task.task_description}<br>
                    Важность: 0<br>
                    Архивирован: ${task.is_archived === 1 ? 'Да' : 'Нет'}
                `;

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
            console.error('Ошибка при запросе:', error);
        });
});
