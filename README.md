# TicTacToe promo + Telegram (GH Pages + free backend)

## Запуск фронтенда (GH Pages)
- `cd frontend && npm install`
- Env: `.env.local` ? `VITE_API_URL=https://<your-backend>.onrender.com`
- Локально: `npm run dev`, сборка: `npm run build`
- Деплой: push в `main` ? `.github/workflows/deploy.yml` публикует `frontend/dist` в `gh-pages`
- Прод: `https://ovepfunkep.github.io/XO/`

## Бэкенд (free, без Firebase)
- Директория `backend/`
- Env: `TELEGRAM_TOKEN`, `TELEGRAM_CHAT_ID`
- Локально: `cd backend && npm install && npm run dev` (порт 8080)
- Деплой: Render/Railway (Build: `npm run build`, Start: `npm run start`)
- Эндпоинты: `POST /report` (result win/lose + code), `GET /health`

## Telegram-бот
- Создать в BotFather, взять токен и chat_id
- Тексты: победа ? «Победа! Промокод выдан: [код]», поражение ? «Проигрыш»

## Что есть
- Игра 3x3 против rule-based AI (блок/выигрыш/центр/углы)
- Промокод 5 цифр при победе; отправка события в Telegram через бекенд
- UI под ЦА 25–40: пастель, плавные анимации, крупные зоны нажатия

## Проверка
- Победа: код в UI + сообщение «Победа! Промокод выдан: [код]» в Telegram
- Поражение: сообщение «Проигрыш», CTA «Сыграть ещё»
- Ничья: без телеграм-отправки; адаптив проверен на мобильных


