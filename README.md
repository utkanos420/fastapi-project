# Планировщик задач с помощью FastAPI

Подготовка к запуску:

> склонировать проект<br>
> создать виртуальное окружение python 3.13<br>
> установить зависимости: pip install -r requirements.txt<br>
> <i>необязательно: alembic init, если планируете использовать</i>

Запуск скрпита:

> cd task-cruds
> python main.py

При первом запуске SQLalchemy создаст базу данных и подготовит скрипт

Подключение к веб-странице:
> перейти по выданной в консоли ссылке, например: http://127.0.0.1:2223
> на момент текущего коммита веб интерфейс находится по: http://127.0.0.1:2223/lol

# Описание проекта

Данный репозиторий - мой проект для колледжа, продуктом которого является простой планировщик задач. Используется FastAPI для создания самописного API к aiosqlite через SQLalchemy. С помощью jinja2 фастапи рендерит страницу, на которой можно управлять заданиями.

Исходник проекта можно использовать в любых целях
