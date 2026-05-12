import type { ToolId, ToolConfig } from "../types/audit.types";

import cursorImg from "../assets/new-cursor.webp";
import copilotImg from "../assets/github-copilot.webp";
import claudeImg from "../assets/Claude_AI_symbol.svg.png";
import chatgptImg from "../assets/ChatGPT-Logo.png";
import anthropicApiImg from "../assets/anthropic-icon-.webp";
import geminiImg from "../assets/Google-Gemini.png";
import windsurfImg from "../assets/Windsurf.png";

export const TOOLS_CONFIG: Record<ToolId, ToolConfig> = {
  cursor: {
    label: "Cursor",
    icon: cursorImg,
    description: "AI-powered code editor with intelligent autocomplete and chat.",
    plans: [
      { key: "hobby", label: "Hobby", pricePerSeat: 0 },
      { key: "pro", label: "Pro", pricePerSeat: 20 },
      { key: "pro_plus", label: "Pro Plus", pricePerSeat: 60 },
      { key: "ultra", label: "Ultra", pricePerSeat: 200 },
      { key: "teams", label: "Teams", pricePerSeat: 40 },
      { key: "enterprise", label: "Enterprise", pricePerSeat: null },
    ],
  },
  githubCopilot: {
    label: "GitHub Copilot",
    icon: copilotImg,
    description: "AI pair programmer that suggests code inline in your IDE.",
    plans: [
      { key: "free", label: "Free", pricePerSeat: 0 },
      { key: "pro", label: "Pro", pricePerSeat: 10 },
      { key: "pro_plus", label: "Pro Plus", pricePerSeat: 39 },
      { key: "business", label: "Business", pricePerSeat: 19 },
      { key: "enterprise", label: "Enterprise", pricePerSeat: 39 },
    ],
  },
  claude: {
    label: "Claude (Anthropic)",
    icon: claudeImg,
    description: "Conversational AI assistant excelling at analysis and writing.",
    plans: [
      { key: "free", label: "Free", pricePerSeat: 0 },
      { key: "pro", label: "Pro", pricePerSeat: 20 },
      { key: "max_5x", label: "Max 5x", pricePerSeat: 100 },
      { key: "max_20x", label: "Max 20x", pricePerSeat: 200 },
      { key: "team", label: "Team", pricePerSeat: 25 },
      { key: "enterprise", label: "Enterprise", pricePerSeat: null },
      { key: "api", label: "API Direct", pricePerSeat: null },
    ],
  },
  chatgpt: {
    label: "ChatGPT (OpenAI)",
    icon: chatgptImg,
    description: "General-purpose AI chatbot for conversation and content generation.",
    plans: [
      { key: "free", label: "Free", pricePerSeat: 0 },
      { key: "go", label: "Go", pricePerSeat: 8 },
      { key: "plus", label: "Plus", pricePerSeat: 20 },
      { key: "pro_100", label: "Pro 100", pricePerSeat: 100 },
      { key: "pro_200", label: "Pro 200", pricePerSeat: 200 },
      { key: "business", label: "Business", pricePerSeat: 30 },
      { key: "enterprise", label: "Enterprise", pricePerSeat: null },
      { key: "api", label: "API Direct", pricePerSeat: null },
    ],
  },
  anthropicApi: {
    label: "Anthropic API (Direct)",
    icon: anthropicApiImg,
    description: "Direct API access to Claude models for custom integrations.",
    plans: [
      { key: "haiku_45", label: "Claude 3.5 Haiku", pricePerSeat: null },
      { key: "sonnet_46", label: "Claude 3.5 Sonnet", pricePerSeat: null },
      { key: "opus_46", label: "Claude 3 Opus", pricePerSeat: null },
    ],
  },
  openaiApi: {
    label: "OpenAI API (Direct)",
    icon: chatgptImg,
    description: "Direct API access to GPT models for programmatic usage.",
    plans: [
      { key: "gpt5_mini", label: "GPT-4o mini", pricePerSeat: null },
      { key: "gpt5", label: "GPT-4o", pricePerSeat: null },
      { key: "gpt55", label: "o1 / o3-mini", pricePerSeat: null },
    ],
  },
  gemini: {
    label: "Gemini (Google)",
    icon: geminiImg,
    description: "Google's multimodal AI model for text, code, and image tasks.",
    plans: [
      { key: "free", label: "Free", pricePerSeat: 0 },
      { key: "ai_plus", label: "AI Plus", pricePerSeat: 7.99 },
      { key: "ai_pro", label: "AI Pro", pricePerSeat: 19.99 },
      { key: "ai_ultra", label: "AI Ultra", pricePerSeat: 249.99 },
      { key: "api", label: "API Direct", pricePerSeat: null },
    ],
  },
  windsurf: {
    label: "Windsurf",
    icon: windsurfImg,
    description: "AI-assisted coding environment with autonomous agent workflows.",
    plans: [
      { key: "free", label: "Free", pricePerSeat: 0 },
      { key: "pro", label: "Pro", pricePerSeat: 20 },
      { key: "max", label: "Max", pricePerSeat: 200 },
      { key: "teams", label: "Teams", pricePerSeat: 40 },
      { key: "enterprise", label: "Enterprise", pricePerSeat: null },
    ],
  },
};

export const TOOL_IDS: ToolId[] = [
  "cursor",
  "githubCopilot",
  "claude",
  "chatgpt",
  "anthropicApi",
  "openaiApi",
  "gemini",
  "windsurf",
];

export const TOOL_ACCENT_COLORS: Record<ToolId, string> = {
  cursor: "#8b5cf6",
  githubCopilot: "#3b82f6",
  claude: "#f97316",
  chatgpt: "#10b981",
  anthropicApi: "#ec4899",
  openaiApi: "#06b6d4",
  gemini: "#eab308",
  windsurf: "#14b8a6",
};
