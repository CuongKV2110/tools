import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";

/**
 * Central place to configure the AI models (via the Vercel AI SDK).
 * We use Google Gemini — the provider automatically reads the API key from
 * `GOOGLE_GENERATIVE_AI_API_KEY`. Get a free key at https://aistudio.google.com/apikey
 *
 * Override the model per environment with:
 *   GEMINI_CONTENT_MODEL   (default: gemini-flash-latest)
 *   GEMINI_CHAT_MODEL      (default: gemini-flash-latest)
 */
export const CONTENT_MODEL_ID =
  process.env.GEMINI_CONTENT_MODEL ?? "gemini-flash-latest";
export const CHAT_MODEL_ID = process.env.GEMINI_CHAT_MODEL ?? "gemini-flash-latest";

export const contentModel = google(CONTENT_MODEL_ID);
export const chatModel = google(CHAT_MODEL_ID);

/** Whether an AI provider key is configured on the server. */
export function isAIConfigured(): boolean {
  return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
}

/**
 * "Kịch bản Adam" dùng Claude (Anthropic) riêng, không ảnh hưởng các tính năng
 * khác (vẫn chạy Gemini). Đổi model bằng env ADAM_MODEL, key qua ANTHROPIC_API_KEY.
 */
export const ADAM_MODEL_ID = process.env.ADAM_MODEL ?? "claude-haiku-5-5";
export const adamModel = anthropic(ADAM_MODEL_ID);

/** Whether the Anthropic (Claude) key for the Adam feature is configured. */
export function isAdamAIConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/** Approx word budget per requested length (used to steer output). */
export const LENGTH_HINT: Record<string, string> = {
  short: "khoảng 150–250 từ (ngắn gọn, súc tích)",
  medium: "khoảng 400–600 từ (vừa phải, đầy đủ ý)",
  long: "khoảng 800–1200 từ (chi tiết, nhiều tầng lớp)",
};

export const TONE_HINT: Record<string, string> = {
  friendly: "thân thiện, gần gũi",
  professional: "chuyên nghiệp, chỉn chu",
  inspirational: "truyền cảm hứng, cuốn hút",
  witty: "dí dỏm, thông minh",
  authoritative: "uy tín, chắc chắn, giàu chuyên môn",
};
