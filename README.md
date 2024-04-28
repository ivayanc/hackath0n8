# Хелпарик
Найзручніший сервіс для взаємодії людей з волонтерами

# Основний функціонал
## Телеграм бот
Для створення запитів до волонтерів, люди можуть користуватися телеграм ботом

### Реєстрація
![image](https://github.com/ivayanc/hackath0n8/assets/41695655/0fa6ba11-0360-49c3-8be1-c9173e77ee43)


### Створення запиту
***Вибір категорії допомоги***
![image](https://github.com/ivayanc/hackath0n8/assets/41695655/14c775ae-cb69-41ff-8d38-4cbd6132180e)
***Опис запиту***
![image](https://github.com/ivayanc/hackath0n8/assets/41695655/8036e815-4099-4c27-a5e8-4e8bee12db02)
***Результат створення***
![image](https://github.com/ivayanc/hackath0n8/assets/41695655/b3e21bb8-2c19-479c-b59c-5fcc1236645c)

### Бот доступний для тестування @helparyk_bot


Основна ідея для використання телеграм бота, як основної можливості для роботи з людьми:
<ol>
  <li>Доступність</li>
  <li>Простота використання</li>
</ol>

## Веб-версія для волонтерів
### Авторизація
![image](https://github.com/ivayanc/hackath0n8/assets/41695655/7954f3a7-fa26-4082-856d-c02b32d6467b)

### Зручний дашборд
![image](https://github.com/ivayanc/hackath0n8/assets/41695655/66321524-8cb8-4b24-b64b-86ce771dcfad)
***Можливості дашборда:***
<ol>
  <li>Отримати статистику стосовно кількості доступних, поточних, закінчених запитів</li>
  <li>Отримати тенденцію запитів по категоріям</li>
  <li>Переглянути кількість нових запитів за останній тиждень</li>
</ol>

### Нові запити
![image](https://github.com/ivayanc/hackath0n8/assets/41695655/9da6c7b1-0595-45b7-9ae2-507e047c7963)
![image](https://github.com/ivayanc/hackath0n8/assets/41695655/6a073528-870b-4a19-afd5-594d58db94c5)
Можливість для перегляду нових запитів та взяття їх в роботу
Після взяття в опрацювання, людині, що створила запит, приходить оповіщення в бота<br/>
![image](https://github.com/ivayanc/hackath0n8/assets/41695655/e55657d6-6651-40d1-8153-c0986bb2330b)

### Мої запити
![image](https://github.com/ivayanc/hackath0n8/assets/41695655/ec4ab295-7057-4b5a-9229-cf43112e13dd)
![image](https://github.com/ivayanc/hackath0n8/assets/41695655/b6770307-fe26-43ce-b3bd-26b053f99a3e)
![image](https://github.com/ivayanc/hackath0n8/assets/41695655/aeebec58-e875-4d0d-942b-052c313ac30f)
Можливість для перегляду своїх запитів і їх обробки
Після закінчення запиту, людині приходить оповіщення в телеграм і вона отримує змогу створити новий запит<br/>
![image](https://github.com/ivayanc/hackath0n8/assets/41695655/3a02cdea-55f6-4d4b-9f02-838c19ed04e7)

### Можливість повної кастомізації
![image](https://github.com/ivayanc/hackath0n8/assets/41695655/04e0a18a-0063-45e7-b426-ceca5c3ac373)


### Тестування
Застосунок доступний для тестування за [посиланням](http://34.65.67.249/login)<br/>
Дані від тестового аккаунта:<br/>
Email: ***test@test.com***<br/>
Password: ***password***<br/>

# Технічна сторона
## Локальний запуск
Для локального запуску сервісів, потрібно:
<ol>
  <li>Спулити репозиторій</li>
  <li>Створити .env файли в backend, frontend, bot репозиторіях</li>
  <li>Виконати команду docker-compose build</li>
  <li>Виконати команду docker-compose up -d</li>
  <li>Створити бази данних для системи: 
    <ol>
      <li>docker-compose exec db psql -U postgres</li>
      <li>CREATE ROLE db_username WITH LOGIN SUPERUSER PASSWORD 'password';</li>
      <li>CREATE DATABASE bot_db;</li>
      <li>CREATE DATABASE backend_db;</li>
    </ol>
    Усі дані для бази, як в .env
  </li>
  <li>Виконати команду docker-compose up -d/li>
</ol>
Локальний екземпляр, має запрацювати успішно

## Використані технології
### Backend
Python, fastapi, postgresql, sqlalchemy, alembic, redis
### Frontend
Typescript, Next.js, React, PrimeReact Sakai
### Telegram bot
aiogram, celery, redis, sqlalchemy, alembic

## Основні моменти взаємодії
### Backend + Frontend
Взаємодія між бекендом та фронтедном задопомогою REST API
### Backend + telegram bot
Після створення запиту, telegram bot відправляє запит до backend по REST API
Для отримання оновлення стосовно запитів використовується redis pubsub:<br/>
Backend пушить оновлення в канал<br/>
Телеграм бот отримує оновлення і запускає celery таску для оновлення
