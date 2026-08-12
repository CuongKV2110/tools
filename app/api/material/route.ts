import type { NextRequest } from "next/server";
import { streamText } from "ai";
import { contentModel, isAIConfigured } from "@/lib/ai";
import {
  buildMaterialSystemPrompt,
  buildMaterialPrompt,
} from "@/lib/prompts";
import { verifyRequest } from "@/lib/auth-helpers";
import type { MaterialRequest } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const user = await verifyRequest(req);
  if (!user) return new Response("Unauthorized", { status: 401 });

  let body: MaterialRequest;
  try {
    body = (await req.json()) as MaterialRequest;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (!body.productName?.trim() || !body.productDescription?.trim()) {
    return new Response("Thiếu tên hoặc mô tả sản phẩm", { status: 400 });
  }
  if (!isAIConfigured()) {
    return new Response("Chưa cấu hình GOOGLE_GENERATIVE_AI_API_KEY.", {
      status: 500,
    });
  }

  const result = streamText({
    model: contentModel,
    system: buildMaterialSystemPrompt(),
    prompt: buildMaterialPrompt(body),
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
