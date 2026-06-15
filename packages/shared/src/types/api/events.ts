export type SupportedLanguage = "en" | "id" | "zh-CN";
export type EventStatus = "draft" | "scheduled" | "live" | "ended" | "archived";
export type UserRole = "speaker" | "listener" | "admin";

export interface CreateEventRequest {
  title: string;
  description?: string;
  targetLanguages: SupportedLanguage[];
  scheduledAt?: string;
  elevenLabsVoiceId: string;
  organizationId: string;
  sourceLanguage?: SupportedLanguage;
}

export interface EventResponse {
  id: string;
  roomCode: string;
  title: string;
  description: string | null;
  status: EventStatus;
  sourceLanguage: SupportedLanguage;
  targetLanguages: SupportedLanguage[];
  elevenLabsVoiceId: string;
  contextSummary: string | null;
  organizationId: string;
  createdBy: string;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateEventResponse = { data: EventResponse };

export type GetEventResponse = { data: EventResponse };

export interface JoinEventMetadata {
  eventId: string;
  title: string;
  status: EventStatus;
  targetLanguages: SupportedLanguage[];
  speakerDisplayName?: string;
}

export type JoinEventResponse = { data: JoinEventMetadata };

export interface Profile {
  id: string;
  displayName: string | null;
  role: UserRole;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
}
