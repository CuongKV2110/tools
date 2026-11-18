import type { NextRequest } from "next/server";
import { streamText } from "ai";
import { contentModel, isAIConfigured } from "@/lib/ai";
import {
  buildAdamSystemPrompt,
  buildAdamHooksPrompt,
  buildAdamScriptsPrompt,
} from "@/lib/prompts";
import { verifyRequest } from "@/lib/auth-helpers";
import type { AdamScriptRequest } from "@/types";

export const runtime = "nodejs";
// Vercel Pro dùng được tới 300s; gói Hobby tự giới hạn ở 60s. Đặt cao để tránh
// bị cắt giữa chừng khi tạo 5 kịch bản + caption + hashtag.
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const user = await verifyRequest(req);
  if (!user) return new Response("Unauthorized", { status: 401 });

  let body: AdamScriptRequest;
  try {
    body = (await req.json()) as AdamScriptRequest;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (!body.summary?.trim() && !body.desiredHook?.trim()) {
    return new Response("Thiếu mô tả nội dung hoặc câu hook", { status: 400 });
  }
  if (!isAIConfigured()) {
    return new Response("Chưa cấu hình GOOGLE_GENERATIVE_AI_API_KEY.", {
      status: 500,
    });
  }

  const isScripts = body.mode === "scripts";
  const result = streamText({
    model: contentModel,
    system: buildAdamSystemPrompt(),
    prompt: isScripts
      ? buildAdamScriptsPrompt(body)
      : buildAdamHooksPrompt(body),
    temperature: 0.85,
    maxOutputTokens: 8192,
  });

  return result.toTextStreamResponse();
}
