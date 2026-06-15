import type { SupportedLanguage } from "../types/api/events.js";

export const SUPPORTED_LANGUAGES: {
  code: SupportedLanguage;
  label: string;
}[] = [
  { code: "en", label: "English" },
  { code: "id", label: "Indonesian" },
  { code: "zh-CN", label: "Chinese (Simplified)" },
];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "English",
  id: "Indonesian",
  "zh-CN": "Chinese (Simplified)",
};

export const DEFAULT_SOURCE_LANGUAGE: SupportedLanguage = "en";

export const ROOM_CODE_LENGTH = 6;
export const ROOM_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
