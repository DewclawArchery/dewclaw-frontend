import { X, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeriHeaderProps {
  onClose: () => void;
  className?: string;
}

export function TeriHeader({ onClose, className }: TeriHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between p-4",
        "bg-teri text-teri-foreground",
        "rounded-t-2xl sm:rounded-t-xl",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-base leading-tight">T.E.R.I.</h2>
          <p className="text-xs opacity-90">Technical Equipment Recommendation Intelligence</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          "hover:bg-white/20 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-white/50"
        )}
        aria-label="Close chat"
      >
        <X className="h-5 w-5" />
      </button>
    </header>
  );
}
