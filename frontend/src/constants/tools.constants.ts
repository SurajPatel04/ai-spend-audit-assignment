import type { ToolId, ToolConfig } from "../types/audit.types";

export const TOOLS_CONFIG: Record<ToolId, ToolConfig> = {
  cursor: {
    label: "Cursor",
    icon: "⚡",
    description: "AI-powered code editor with intelligent autocomplete and chat.",
    plans: [
      { key: "hobby", label: "Hobby", pricePerSeat: 0 },
      { key: "pro", label: "Pro", pricePerSeat: 20 },
      { key: "business", label: "Business", pricePerSeat: 40 },
      { key: "enterprise", label: "Enterprise", pricePerSeat: null },
    ],
  },
  githubCopilot: {
    label: "GitHub Copilot",
    icon: "🐙",
    description: "AI pair programmer that suggests code inline in your IDE.",
    plans: [
      { key: "individual", label: "Individual", pricePerSeat: 10 },
      { key: "business", label: "Business", pricePerSeat: 19 },
      { key: "enterprise", label: "Enterprise", pricePerSeat: 39 },
    ],
  },
  claude: {
    label: "Claude (Anthropic)",
    icon: "🧠",
    description: "Conversational AI assistant excelling at analysis and writing.",
    plans: [
      { key: "free", label: "Free", pricePerSeat: 0 },
      { key: "pro", label: "Pro", pricePerSeat: 20 },
      { key: "max", label: "Max", pricePerSeat: 100 },
      { key: "team", label: "Team", pricePerSeat: 30 },
      { key: "enterprise", label: "Enterprise", pricePerSeat: null },
      { key: "api", label: "API Direct", pricePerSeat: null },
    ],
  },
  chatgpt: {
    label: "ChatGPT (OpenAI)",
    icon: "💬",
    description: "General-purpose AI chatbot for conversation and content generation.",
    plans: [
      { key: "free", label: "Free", pricePerSeat: 0 },
      { key: "plus", label: "Plus", pricePerSeat: 20 },
      { key: "team", label: "Team", pricePerSeat: 30 },
      { key: "enterprise", label: "Enterprise", pricePerSeat: null },
      { key: "api", label: "API Direct", pricePerSeat: null },
    ],
  },
  anthropicApi: {
    label: "Anthropic API (Direct)",
    icon: "🔌",
    description: "Direct API access to Claude models for custom integrations.",
    plans: [
      { key: "sonnet", label: "Claude Sonnet ($3/M input, $15/M output)", pricePerSeat: null },
      { key: "opus", label: "Claude Opus ($15/M input, $75/M output)", pricePerSeat: null },
    ],
  },
  openaiApi: {
    label: "OpenAI API (Direct)",
    icon: "🔑",
    description: "Direct API access to GPT models for programmatic usage.",
    plans: [
      { key: "gpt4o", label: "GPT-4o ($5/M input, $15/M output)", pricePerSeat: null },
      { key: "gpt4turbo", label: "GPT-4 Turbo ($10/M input, $30/M output)", pricePerSeat: null },
    ],
  },
  gemini: {
    label: "Gemini (Google)",
    icon: "✨",
    description: "Google's multimodal AI model for text, code, and image tasks.",
    plans: [
      { key: "pro", label: "Gemini Pro", pricePerSeat: 20 },
      { key: "ultra", label: "Gemini Ultra", pricePerSeat: null },
      { key: "api", label: "API Direct", pricePerSeat: null },
    ],
  },
  windsurf: {
    label: "Windsurf",
    icon: "🏄",
    description: "AI-assisted coding environment with autonomous agent workflows.",
    plans: [
      { key: "free", label: "Free", pricePerSeat: 0 },
      { key: "pro", label: "Pro", pricePerSeat: 15 },
      { key: "team", label: "Team", pricePerSeat: 35 },
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
