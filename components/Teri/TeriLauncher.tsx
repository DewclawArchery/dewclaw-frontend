import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeriLauncherProps {
  onClick: () => void;
  className?: string;
}

export function TeriLauncher({ onClick, className }: TeriLauncherProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "flex items-center gap-2 px-5 py-3",
        "bg-teri text-teri-foreground",
        "rounded-full shadow-lg",
        "hover:scale-105 hover:shadow-xl",
        "active:scale-95",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-teri focus:ring-offset-2",
        className
      )}
      aria-label="Open TERI chat assistant"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="font-medium text-sm">Ask T.E.R.I.</span>
    </button>
  );
}
