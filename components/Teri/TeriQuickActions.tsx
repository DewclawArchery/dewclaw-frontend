import { cn } from '@/lib/utils';
import { QUICK_ACTIONS } from './types';

interface TeriQuickActionsProps {
  onSelect: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

export function TeriQuickActions({ onSelect, disabled, className }: TeriQuickActionsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2 p-3 border-b border-border/50", className)}>
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.label}
          onClick={() => onSelect(action.message)}
          disabled={disabled}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-full",
            "bg-teri-chip text-teri-chip-foreground",
            "hover:bg-teri-chip-hover",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-teri focus:ring-offset-1",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
