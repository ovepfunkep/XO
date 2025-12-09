import type { ResultPayload } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn("VITE_API_URL is not set. Telegram reporting will fail.");
}

export const reportResult = async (payload: ResultPayload): Promise<{ ok: boolean }> => {
  if (!API_URL) return { ok: false };
  const res = await fetch(`${API_URL.replace(/\/$/, "")}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Report failed: ${res.status}`);
  }
  return res.json();
};


