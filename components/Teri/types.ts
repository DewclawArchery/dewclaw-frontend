export interface TeriMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: TeriAction[];
  citations?: string[];
  timestamp: number;
}

export interface TeriAction {
  type: 'link';
  label: string;
  href: string;
}

export interface TeriPageContext {
  path?: string;
  title?: string;
  headings?: string[];
}

export interface TeriChatRequest {
  messages: { role: string; content: string }[];
  pageContext: TeriPageContext;
}

export interface TeriChatResponse {
  message: string;
  actions?: TeriAction[];
  citations?: string[];
}

export interface QuickAction {
  label: string;
  message: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  { label: "Book TechnoHunt", message: "I want to book a TechnoHunt session—what should I pick?" },
  { label: "Help with arrows", message: "Help me choose arrows for my setup." },
  { label: "Leagues & events", message: "What leagues are good for beginners?" },
  { label: "Hours & policies", message: "What are your hours and policies?" },
];

export const CITATION_LABELS: Record<string, string> = {
  ops_availability: "Based on current public availability.",
  pricing: "Prices shown may vary—confirm on the booking page.",
  default: "Source: public info.",
};
