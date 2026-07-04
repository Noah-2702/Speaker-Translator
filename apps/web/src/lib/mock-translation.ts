/**
 * Mock utilities for real-time translation, STT, TTS, and audio synchronization.
 * These are functional mocks that simulate the AI pipeline behavior.
 */

export interface TranscriptSegment {
  id: string;
  text: string;
  timestamp: number;
  duration: number;
  language: string;
  pauseMarkers: PauseMarker[];
}

export interface PauseMarker {
  type: 'short' | 'long';
  duration: number; // in milliseconds
}

export interface TranslatedSegment extends TranscriptSegment {
  originalText: string;
  translatedText: string;
}

/**
 * Mock Speech-to-Text (STT) simulation
 * Simulates Whisper API with VAD-based pause detection
 */
export class MockSTTEngine {
  private buffer: string[] = [];
  private pauseThreshold = 2000; // 2 seconds

  /**
   * Simulate real-time transcription with pause detection
   */
  async transcribeAudioChunk(audioData: Blob): Promise<TranscriptSegment> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock transcription result
    const mockTranscriptions = [
      "Good morning, brothers and sisters.",
      "Today, we gather to discuss the importance of faith.",
      "In these challenging times, we must hold onto our beliefs.",
      "Let us pray together.",
    ];

    const randomText = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
    const pauseMarkers = this.detectPauses(randomText);

    return {
      id: `segment-${Date.now()}`,
      text: randomText,
      timestamp: Date.now(),
      duration: 3000 + Math.random() * 2000,
      language: 'en',
      pauseMarkers,
    };
  }

  /**
   * Detect pause markers based on text analysis
   */
  private detectPauses(text: string): PauseMarker[] {
    const pauses: PauseMarker[] = [];
    const sentences = text.split(/[.!?]+/);

    sentences.forEach((_, index) => {
      if (index < sentences.length - 1) {
        pauses.push({
          type: index % 2 === 0 ? 'short' : 'long',
          duration: index % 2 === 0 ? 500 : 1500,
        });
      }
    });

    return pauses;
  }
}

/**
 * Mock Contextual Translation Engine
 * Simulates Claude/GPT-4 translation with context awareness
 */
export class MockTranslationEngine {
  private contextWindow: string = '';

  setContext(context: string): void {
    this.contextWindow = context;
  }

  /**
   * Translate text with context awareness
   */
  async translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock translation results
    const translations: Record<string, Record<string, string>> = {
      en: {
        'es': 'Buenos días, hermanos y hermanas.',
        'fr': 'Bonjour, frères et sœurs.',
        'id': 'Selamat pagi, saudara-saudari.',
        'zh-CN': '早上好，兄弟姐妹们。',
      },
    };

    // Return mock translation or fallback to original
    return translations[sourceLanguage]?.[targetLanguage] || text;
  }

  /**
   * Batch translate multiple segments
   */
  async translateBatch(
    segments: string[],
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string[]> {
    return Promise.all(
      segments.map(seg => this.translate(seg, sourceLanguage, targetLanguage))
    );
  }
}

/**
 * Mock Voice Cloning & TTS Engine
 * Simulates ElevenLabs/XTTS voice cloning
 */
export class MockTTSEngine {
  private voiceProfile: string = '';

  setVoiceProfile(voiceId: string): void {
    this.voiceProfile = voiceId;
  }

  /**
   * Generate speech audio from text
   */
  async synthesize(text: string, language: string): Promise<Blob> {
    // Simulate TTS processing delay
    const estimatedDuration = (text.length / 5) * 1000; // Rough estimate
    await new Promise(resolve => setTimeout(resolve, Math.min(estimatedDuration, 2000)));

    // Return mock audio blob (in production, this would be actual audio data)
    return new Blob(['mock-audio-data'], { type: 'audio/mp3' });
  }

  /**
   * Synthesize with pause markers for natural rhythm
   */
  async synthesizeWithPauses(
    text: string,
    language: string,
    pauseMarkers: PauseMarker[]
  ): Promise<Blob> {
    // Simulate TTS with pause insertion
    const audioBlob = await this.synthesize(text, language);

    // In production, this would insert actual silence into the audio
    return audioBlob;
  }
}

/**
 * Mock Dynamic Audio Sync Engine
 * Manages buffer compression/expansion for natural speech cadence
 */
export class MockAudioSyncEngine {
  private bufferSize = 0;
  private maxBufferSize = 10000; // 10 seconds
  private minBufferSize = 1000; // 1 second
  private playbackRate = 1.0;

  /**
   * Calculate optimal playback rate based on buffer state
   */
  calculatePlaybackRate(currentBufferMs: number): number {
    if (currentBufferMs > this.maxBufferSize) {
      // Buffer too full, speed up playback
      this.playbackRate = 1.1;
    } else if (currentBufferMs < this.minBufferSize) {
      // Buffer too low, slow down playback
      this.playbackRate = 0.9;
    } else {
      // Buffer healthy, normal playback
      this.playbackRate = 1.0;
    }

    return this.playbackRate;
  }

  /**
   * Simulate graceful pause when speaker pauses
   */
  async handleSpeakerPause(pauseDuration: number): Promise<void> {
    // Simulate listener audio buffer depletion
    await new Promise(resolve => setTimeout(resolve, pauseDuration));
  }

  /**
   * Get current buffer status
   */
  getBufferStatus(): {
    currentSize: number;
    maxSize: number;
    utilization: number;
    playbackRate: number;
  } {
    return {
      currentSize: this.bufferSize,
      maxSize: this.maxBufferSize,
      utilization: this.bufferSize / this.maxBufferSize,
      playbackRate: this.playbackRate,
    };
  }
}

/**
 * Mock WebSocket Broadcast Node
 * Simulates real-time broadcasting to multiple listeners
 */
export class MockBroadcastNode {
  private listeners: Set<string> = new Set();
  private messageQueue: any[] = [];

  /**
   * Add listener to broadcast
   */
  addListener(listenerId: string): void {
    this.listeners.add(listenerId);
  }

  /**
   * Remove listener from broadcast
   */
  removeListener(listenerId: string): void {
    this.listeners.delete(listenerId);
  }

  /**
   * Broadcast message to all connected listeners
   */
  async broadcast(message: any): Promise<void> {
    this.messageQueue.push({
      ...message,
      broadcastedAt: Date.now(),
      recipientCount: this.listeners.size,
    });

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  /**
   * Get broadcast statistics
   */
  getStats(): {
    activeListeners: number;
    queuedMessages: number;
    lastBroadcast: number | null;
  } {
    return {
      activeListeners: this.listeners.size,
      queuedMessages: this.messageQueue.length,
      lastBroadcast: this.messageQueue.length > 0 ? this.messageQueue[this.messageQueue.length - 1].broadcastedAt : null,
    };
  }
}

/**
 * Unified VoiceBridge AI Pipeline
 * Orchestrates all mock components
 */
export class VoiceBridgeAIPipeline {
  private sttEngine: MockSTTEngine;
  private translationEngine: MockTranslationEngine;
  private ttsEngine: MockTTSEngine;
  private audioSyncEngine: MockAudioSyncEngine;
  private broadcastNode: MockBroadcastNode;

  constructor() {
    this.sttEngine = new MockSTTEngine();
    this.translationEngine = new MockTranslationEngine();
    this.ttsEngine = new MockTTSEngine();
    this.audioSyncEngine = new MockAudioSyncEngine();
    this.broadcastNode = new MockBroadcastNode();
  }

  /**
   * Full pipeline: Audio -> STT -> Translation -> TTS -> Broadcast
   */
  async processAudioSegment(
    audioData: Blob,
    targetLanguages: string[],
    voiceId: string
  ): Promise<void> {
    // Step 1: Transcribe audio
    const transcript = await this.sttEngine.transcribeAudioChunk(audioData);

    // Step 2: Set context and translate
    const translations = await Promise.all(
      targetLanguages.map(lang =>
        this.translationEngine.translate(transcript.text, transcript.language, lang)
      )
    );

    // Step 3: Generate speech for each language
    this.ttsEngine.setVoiceProfile(voiceId);
    const audioBlobs = await Promise.all(
      translations.map((text, idx) =>
        this.ttsEngine.synthesizeWithPauses(text, targetLanguages[idx], transcript.pauseMarkers)
      )
    );

    // Step 4: Broadcast to listeners
    await this.broadcastNode.broadcast({
      segmentId: transcript.id,
      originalText: transcript.text,
      translations: Object.fromEntries(
        targetLanguages.map((lang, idx) => [lang, translations[idx]])
      ),
      audioBlobs,
      pauseMarkers: transcript.pauseMarkers,
    });
  }

  /**
   * Get pipeline statistics
   */
  getPipelineStats() {
    return {
      broadcast: this.broadcastNode.getStats(),
      audioSync: this.audioSyncEngine.getBufferStatus(),
    };
  }
}
