export const generatePromoCode = (): string => {
  const num = Math.floor(10000 + Math.random() * 90000);
  return num.toString();
};

export const clientId = (): string => {
  const key = "tictactoe-client-id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const fresh = crypto.randomUUID();
  localStorage.setItem(key, fresh);
  return fresh;
};


