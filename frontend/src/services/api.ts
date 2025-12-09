const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface ReportResult {
  ok: boolean;
  error?: string;
}

export async function reportGameResult(
  result: 'win' | 'lose',
  code?: string
): Promise<ReportResult> {
  try {
    const response = await fetch(`${API_URL}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        result,
        code,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to report game result:', error);
    return { ok: false, error: 'Network error' };
  }
}

