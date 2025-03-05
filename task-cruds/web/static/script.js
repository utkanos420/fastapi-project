document.getElementById('add-task').addEventListener('click', function () {
    document.getElementById('task-modal').classList.remove('hidden');
});

document.getElementById('save-task').addEventListener('click', function () {
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const dueDate = document.getElementById('task-date').value; // Дата выполнения
    const color = document.getElementById('task-color').value; // Цвет задачи

    // Проверка заполнения обязательных полей
    if (!title || !desc || !dueDate) {
        alert('Заполните все поля!');
        return;
    }

    // Дата создания задачи (автоматически)
    const createdDate = new Date().toISOString();

    // Формируем объект с задачей
    const taskData = {
        task_title: title,
        task_description: desc,
        task_importance: 0, // Можно добавить выбор в UI
        task_created_date: createdDate,
        task_created_until_date: dueDate,
        is_archived: 0, // По умолчанию задание не архивировано
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
            taskElement.style.backgroundColor = color; // Цвет задачи

            // Только название и срок сдачи
            taskElement.innerHTML = `
                <strong>${title}</strong><br>
                ${dueDate ? `${dueDate}` : 'Без срока'}
            `;

            taskElement.addEventListener('click', function () {
                document.getElementById('detail-title').textContent = title;
                document.getElementById('detail-desc').textContent = desc;
                document.getElementById('detail-date').textContent = dueDate;
                document.getElementById('task-detail-modal').classList.remove('hidden');
            });

            taskContainer.appendChild(taskElement);
        })
        .catch(error => {
            console.error('Ошибка при добавлении задачи:', error);
        });

    document.getElementById('task-modal').classList.add('hidden');
});

document.getElementById('close-detail').addEventListener('click', function () {
    document.getElementById('task-detail-modal').classList.add('hidden');
});

// Логика для получения всех задач
document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/v1/tasks')
        .then(response => response.json())
        .then(data => {
            const taskContainer = document.querySelector('.task-container');
            taskContainer.innerHTML = ""; // Очищаем контейнер перед загрузкой задач
            data.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.classList.add('task');
                taskElement.style.backgroundColor = "#1e1e1e"; // Цвет задачи

                // Только название и срок сдачи
                taskElement.innerHTML = `
                    <strong>${task.task_title}</strong><br>
                    ${task.task_created_until_date ? `Срок: ${task.task_created_until_date}` : 'Без срока'}
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
