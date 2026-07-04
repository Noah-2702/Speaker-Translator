/**
 * VoiceBridge API utilities for backend integration
 * Handles Supabase queries, AI pipeline hooks, and WebSocket communication
 */

import { createClient } from '@supabase/supabase-js';
import {
  VoiceBridgeAIPipeline,
  MockSTTEngine,
  MockTranslationEngine,
  MockTTSEngine,
} from './mock-translation';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Event Management API
 */
export const eventAPI = {
  /**
   * Create a new live event
   */
  async createEvent(data: {
    title: string;
    description?: string;
    sourceLanguage: string;
    targetLanguages: string[];
    voiceId: string;
    organizationId: string;
    contextSummary?: string;
  }) {
    try {
      const { data: event, error } = await supabase
        .from('events')
        .insert([
          {
            title: data.title,
            description: data.description,
            source_language: data.sourceLanguage,
            target_languages: data.targetLanguages,
            eleven_labs_voice_id: data.voiceId,
            organization_id: data.organizationId,
            context_summary: data.contextSummary,
            status: 'draft',
            room_code: `room-${Date.now()}`,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, event };
    } catch (error) {
      console.error('Error creating event:', error);
      return { success: false, error };
    }
  },

  /**
   * Update event status (draft -> live -> ended -> archived)
   */
  async updateEventStatus(eventId: string, status: 'live' | 'ended' | 'archived') {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({ status })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, event: data };
    } catch (error) {
      console.error('Error updating event status:', error);
      return { success: false, error };
    }
  },

  /**
   * Get event by room code
   */
  async getEventByRoomCode(roomCode: string) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('room_code', roomCode)
        .single();

      if (error) throw error;
      return { success: true, event: data };
    } catch (error) {
      console.error('Error fetching event:', error);
      return { success: false, error };
    }
  },

  /**
   * Get all events for an organization
   */
  async getOrganizationEvents(organizationId: string) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, events: data };
    } catch (error) {
      console.error('Error fetching organization events:', error);
      return { success: false, error };
    }
  },
};

/**
 * Participant Management API
 */
export const participantAPI = {
  /**
   * Add participant to event
   */
  async joinEvent(eventId: string, userId: string, language: string) {
    try {
      const { data, error } = await supabase
        .from('event_participants')
        .insert([
          {
            event_id: eventId,
            user_id: userId,
            language,
            role: 'free_listener',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, participant: data };
    } catch (error) {
      console.error('Error joining event:', error);
      return { success: false, error };
    }
  },

  /**
   * Get active participants for an event
   */
  async getEventParticipants(eventId: string) {
    try {
      const { data, error } = await supabase
        .from('event_participants')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw error;
      return { success: true, participants: data };
    } catch (error) {
      console.error('Error fetching participants:', error);
      return { success: false, error };
    }
  },

  /**
   * Update participant language preference
   */
  async updateParticipantLanguage(participantId: string, language: string) {
    try {
      const { data, error } = await supabase
        .from('event_participants')
        .update({ language })
        .eq('id', participantId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, participant: data };
    } catch (error) {
      console.error('Error updating participant language:', error);
      return { success: false, error };
    }
  },
};

/**
 * Organization Management API
 */
export const organizationAPI = {
  /**
   * Create a new organization
   */
  async createOrganization(name: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .insert([{ name }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, organization: data };
    } catch (error) {
      console.error('Error creating organization:', error);
      return { success: false, error };
    }
  },

  /**
   * Get user's organizations
   */
  async getUserOrganizations(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('organizations(*)')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { success: true, organizations: data.organizations };
    } catch (error) {
      console.error('Error fetching organizations:', error);
      return { success: false, error };
    }
  },

  /**
   * Get organization details
   */
  async getOrganization(organizationId: string) {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .single();

      if (error) throw error;
      return { success: true, organization: data };
    } catch (error) {
      console.error('Error fetching organization:', error);
      return { success: false, error };
    }
  },
};

/**
 * AI Pipeline Integration
 */
export const aiPipelineAPI = {
  pipeline: new VoiceBridgeAIPipeline(),

  /**
   * Process audio segment through full pipeline
   */
  async processAudioSegment(
    audioData: Blob,
    targetLanguages: string[],
    voiceId: string
  ) {
    try {
      await this.pipeline.processAudioSegment(audioData, targetLanguages, voiceId);
      return { success: true };
    } catch (error) {
      console.error('Error processing audio:', error);
      return { success: false, error };
    }
  },

  /**
   * Get STT engine for real-time transcription
   */
  getSpeechToTextEngine() {
    return new MockSTTEngine();
  },

  /**
   * Get translation engine
   */
  getTranslationEngine() {
    return new MockTranslationEngine();
  },

  /**
   * Get TTS engine for voice synthesis
   */
  getTextToSpeechEngine() {
    return new MockTTSEngine();
  },

  /**
   * Get pipeline statistics
   */
  getPipelineStats() {
    return this.pipeline.getPipelineStats();
  },
};

/**
 * WebSocket Broadcast Manager
 */
export class BroadcastManager {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Function> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Connect to broadcast server
   */
  connect(eventId: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `ws://localhost:3000/ws`;
        this.ws = new WebSocket(`${wsUrl}?eventId=${eventId}&userId=${userId}`);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.listeners.forEach(callback => callback(data));
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.attemptReconnect(eventId, userId);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(eventId: string, userId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect(eventId, userId).catch(err => {
          console.error('Reconnection failed:', err);
        });
      }, delay);
    }
  }

  /**
   * Subscribe to broadcast messages
   */
  subscribe(handler: (data: any) => void): () => void {
    const id = `listener-${Date.now()}`;
    this.listeners.set(id, handler);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(id);
    };
  }

  /**
   * Send message through WebSocket
   */
  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  /**
   * Disconnect from broadcast
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

/**
 * Sermon Library & RAG API
 */
export const libraryAPI = {
  /**
   * Save sermon transcript with embeddings
   */
  async saveSermondTranscript(data: {
    eventId: string;
    transcript: string;
    summary: string;
    embedding: number[]; // Vector embedding from OpenAI
  }) {
    try {
      const { error } = await supabase
        .from('events')
        .update({
          transcript: data.transcript,
          context_summary: data.summary,
          embedding: data.embedding,
        })
        .eq('id', data.eventId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error saving sermon transcript:', error);
      return { success: false, error };
    }
  },

  /**
   * Semantic search in sermon library
   */
  async semanticSearch(query: string, embedding: number[], limit = 5) {
    try {
      // In production, use pgvector similarity search
      const { data, error } = await supabase.rpc('search_sermons', {
        query_embedding: embedding,
        similarity_threshold: 0.5,
        match_count: limit,
      });

      if (error) throw error;
      return { success: true, results: data };
    } catch (error) {
      console.error('Error searching sermons:', error);
      return { success: false, error };
    }
  },

  /**
   * Get sermon by ID
   */
  async getSermon(eventId: string) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      return { success: true, sermon: data };
    } catch (error) {
      console.error('Error fetching sermon:', error);
      return { success: false, error };
    }
  },

  /**
   * Get all sermons for an organization
   */
  async getOrganizationSermons(organizationId: string) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('status', 'archived')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, sermons: data };
    } catch (error) {
      console.error('Error fetching sermons:', error);
      return { success: false, error };
    }
  },
};

/**
 * User Profile API
 */
export const profileAPI = {
  /**
   * Get current user profile
   */
  async getCurrentProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return { success: true, profile: data };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { success: false, error };
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(data: { displayName?: string; role?: string }) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      const { data: profile, error } = await supabase
        .from('profiles')
        .update({
          display_name: data.displayName,
          role: data.role,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, profile };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }
  },
};
