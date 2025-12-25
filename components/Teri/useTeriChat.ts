import { useState, useEffect, useCallback } from 'react';
import type { TeriMessage, TeriPageContext, TeriChatRequest, TeriChatResponse } from './types';
import { getStubResponse } from './teriStubResponses';

const SESSION_STORAGE_KEY = 'teri-chat-history';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadMessagesFromSession(): TeriMessage[] {
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load TERI chat history from session storage', e);
  }
  return [];
}

function saveMessagesToSession(messages: TeriMessage[]): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.warn('Failed to save TERI chat history to session storage', e);
  }
}

export interface UseTeriChatOptions {
  useStub?: boolean;
}

export function useTeriChat(pageContext: TeriPageContext, options: UseTeriChatOptions = {}) {
  const { useStub = false } = options;
  const [messages, setMessages] = useState<TeriMessage[]>(() => loadMessagesFromSession());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);

  // Persist messages to session storage whenever they change
  useEffect(() => {
    saveMessagesToSession(messages);
  }, [messages]);

  const sendMessage = useCallback(async (content: string, isRetry = false) => {
    if (!content.trim() || isLoading) return;

    setError(null);
    setLastFailedMessage(null);

    const userMessage: TeriMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    // Only add user message if not a retry (retry reuses existing message)
    if (!isRetry) {
      setMessages((prev) => [...prev, userMessage]);
    }
    setIsLoading(true);

    try {
      let data: TeriChatResponse;

      if (useStub) {
        // Stub mode: generate response locally without API call
        data = await getStubResponse(content.trim());
      } else {
        // Real mode: call the API
        const context: TeriPageContext = {
          path: pageContext.path || (typeof window !== 'undefined' ? window.location.pathname : ''),
          title: pageContext.title || (typeof document !== 'undefined' ? document.title : ''),
          headings: pageContext.headings || [],
        };

        const currentMessages = isRetry ? messages : [...messages, userMessage];
        const requestBody: TeriChatRequest = {
          messages: currentMessages.map((m) => ({ role: m.role, content: m.content })),
          pageContext: context,
        };

        const response = await fetch('/api/teri/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        data = await response.json();
      }

      const assistantMessage: TeriMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.message,
        actions: data.actions,
        citations: data.citations,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('TERI chat error:', err);
      setError("Something went wrong. Let's try that again.");
      setLastFailedMessage(content.trim());
      
      // Add error message as assistant response with retry hint
      const errorMessage: TeriMessage = {
        id: generateId(),
        role: 'assistant',
        content: "Oops! I couldn't connect just now. Tap **Retry** below or try again in a moment.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, pageContext, isLoading, useStub]);

  const retry = useCallback(() => {
    if (lastFailedMessage) {
      // Remove the last error message before retrying
      setMessages((prev) => prev.slice(0, -1));
      sendMessage(lastFailedMessage, true);
    }
  }, [lastFailedMessage, sendMessage]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
    setLastFailedMessage(null);
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      // Ignore errors in SSR
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    lastFailedMessage,
    sendMessage,
    retry,
    clearHistory,
  };
}
