import { z } from "zod";
import { SUPPORTED_LANGUAGES } from "../constants/languages.js";
const supportedLanguageSchema = z.enum(["en", "id", "zh-CN"]);
export const createEventSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
    description: z.string().trim().max(2000).optional(),
    targetLanguages: z
        .array(supportedLanguageSchema)
        .min(1, "Select at least one target language")
        .max(3),
    scheduledAt: z.string().datetime().optional(),
    elevenLabsVoiceId: z.string().trim().min(1, "Voice ID is required"),
    organizationId: z.string().uuid("Invalid organization"),
    sourceLanguage: supportedLanguageSchema.optional(),
});
export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    displayName: z.string().trim().min(2).max(80),
    role: z.enum(["speaker", "listener", "admin"]).default("speaker"),
});
export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
export const supportedLanguageOptions = SUPPORTED_LANGUAGES.map((l) => l.code);
