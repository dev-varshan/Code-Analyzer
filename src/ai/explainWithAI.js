import { callLLM } from "./providers";
import { buildPrompt } from "./prompts";

export async function explainIssueWithAI({
  provider = "gemini",
  apiKey,
  issue,
  fullCode,
  type,
}) {
  const lines = fullCode.split("\n");

  // ⛏ Context: 2 lines above + vulnerable line + 2 lines below
  const start = Math.max(issue.line - 3, 0);
  const end = Math.min(issue.line + 2, lines.length);

  const codeContext = lines.slice(start, end).join("\n");

  const prompt = buildPrompt(type, issue, codeContext);

  return await callLLM({
    provider,
    apiKey,
    prompt,
  });
}
