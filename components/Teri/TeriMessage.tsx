import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import type { TeriMessage as TeriMessageType } from './types';
import { TeriActionButton } from './TeriActionButton';
import { CITATION_LABELS } from './types';

interface TeriMessageProps {
  message: TeriMessageType;
  className?: string;
}

function getCitationLabel(citation: string): string {
  // Check if citation matches a known key
  if (citation in CITATION_LABELS) {
    return CITATION_LABELS[citation];
  }
  // Otherwise return the citation text or default
  return CITATION_LABELS.default;
}

export function TeriMessage({ message, className }: TeriMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5",
          isUser
            ? "bg-teri-user-bubble text-teri-user-foreground rounded-br-md"
            : "bg-teri-bot-bubble text-teri-bot-foreground rounded-bl-md"
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none text-teri-bot-foreground">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="text-sm list-disc list-inside mb-2 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="text-sm list-decimal list-inside mb-2 space-y-1">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-sm">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teri underline hover:no-underline"
                  >
                    {children}
                  </a>
                ),
                code: ({ children }) => (
                  <code className="px-1 py-0.5 bg-black/5 rounded text-xs font-mono">
                    {children}
                  </code>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Action buttons */}
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-teri/10">
            {message.actions.map((action, index) => (
              <TeriActionButton key={index} action={action} />
            ))}
          </div>
        )}

        {/* Citations - subtle label */}
        {message.citations && message.citations.length > 0 && (
          <p className="mt-2 text-[11px] text-teri-bot-foreground/50 italic">
            {getCitationLabel(message.citations[0])}
          </p>
        )}
      </div>
    </div>
  );
}
