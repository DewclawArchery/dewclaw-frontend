import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { TeriPageContext } from './types';
import { TeriHeader } from './TeriHeader';
import { TeriQuickActions } from './TeriQuickActions';
import { TeriNextSteps } from './TeriNextSteps';
import { TeriMessageList } from './TeriMessageList';
import { TeriComposer } from './TeriComposer';
import { useTeriChat } from './useTeriChat';

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
        className="fixed inset-0 z-40 bg-black/40 sm:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed z-50 flex flex-col",
          "bg-teri-background shadow-2xl",
          // Mobile: full-height bottom sheet
          "inset-x-0 bottom-0 h-[100dvh] max-h-[100dvh] rounded-t-2xl",
          "sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[600px] sm:max-h-[80vh] sm:w-[400px] sm:rounded-xl",
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
          <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>

        <TeriHeader onClose={onClose} />
        
        <TeriQuickActions onSelect={sendMessage} disabled={isLoading} />
        
        <TeriNextSteps />
        
        <TeriMessageList 
          messages={messages} 
          isLoading={isLoading} 
          onSuggestionClick={sendMessage}
        />
        
        {/* Retry button when there's a failed message */}
        {lastFailedMessage && !isLoading && (
          <div className="px-4 py-2 border-t border-border/30">
            <button
              onClick={retry}
              className={cn(
                "w-full py-2 text-sm font-medium rounded-lg",
                "bg-teri/10 text-teri hover:bg-teri/20",
                "transition-colors duration-150",
                "focus:outline-none focus:ring-2 focus:ring-teri focus:ring-offset-1"
              )}
            >
              Retry
            </button>
          </div>
        )}
        
        <TeriComposer onSend={sendMessage} disabled={isLoading} />
        
        {/* Disclaimer footer */}
        <div className="px-4 pb-3 pt-0">
          <p className="text-[10px] text-muted-foreground/60 text-center leading-tight">
            T.E.R.I. can guide you and link you to the right place. For exact pricing/availability, confirm on the booking/order pages or contact staff.
          </p>
        </div>
      </div>
    </>
  );
}
