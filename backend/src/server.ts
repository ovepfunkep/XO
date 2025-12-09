import express from "express";
import cors from "cors";
import fetch from "node-fetch";

type Result = "win" | "lose";

interface ReportBody {
  result?: Result;
  code?: string;
  board?: unknown;
  clientId?: string;
}

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const PORT = process.env.PORT || 8080;

if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
  console.warn("Missing TELEGRAM_TOKEN or TELEGRAM_CHAT_ID env vars");
}

const app = express();
app.use(cors());
app.use(express.json());

const validate = (body: ReportBody): { ok: boolean; error?: string } => {
  if (body.result !== "win" && body.result !== "lose") return { ok: false, error: "invalid result" };
  if (body.result === "win" && (!body.code || body.code.length !== 5)) {
    return { ok: false, error: "code required for win" };
  }
  return { ok: true };
};

app.post("/report", async (req, res) => {
  const body = req.body as ReportBody;
  const validation = validate(body);
  if (!validation.ok) return res.status(400).json({ ok: false, error: validation.error });
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(500).json({ ok: false, error: "telegram config missing" });
  }

  const text = body.result === "win" 
    ? `🎉 Победа! Промокод выдан: ${body.code}` 
    : `😔 Проигрыш`;
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    });
    if (!tgRes.ok) {
      const errText = await tgRes.text();
      console.error("Telegram error", errText);
      return res.status(502).json({ ok: false, error: "telegram failed" });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error("send error", err);
    return res.status(500).json({ ok: false, error: "unexpected" });
  }
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Backend listening on ${PORT}`);
});


