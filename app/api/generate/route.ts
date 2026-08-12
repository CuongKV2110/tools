import type { NextRequest } from "next/server";
import { streamText } from "ai";
import { contentModel, isAIConfigured } from "@/lib/ai";
import { buildContentSystemPrompt } from "@/lib/prompts";
import { verifyRequest } from "@/lib/auth-helpers";
import type { GenerateRequest } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const decoded = await verifyRequest(req);
  if (!decoded) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (!body.rawInput?.trim()) {
    return new Response("Thiếu nội dung đầu vào", { status: 400 });
  }

  if (!isAIConfigured()) {
    return new Response(
      "Chưa cấu hình GOOGLE_GENERATIVE_AI_API_KEY trên máy chủ.",
      { status: 500 }
    );
  }

  const system = buildContentSystemPrompt(body);

  const result = streamText({
    model: contentModel,
    system,
    prompt: `Chủ đề / ý tưởng thô: ${body.rawInput.trim()}`,
    temperature: 0.8,
  });

  // Plain text stream — the client reads it incrementally.
  return result.toTextStreamResponse();
}
