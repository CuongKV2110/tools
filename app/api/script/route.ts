import type { NextRequest } from "next/server";
import { streamText } from "ai";
import { contentModel, isAIConfigured } from "@/lib/ai";
import {
  buildScriptSystemPrompt,
  buildAnalysisPrompt,
  buildScriptsPrompt,
} from "@/lib/prompts";
import { verifyRequest } from "@/lib/auth-helpers";
import type { VideoScriptRequest } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const user = await verifyRequest(req);
  if (!user) return new Response("Unauthorized", { status: 401 });

  let body: VideoScriptRequest;
  try {
    body = (await req.json()) as VideoScriptRequest;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (!body.customerPortrait?.trim()) {
    return new Response("Thiếu chân dung khách hàng", { status: 400 });
  }
  if (!isAIConfigured()) {
    return new Response("Chưa cấu hình GOOGLE_GENERATIVE_AI_API_KEY.", {
      status: 500,
    });
  }

  const isScripts = body.mode === "scripts";
  const result = streamText({
    model: contentModel,
    system: buildScriptSystemPrompt(),
    prompt: isScripts ? buildScriptsPrompt(body) : buildAnalysisPrompt(body),
    temperature: 0.8,
    maxOutputTokens: 16384,
  });

  return result.toTextStreamResponse();
}
