# ?? Крестики-нолики с промокодами

Современная веб-игра "Крестики-нолики" с системой промокодов и интеграцией Telegram. Проект разработан специально для женской аудитории 25-40 лет с акцентом на красивый UX/UI и мобильную оптимизацию.

## ? Особенности

### ?? Дизайн и UX
- **Glassmorphism** — современные эффекты размытия и полупрозрачности
- **Плавные анимации** — все взаимодействия анимированы через Framer Motion
- **Пастельная палитра** — розовые и фиолетовые градиенты
- **Мобильная оптимизация** — адаптивный дизайн с акцентом на мобильные устройства
- **Конфетти при победе** — праздничный эффект с использованием canvas-confetti
- **Всплывающие модалки** — красивые уведомления о победе/проигрыше

### ?? Игровая механика
- **Rule-based AI** — умный противник с стратегией:
  1. Блокировка выигрыша игрока
  2. Попытка выиграть
  3. Захват центра
  4. Стратегический выбор углов
  5. Случайный ход при отсутствии стратегии
- **Система промокодов** — генерация 5-значных промокодов при победе
- **Telegram интеграция** — автоматическая отправка результатов в Telegram-бот

## ?? Технологии

### Frontend
- **React 18** — современный UI фреймворк
- **TypeScript** — типизированный JavaScript
- **Vite** — быстрая сборка и разработка
- **Tailwind CSS** — utility-first CSS фреймворк
- **Framer Motion** — библиотека анимаций
- **canvas-confetti** — эффект конфетти

### Backend
- **Node.js** — серверная платформа
- **Express** — веб-фреймворк
- **TypeScript** — типизация на бэкенде
- **node-fetch** — HTTP клиент для запросов к Telegram API

### Деплой
- **GitHub Pages** — хостинг фронтенда (бесплатно)
- **Render.com** — хостинг бэкенда (бесплатный tier)
- **GitHub Actions** — CI/CD для автоматического деплоя

## ?? Структура проекта

```
XO/
??? frontend/          # React приложение
?   ??? src/
?   ?   ??? components/    # React компоненты
?   ?   ??? services/      # API клиент
?   ?   ??? utils/         # Игровая логика и AI
?   ?   ??? types.ts       # TypeScript типы
?   ??? public/            # Статические файлы
?   ??? package.json
??? backend/          # Express сервер
?   ??? src/
?   ?   ??? server.ts      # Основной сервер
?   ??? package.json
??? .github/
    ??? workflows/
        ??? deploy.yml     # GitHub Actions workflow
```

## ?? Быстрый старт

### Frontend (локальная разработка)

```bash
cd frontend
npm install

# Создать файл .env.local
echo "VITE_API_URL=http://localhost:8080" > .env.local

# Запустить dev сервер
npm run dev
```

### Backend (локальная разработка)

```bash
cd backend
npm install

# Создать файл .env
echo "TELEGRAM_TOKEN=your_token" > .env
echo "TELEGRAM_CHAT_ID=your_chat_id" >> .env
echo "PORT=8080" >> .env

# Запустить dev сервер
npm run dev
```

## ?? Деплой

### Frontend на GitHub Pages

1. Настройте переменную окружения в GitHub:
   - Settings ? Secrets and variables ? Actions ? Variables
   - Добавьте `VITE_API_URL` с URL вашего бэкенда

2. Push в ветку `main`:
   ```bash
   git push origin main
   ```

3. GitHub Actions автоматически соберет и задеплоит проект в `gh-pages`

4. Фронтенд будет доступен по адресу: `https://<username>.github.io/XO/`

### Backend на Render.com

1. Зарегистрируйтесь на [Render.com](https://dashboard.render.com/)

2. Создайте новый Web Service:
   - Подключите репозиторий GitHub
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`

3. Добавьте переменные окружения:
   - `TELEGRAM_TOKEN` — токен вашего Telegram бота
   - `TELEGRAM_CHAT_ID` — ID чата для уведомлений
   - `PORT` — порт (обычно 8080, Render автоматически назначает свой)

4. Render автоматически задеплоит ваш бэкенд

## ?? Настройка Telegram бота

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен бота
3. Узнайте ваш `chat_id`:
   - Напишите боту [@userinfobot](https://t.me/userinfobot)
   - Или используйте [@getidsbot](https://t.me/getidsbot)
4. Добавьте токен и chat_id в переменные окружения бэкенда

## ?? API Endpoints

### POST `/report`
Отправка результата игры в Telegram

**Request Body:**
```json
{
  "result": "win" | "lose",
  "code": "12345"  // только для "win"
}
```

**Response:**
```json
{
  "ok": true
}
```

### GET `/health`
Проверка работоспособности сервера

**Response:**
```json
{
  "ok": true
}
```

## ?? Игровой процесс

1. Игрок делает ход (крестик)
2. AI анализирует ситуацию и делает ответный ход (нолик)
3. При победе игрока:
   - Генерируется 5-значный промокод
   - Появляется модалка с промокодом и эффектом конфетти
   - Отправляется сообщение в Telegram: "?? Pobeda! Promokod vydan: [код]"
4. При проигрыше:
   - Появляется модалка с предложением сыграть снова
   - Отправляется сообщение в Telegram: "?? Proigrysh"
5. При ничьей:
   - Игра завершается без отправки в Telegram

## ?? Дизайн-система

### Цветовая палитра
- **Розовый**: `#ec4899`, `#f472b6`, `#fbcfe8`
- **Фиолетовый**: `#a855f7`, `#c084fc`, `#e9d5ff`
- **Градиенты**: плавные переходы между розовым и фиолетовым

### Эффекты
- **Glassmorphism**: `backdrop-blur-xl`, полупрозрачные фоны
- **Анимации**: плавные переходы, масштабирование, вращение
- **Тени**: многослойные тени для глубины

## ?? Скрипты

### Frontend
- `npm run dev` — запуск dev сервера
- `npm run build` — сборка для продакшена
- `npm run preview` — предпросмотр собранного проекта

### Backend
- `npm run dev` — запуск с hot reload (tsx watch)
- `npm run build` — компиляция TypeScript
- `npm run start` — запуск продакшен версии

## ?? Переменные окружения

### Frontend (.env.local)
```
VITE_API_URL=https://your-backend.onrender.com
```

### Backend (.env)
```
TELEGRAM_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
PORT=8080
```

## ? Чеклист проверки

- [x] Игра работает корректно
- [x] AI делает правильные ходы
- [x] Промокоды генерируются при победе
- [x] Конфетти появляется при победе
- [x] Модалки отображаются корректно
- [x] Telegram уведомления отправляются
- [x] Мобильная версия адаптивна
- [x] Анимации плавные
- [x] Деплой на GitHub Pages работает
- [x] Деплой на Render.com работает

## ?? Лицензия

Проект создан в образовательных целях.

## ?? Для заинтересованных лиц

Этот проект демонстрирует:
- Современный стек технологий (React, TypeScript, Node.js)
- Качественный UX/UI дизайн с акцентом на мобильные устройства
- Интеграцию с внешними сервисами (Telegram API)
- CI/CD через GitHub Actions
- Деплой на бесплатных платформах (GitHub Pages, Render.com)
- Best practices в разработке (типизация, модульность, чистая архитектура)

---

**Разработано с ?? для женской аудитории 25-40 лет**
