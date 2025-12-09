# TicTacToe promo with Telegram bot

Пошагово:

1. **Backend (free, без Firebase)**  
   - Директория `backend/`.  
   - Переменные окружения: `TELEGRAM_TOKEN`, `TELEGRAM_CHAT_ID` (хранятся только на хостинге).  
   - Локально: `cd backend && npm install && npm run dev` (порт 8080).  
   - Деплой: Render/Railway (free) — Build: `npm run build`, Start: `npm run start`.  
   - Эндпоинты: `POST /report` (result win/lose + code), `GET /health`.

2. **Telegram бот**  
   - Создайте в BotFather, получите токен, добавьте чат ID.  
   - Сообщения: победа ? «Победа! Промокод выдан: [код]», поражение ? «Проигрыш».

3. **Frontend (GH Pages)**  
   - `cd frontend && npm install`.  
   - Создайте `.env.local` с `VITE_API_URL=https://your-backend.onrender.com`.  
   - Билд: `npm run build`.  
   - Деплой: GitHub Actions workflow `.github/workflows/deploy.yml` пушит `frontend/dist` на GH Pages.

4. **Что реализовано**  
   - Игра 3x3 vs rule-based AI (блок/центр/углы).  
   - Промокод 5 цифр при победе, показ в UI.  
   - Вызов REST `/report` на бекенде ? отправка в Telegram; промокод на фронте.  
   - UI под ЦА 25–40: пастель, плавные анимации, крупные зоны нажатия.

5. **Проверка**  
   - Победа: промокод в UI + сообщение в Telegram.  
   - Поражение: сообщение «Проигрыш» в Telegram и CTA «Сыграть ещё».  
   - Ничья: корректное состояние, без телеграм-отправки.


