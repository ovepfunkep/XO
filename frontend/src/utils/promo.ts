// Генерация случайного 5-значного промокода
export function generatePromoCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

