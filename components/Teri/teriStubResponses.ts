import type { TeriAction, TeriChatResponse } from './types';

const STUB_ACTIONS: TeriAction[] = [
  { type: 'link', label: 'Booking Calendar', href: 'https://book.dewclawarchery.com' },
  { type: 'link', label: 'Arrow Orders', href: 'https://orders.dewclawarchery.com' },
  { type: 'link', label: 'Leagues', href: 'https://leagues.dewclawarchery.com' },
];

function randomDelay(): Promise<void> {
  const delay = Math.floor(Math.random() * 500) + 400; // 400-900ms
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function shouldIncludeActions(): boolean {
  return Math.random() > 0.5;
}

function pickRandomActions(): TeriAction[] {
  const count = Math.floor(Math.random() * 2) + 1; // 1-2 actions
  const shuffled = [...STUB_ACTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function detectAvailabilityQuery(message: string): boolean {
  const keywords = ['availability', 'available', 'openings', 'open', 'time slot', 'timeslot', 'when can', 'schedule'];
  const lower = message.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function generateStubReply(userMessage: string): TeriChatResponse {
  const lower = userMessage.toLowerCase();

  // Availability/openings query
  if (detectAvailabilityQuery(userMessage)) {
    return {
      message:
        "I'd love to help you find the perfect time! In stub mode, I can't verify live openings—but you can check real-time availability on our booking calendar. Want me to point you there?",
      actions: [{ type: 'link', label: 'Booking Calendar', href: 'https://book.dewclawarchery.com' }],
    };
  }

  // Arrow-related
  if (lower.includes('arrow') || lower.includes('shaft') || lower.includes('spine') || lower.includes('fletching')) {
    return {
      message:
        "Arrows are where the magic happens! Here's what I'd run for most setups: start with the right spine weight for your draw length and poundage—safety and accuracy first. Once we know your bow specs, I can narrow it down. Want to browse our arrow order page for options?",
      actions: shouldIncludeActions() ? [{ type: 'link', label: 'Arrow Orders', href: 'https://orders.dewclawarchery.com' }] : undefined,
    };
  }

  // Booking / TechnoHunt
  if (lower.includes('book') || lower.includes('technohunt') || lower.includes('session') || lower.includes('lane')) {
    return {
      message:
        "TechnoHunt sessions are a blast—great for solo practice or bringing friends! I'd recommend starting with a 1-hour block if you're new, so you have time to get comfortable. Check the calendar for what fits your schedule.",
      actions: [{ type: 'link', label: 'Booking Calendar', href: 'https://book.dewclawarchery.com' }],
    };
  }

  // Leagues
  if (lower.includes('league') || lower.includes('competition') || lower.includes('tournament') || lower.includes('event')) {
    return {
      message:
        "Leagues are an awesome way to level up and meet fellow archers! For beginners, I usually point folks toward our fun/casual leagues—low pressure, great vibes. Check out the leagues page for the current lineup.",
      actions: [{ type: 'link', label: 'Leagues', href: 'https://leagues.dewclawarchery.com' }],
    };
  }

  // Hours / policies
  if (lower.includes('hour') || lower.includes('policy') || lower.includes('policies') || lower.includes('open') || lower.includes('close')) {
    return {
      message:
        "Great question! Our hours and policies are listed on the booking page—safety rules, cancellation info, all that good stuff. If anything's unclear, just ask and I'll do my best to clarify.",
      actions: shouldIncludeActions() ? pickRandomActions() : undefined,
    };
  }

  // Bow / equipment
  if (lower.includes('bow') || lower.includes('recurve') || lower.includes('compound') || lower.includes('equipment') || lower.includes('gear')) {
    return {
      message:
        "Love talking gear! Whether you're shooting recurve or compound, fit and comfort matter most. Swing by so we can check your draw length and get you set up right. Safety first, always.",
      actions: shouldIncludeActions() ? pickRandomActions() : undefined,
    };
  }

  // Default friendly response
  const defaultReplies = [
    "Happy to help! If you're looking for booking info, arrow orders, or league details, I can point you in the right direction. What are you curious about?",
    "Hey there! I'm here to help you find what you need—whether it's booking a lane, picking arrows, or joining a league. Just let me know!",
    "Thanks for reaching out! I can help with bookings, arrow recommendations, and league info. What can I do for you today?",
  ];

  return {
    message: defaultReplies[Math.floor(Math.random() * defaultReplies.length)],
    actions: shouldIncludeActions() ? pickRandomActions() : undefined,
  };
}

export async function getStubResponse(userMessage: string): Promise<TeriChatResponse> {
  await randomDelay();
  return generateStubReply(userMessage);
}
