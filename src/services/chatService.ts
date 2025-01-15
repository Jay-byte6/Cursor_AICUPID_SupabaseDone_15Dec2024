import { supabase } from '../lib/supabase';
import type { Message } from '../types';

export const chatService = {
  async initializeChat(userId: string, partnerId: string): Promise<string> {
    try {
      // Create or get existing chat room
      const participants = [userId, partnerId].sort();
      const roomId = `chat_${participants.join('_')}`;

      const { data: existingRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('room_id', roomId)
        .single();

      if (!existingRoom && !roomError) {
        await supabase.from('chat_rooms').insert([
          {
            room_id: roomId,
            participants,
            created_at: new Date().toISOString(),
          },
        ]);
      }

      return roomId;
    } catch (error) {
      console.error('Error initializing chat:', error);
      throw error;
    }
  },

  async sendMessage(roomId: string, userId: string, content: string): Promise<void> {
    try {
      await supabase.from('messages').insert([
        {
          room_id: roomId,
          sender_id: userId,
          content,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async getMessages(roomId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(fullname, profile_image)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  subscribeToMessages(roomId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();
  },
}; 