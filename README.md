# VoiceBridge AI - Real-Time Translation Platform

VoiceBridge AI is a comprehensive real-time, cross-lingual audio translation and voice-cloning broadcast platform. It enables speakers (pastors, lecturers, presenters) to stream live audio or upload notes, while an AI pipeline translates the content, clones the speaker's voice, and streams localized audio to listeners globally in real-time.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Development Guide](#development-guide)

## System Overview

### Core Value Proposition

VoiceBridge AI solves the problem of language barriers in live broadcasts by providing:

1. **Real-Time Translation**: Instant translation of spoken content into multiple languages
2. **Voice Cloning**: Maintains the speaker's original voice characteristics in translated audio
3. **Dynamic Pause Detection**: Natural speech rhythm synchronization across languages
4. **Organization-Based Distribution**: Multi-tenant architecture for churches, organizations, and institutions
5. **Smart Library with RAG**: Historical archive with AI-driven retrieval and Q&A capabilities

## Architecture

### High-Level Pipeline

```
[Speaker Audio Input]
       │
       ▼
[Speech-to-Text (VAD / Whisper Live)] ──> [Contextual LLM Translation]
                                                      │
                                                      ▼
[Dynamic Audio Sync / Pause Alignment] <── [Voice-Cloned TTS (ElevenLabs/XTTS)]
       │
       ▼
[WebSocket Broadcast Node] ──> [Congregation Client Devices]
```

### Component Breakdown

#### 1. **Transcription Layer**
- **Technology**: Whisper API with Voice Activity Detection (VAD)
- **Purpose**: Capture exact words and sentence boundaries in real-time
- **Location**: `src/lib/mock-translation.ts` (MockSTTEngine)

#### 2. **Contextual Translation**
- **Technology**: Claude 3.5 Sonnet or GPT-4o-mini
- **Context**: Speaker's uploaded notes for theological terms and cultural idioms
- **Location**: `src/lib/mock-translation.ts` (MockTranslationEngine)

#### 3. **Voice Cloning & TTS**
- **Technology**: ElevenLabs API or XTTS v2
- **Purpose**: Zero-shot voice synthesis maintaining speaker's timbre and energy
- **Location**: `src/lib/mock-translation.ts` (MockTTSEngine)

#### 4. **Natural Rhythm Synchronization**
- **Markers**: `[pause_short]`, `[pause_long]` from VAD layer
- **Client-Side**: Dynamic buffer compression/expansion
- **Location**: `src/lib/mock-translation.ts` (MockAudioSyncEngine)

#### 5. **WebSocket Broadcast**
- **Protocol**: Real-time bidirectional communication
- **Listeners**: Multiple concurrent connections per event
- **Location**: `src/lib/mock-translation.ts` (MockBroadcastNode)

## Features

### Epic 1: Live Broadcast Module

#### Speaker Dashboard
- **Go Live Interface**: Integrated audio input toggle
- **Real-Time Transcript Preview**: Live transcription display
- **Notes Integration**: Uploaded materials displayed during broadcast
- **Language Selection**: Multi-language target configuration
- **Broadcast Statistics**: Active listener count, duration, language metrics

#### Listener Dashboard
- **Language Picker**: Dropdown for preferred translation language
- **Play/Pause Controls**: Audio stream management
- **Scrolling Transcript Feed**: Synchronized translated text
- **Volume Control**: Individual audio adjustment
- **Connection Status**: Real-time latency and buffer monitoring

#### Audio Buffering Logic
- 2-second speaker pause detection
- Graceful listener buffer depletion
- Natural conversational cadence maintenance

### Epic 2: Organization & Content Distribution

#### Party (Organization) Creation
- Unique access codes and invite links
- Multi-tenant isolation
- Member management

#### Note Distribution Matrix
- Markdown/PDF upload support
- Automatic async translation
- Pre-broadcast distribution to listeners

### Epic 3: Smart Library & RAG Chat Companion

#### Archival System
- PostgreSQL vector database (pgvector)
- Master audio, transcripts, and translations storage
- Automatic sermon archival

#### AI Chatbox
- Contextual chat interface per sermon
- Vector similarity search for relevant chunks
- Capabilities:
  - Semantic summaries
  - Key takeaway extraction
  - Scripture cross-reference identification

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI + Custom components
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Vector Storage**: pgvector extension
- **Real-Time**: WebSocket (custom or Socket.io)
- **File Storage**: Supabase Storage (S3-compatible)

### AI/ML Services
- **Speech-to-Text**: Groq Whisper Cloud
- **Translation**: Claude 3.5 Sonnet / GPT-4o-mini
- **Voice Cloning**: ElevenLabs API / XTTS v2
- **Embeddings**: OpenAI Embeddings API
- **RAG**: LangChain or custom implementation

### DevOps
- **Deployment**: Vercel (frontend), Railway/Render (backend)
- **Monitoring**: Sentry for error tracking
- **CI/CD**: GitHub Actions

## Project Structure

```
Speaker-Translator/
├── apps/
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   │   ├── voicebridge/
│       │   │   │   └── page.tsx          # Main VoiceBridge page
│       │   │   ├── (auth)/
│       │   │   ├── api/
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   └── globals.css           # Dark theme styling
│       │   ├── components/
│       │   │   ├── speaker-dashboard.tsx # Speaker UI
│       │   │   ├── listener-dashboard.tsx # Listener UI
│       │   │   ├── smart-library.tsx     # Library & RAG UI
│       │   │   └── ui/                   # Radix UI components
│       │   └── lib/
│       │       ├── mock-translation.ts   # AI pipeline mocks
│       │       ├── voicebridge-api.ts    # Backend integration
│       │       ├── supabase/
│       │       └── utils.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── next.config.mjs
├── packages/
│   ├── db/                              # Database utilities
│   ├── config/                          # Shared config
│   └── shared/                          # Shared types
├── supabase/
│   ├── migrations/
│   │   ├── 202506140001_initial_schema.sql
│   │   ├── 202506140002_rls_policies.sql
│   │   └── 20260704145618_update_voicebridge_schema.sql
│   └── config.toml
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account
- API keys for AI services (OpenAI, ElevenLabs, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Noah-2702/Speaker-Translator.git
   cd Speaker-Translator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

   Required variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_WS_URL=your_websocket_url
   OPENAI_API_KEY=your_openai_key
   ELEVENLABS_API_KEY=your_elevenlabs_key
   ```

4. **Set up Supabase**
   ```bash
   supabase link --project-ref your_project_ref
   supabase db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Database Schema

### Users Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  role user_role ('speaker', 'premium_listener', 'free_listener', 'admin'),
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Organizations Table
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status event_status ('draft', 'scheduled', 'live', 'ended', 'archived'),
  source_language supported_language,
  target_languages supported_language[],
  eleven_labs_voice_id TEXT,
  transcript TEXT,
  embedding vector(1536),
  context_summary TEXT,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  created_by UUID NOT NULL REFERENCES profiles(id),
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Event Participants Table
```sql
CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  role user_role,
  language supported_language,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, user_id)
);
```

## API Documentation

### Event Management

#### Create Event
```typescript
const { event, error } = await eventAPI.createEvent({
  title: 'Sunday Service',
  sourceLanguage: 'en',
  targetLanguages: ['es', 'fr', 'id'],
  voiceId: 'your-voice-id',
  organizationId: 'org-id',
  contextSummary: 'Weekly sermon'
});
```

#### Update Event Status
```typescript
const { event, error } = await eventAPI.updateEventStatus(eventId, 'live');
```

### Participant Management

#### Join Event
```typescript
const { participant, error } = await participantAPI.joinEvent(
  eventId,
  userId,
  'es' // preferred language
);
```

### AI Pipeline

#### Process Audio Segment
```typescript
const { error } = await aiPipelineAPI.processAudioSegment(
  audioBlob,
  ['es', 'fr', 'id'],
  'voice-id'
);
```

### Broadcast Management

```typescript
const broadcast = new BroadcastManager();

// Connect to broadcast
await broadcast.connect(eventId, userId);

// Subscribe to messages
const unsubscribe = broadcast.subscribe((data) => {
  console.log('Received:', data);
});

// Send message
broadcast.send({ type: 'chat', message: 'Hello!' });

// Disconnect
broadcast.disconnect();
```

## Development Guide

### Adding New Features

1. **Create UI Components**
   - Add to `src/components/`
   - Use Tailwind CSS for styling
   - Maintain dark theme consistency

2. **Backend Integration**
   - Add API methods to `src/lib/voicebridge-api.ts`
   - Use Supabase client for database operations
   - Handle errors gracefully

3. **Type Safety**
   - Define types in `src/lib/types.ts` (create if needed)
   - Use TypeScript strict mode
   - Export types from shared packages

### Testing

```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint

# Build for production
npm run build
```

### Deployment

#### Frontend (Vercel)
```bash
vercel deploy
```

#### Backend (Railway/Render)
- Connect GitHub repository
- Set environment variables
- Deploy on push to main branch

## User Roles & Permissions

### Speaker / Admin
- ✅ Create/Manage Organizations
- ✅ Upload transcripts and notes
- ✅ Initiate live broadcasts
- ✅ Access complete analytics
- ✅ Manage historical library

### Premium Listener
- ✅ Join active broadcasts
- ✅ Select translation language
- ✅ Stream cloned audio in real-time
- ✅ Unlimited library access
- ✅ AI chat companion access

### Free Listener
- ✅ Join public broadcasts
- ✅ Standard latency streaming
- ⚠️ Limited monthly library lookups
- ⚠️ Basic chat summaries only

## Performance Optimization

### Frontend
- Code splitting with Next.js dynamic imports
- Image optimization with next/image
- CSS-in-JS with Tailwind for smaller bundles
- Service Workers for offline support

### Backend
- Database query optimization with indexes
- Connection pooling for Supabase
- Caching strategies with Redis (optional)
- CDN for static assets

### Audio Processing
- Client-side audio buffering
- Adaptive bitrate streaming
- Compression for low-bandwidth scenarios

## Troubleshooting

### WebSocket Connection Issues
- Check firewall rules
- Verify WebSocket URL in environment
- Check browser console for errors
- Ensure server is running

### Translation Quality
- Provide better context in notes
- Use specific terminology glossaries
- Test with different LLM models
- Monitor translation latency

### Audio Sync Issues
- Adjust buffer size thresholds
- Check network latency
- Verify pause detection sensitivity
- Monitor client-side performance

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For support, email support@voicebridge.ai or open an issue on GitHub.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-speaker support
- [ ] Custom branding for organizations
- [ ] Integration with streaming platforms (YouTube, Facebook Live)
- [ ] Advanced RAG with document chunking strategies
- [ ] Real-time sentiment analysis
- [ ] Accessibility features (captions, audio descriptions)

---

**Built with ❤️ by the VoiceBridge Team**
