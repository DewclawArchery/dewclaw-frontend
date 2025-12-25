import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TeriAction } from './types';

interface TeriActionButtonProps {
  action: TeriAction;
  className?: string;
}

export function TeriActionButton({ action, className }: TeriActionButtonProps) {
  return (
    <a
      href={action.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5",
        "text-xs font-medium rounded-lg",
        "bg-teri/10 text-teri-bot-foreground",
        "hover:bg-teri/20",
        "border border-teri/20",
        "transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-teri focus:ring-offset-1",
        className
      )}
    >
      {action.label}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}
