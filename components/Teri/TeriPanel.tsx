import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { TeriPageContext } from './types';
import { TeriHeader } from './TeriHeader';
import { TeriQuickActions } from './TeriQuickActions';
import { TeriNextSteps } from './TeriNextSteps';
import { TeriMessageList } from './TeriMessageList';
import { TeriComposer } from './TeriComposer';
import { useTeriChat } from './useTeriChat';
import { TeriTypingIndicator } from './TeriTypingIndicator';

interface TeriPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pageContext: TeriPageContext;
  useStub?: boolean;
  className?: string;
}

export function TeriPanel({ isOpen, onClose, pageContext, useStub = false, className }: TeriPanelProps) {
  const { messages, isLoading, lastFailedMessage, sendMessage, retry } = useTeriChat(pageContext, { useStub });

  // Prevent body scroll when panel is open on mobile
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 z-40 bg-black/60 sm:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed z-50 flex flex-col",
          // More opaque panel to ensure readability on image-heavy backgrounds (especially mobile)
          "bg-[#0b0b0d]/95 text-slate-100 shadow-2xl backdrop-blur-xl",
          // Mobile: full-height bottom sheet
          "inset-x-0 bottom-0 h-[100dvh] max-h-[100dvh] rounded-t-2xl",
          "sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[600px] sm:max-h-[80vh] sm:w-[400px] sm:rounded-xl sm:bg-[#0b0b0d]/90",
          // Animation
          "animate-in slide-in-from-bottom duration-300 sm:slide-in-from-bottom-4 sm:fade-in",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label="TERI Chat Assistant"
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-2 pb-0 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>

        <TeriHeader onClose={onClose} />

        <TeriQuickActions onSelect={sendMessage} disabled={isLoading} />

        <TeriNextSteps />

        {/* Clear "thinking" indicator */}
        {isLoading && (
          <div className="px-4 pt-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-slate-200">
              <TeriTypingIndicator />
              <span className="opacity-90">T.E.R.I. is thinking…</span>
            </div>
          </div>
        )}

        <TeriMessageList
          messages={messages}
          isLoading={isLoading}
          onSuggestionClick={sendMessage}
        />

        {/* Retry button when there's a failed message */}
        {lastFailedMessage && !isLoading && (
          <div className="px-4 py-2 border-t border-white/10">
            <button
              onClick={retry}
              className={cn(
                "w-full py-2 text-sm font-medium rounded-lg",
                "bg-white/10 text-slate-100 hover:bg-white/15",
                "transition-colors duration-150",
                "focus:outline-none focus:ring-2 focus:ring-teri focus:ring-offset-1 focus:ring-offset-[#0b0b0d]"
              )}
            >
              Retry
            </button>
          </div>
        )}

        <TeriComposer onSend={sendMessage} disabled={isLoading} />

        {/* Disclaimer footer */}
        <div className="px-4 pb-3 pt-0">
          <p className="text-[10px] text-slate-300/70 text-center leading-tight">
            T.E.R.I. can guide you and link you to the right place. For exact pricing/availability, confirm on the booking/order pages or contact staff.
          </p>
        </div>
      </div>
    </>
  );
}
