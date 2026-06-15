import type {
  EventResponse,
  EventStatus,
  SupportedLanguage,
} from "@rt/shared";

export interface DbEventRow {
  id: string;
  room_code: string;
  title: string;
  description: string | null;
  status: EventStatus;
  source_language: SupportedLanguage;
  target_languages: SupportedLanguage[];
  eleven_labs_voice_id: string;
  context_summary: string | null;
  organization_id: string;
  created_by: string;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbProfileRow {
  id: string;
  display_name: string | null;
  role: "speaker" | "listener" | "admin";
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export function mapEventRow(row: DbEventRow): EventResponse {
  return {
    id: row.id,
    roomCode: row.room_code,
    title: row.title,
    description: row.description,
    status: row.status,
    sourceLanguage: row.source_language,
    targetLanguages: row.target_languages,
    elevenLabsVoiceId: row.eleven_labs_voice_id,
    contextSummary: row.context_summary,
    organizationId: row.organization_id,
    createdBy: row.created_by,
    scheduledAt: row.scheduled_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapProfileRow(row: DbProfileRow) {
  return {
    id: row.id,
    displayName: row.display_name,
    role: row.role,
    organizationId: row.organization_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
