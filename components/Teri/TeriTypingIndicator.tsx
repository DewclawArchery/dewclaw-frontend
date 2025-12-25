import { cn } from '@/lib/utils';

interface TeriTypingIndicatorProps {
  className?: string;
}

export function TeriTypingIndicator({ className }: TeriTypingIndicatorProps) {
  return (
    <div className={cn("flex justify-start", className)}>
      <div className="bg-teri-bot-bubble rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full bg-teri animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="h-2 w-2 rounded-full bg-teri animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="h-2 w-2 rounded-full bg-teri animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}
