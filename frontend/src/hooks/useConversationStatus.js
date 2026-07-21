import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

/**
 * Subscribes to Supabase Realtime updates for a single conversation row and
 * returns its live `status`. Falls back to the provided initial status.
 */
export function useConversationStatus(conversationId, initialStatus = 'idle') {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus, conversationId]);

  useEffect(() => {
    if (!conversationId) return undefined;

    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.new?.status) setStatus(payload.new.status);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return [status, setStatus];
}
