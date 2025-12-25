import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NextStepLink {
  label: string;
  href: string;
}

const NEXT_STEPS: NextStepLink[] = [
  { label: "Booking Calendar", href: "https://book.dewclawarchery.com" },
  { label: "Arrow Orders", href: "https://orders.dewclawarchery.com" },
  { label: "Leagues", href: "https://leagues.dewclawarchery.com" },
];

interface TeriNextStepsProps {
  className?: string;
}

export function TeriNextSteps({ className }: TeriNextStepsProps) {
  return (
    <div className={cn("px-3 py-2 border-b border-border/30", className)}>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70 mb-1.5">
        Next steps
      </p>
      <div className="flex flex-wrap gap-1.5">
        {NEXT_STEPS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1",
              "text-xs font-medium rounded-md",
              "bg-muted/50 text-muted-foreground",
              "hover:bg-muted hover:text-foreground",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-teri focus:ring-offset-1"
            )}
          >
            {link.label}
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        ))}
      </div>
    </div>
  );
}
