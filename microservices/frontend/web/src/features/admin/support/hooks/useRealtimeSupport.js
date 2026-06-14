import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Supabase Realtime hook for support dashboard.
 * Subscribes to changes on support_tickets, ticket_messages, and ticket_activity tables.
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
 */
export const useRealtimeSupport = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // Skip if Supabase not configured
    if (!supabaseUrl || !supabaseKey) return;

    let supabase;
    let channels = [];

    const setup = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        supabase = createClient(supabaseUrl, supabaseKey);

        // Ticket changes
        const ticketChannel = supabase
          .channel('support_tickets_realtime')
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'support_tickets',
          }, () => {
            queryClient.invalidateQueries({ queryKey: ['support', 'tickets'] });
            queryClient.invalidateQueries({ queryKey: ['support', 'dashboard'] });
          })
          .subscribe();

        // Message changes
        const messageChannel = supabase
          .channel('ticket_messages_realtime')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'ticket_messages',
          }, (payload) => {
            queryClient.invalidateQueries({
              queryKey: ['support', 'messages', payload.new?.ticket_id],
            });
          })
          .subscribe();

        // Activity changes
        const activityChannel = supabase
          .channel('ticket_activity_realtime')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'ticket_activity',
          }, () => {
            queryClient.invalidateQueries({ queryKey: ['support', 'dashboard'] });
          })
          .subscribe();

        channels = [ticketChannel, messageChannel, activityChannel];
      } catch (err) {
        // Supabase JS not installed — realtime disabled, polling still works
        console.warn('Supabase Realtime not available:', err.message);
      }
    };

    setup();

    return () => {
      channels.forEach(ch => {
        try { supabase?.removeChannel(ch); } catch {}
      });
    };
  }, [queryClient]);
};

export default useRealtimeSupport;
