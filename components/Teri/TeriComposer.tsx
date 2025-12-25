import { useState, useCallback, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeriComposerProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

export function TeriComposer({ onSend, disabled, className }: TeriComposerProps) {
  const [value, setValue] = useState('');

  const handleSend = useCallback(() => {
    if (value.trim() && !disabled) {
      onSend(value);
      setValue('');
    }
  }, [value, onSend, disabled]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className={cn("p-3 border-t border-border/50 bg-teri-surface", className)}>
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 resize-none rounded-xl px-4 py-2.5",
            "bg-background border border-input",
            "text-sm placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-teri focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "max-h-32"
          )}
          style={{
            minHeight: '44px',
          }}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            "bg-teri text-teri-foreground",
            "hover:opacity-90 active:scale-95",
            "transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-teri focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          )}
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
