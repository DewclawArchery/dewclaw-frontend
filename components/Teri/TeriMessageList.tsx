import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { TeriMessage as TeriMessageType } from './types';
import { TeriMessage } from './TeriMessage';
import { TeriTypingIndicator } from './TeriTypingIndicator';
import { Bot, ArrowDown } from 'lucide-react';

interface TeriMessageListProps {
  messages: TeriMessageType[];
  isLoading: boolean;
  onSuggestionClick?: (message: string) => void;
  className?: string;
}

const STARTER_SUGGESTIONS = [
  "What arrows work best for a recurve beginner?",
  "How do I book a lane for this weekend?",
  "Tell me about your leagues.",
];

export function TeriMessageList({ messages, isLoading, onSuggestionClick, className }: TeriMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showJumpButton, setShowJumpButton] = useState(false);

  // Check if user is near bottom of scroll
  const checkIfAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;
    const threshold = 100; // px from bottom
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    const atBottom = checkIfAtBottom();
    setIsAtBottom(atBottom);
    setShowJumpButton(!atBottom && messages.length > 0);
  }, [checkIfAtBottom, messages.length]);

  // Auto-scroll to bottom when new messages arrive (only if already at bottom)
  useEffect(() => {
    if (isAtBottom) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setShowJumpButton(true);
    }
  }, [messages, isLoading, isAtBottom]);

  // Jump to latest message
  const jumpToLatest = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowJumpButton(false);
    setIsAtBottom(true);
  }, []);

  const hasMessages = messages.length > 0;

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className={cn("relative flex-1 overflow-y-auto p-4 space-y-3", className)}
    >
      {!hasMessages && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teri/10 mb-4">
            <Bot className="h-8 w-8 text-teri" />
          </div>
          <h3 className="font-medium text-foreground mb-1">Hey there! I'm T.E.R.I.</h3>
          <p className="text-sm text-muted-foreground max-w-[280px] mb-5">
            Your friendly pro-shop assistant. Ask me anything about gear, bookings, or getting started.
          </p>
          
          {/* Starter suggestions */}
          <div className="flex flex-col gap-2 w-full max-w-[280px]">
            {STARTER_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSuggestionClick?.(suggestion)}
                className={cn(
                  "text-left text-sm px-3 py-2 rounded-lg",
                  "bg-teri-chip text-teri-chip-foreground",
                  "hover:bg-teri-chip-hover transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-teri focus:ring-offset-1"
                )}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((message) => (
        <TeriMessage key={message.id} message={message} />
      ))}

      {isLoading && <TeriTypingIndicator />}

      <div ref={endRef} />

      {/* Jump to latest button */}
      {showJumpButton && (
        <button
          onClick={jumpToLatest}
          className={cn(
            "sticky bottom-2 left-1/2 -translate-x-1/2",
            "flex items-center gap-1.5 px-3 py-1.5",
            "text-xs font-medium rounded-full",
            "bg-teri text-teri-foreground shadow-lg",
            "hover:opacity-90 transition-opacity",
            "focus:outline-none focus:ring-2 focus:ring-teri focus:ring-offset-2"
          )}
        >
          <ArrowDown className="h-3 w-3" />
          Jump to latest
        </button>
      )}
    </div>
  );
}
