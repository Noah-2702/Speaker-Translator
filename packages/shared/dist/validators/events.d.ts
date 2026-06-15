import { z } from "zod";
export declare const createEventSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    targetLanguages: z.ZodArray<z.ZodEnum<["en", "id", "zh-CN"]>, "many">;
    scheduledAt: z.ZodOptional<z.ZodString>;
    elevenLabsVoiceId: z.ZodString;
    organizationId: z.ZodString;
    sourceLanguage: z.ZodOptional<z.ZodEnum<["en", "id", "zh-CN"]>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    targetLanguages: ("en" | "id" | "zh-CN")[];
    elevenLabsVoiceId: string;
    organizationId: string;
    description?: string | undefined;
    scheduledAt?: string | undefined;
    sourceLanguage?: "en" | "id" | "zh-CN" | undefined;
}, {
    title: string;
    targetLanguages: ("en" | "id" | "zh-CN")[];
    elevenLabsVoiceId: string;
    organizationId: string;
    description?: string | undefined;
    scheduledAt?: string | undefined;
    sourceLanguage?: "en" | "id" | "zh-CN" | undefined;
}>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export declare const signUpSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    displayName: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["speaker", "listener", "admin"]>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    displayName: string;
    role: "speaker" | "listener" | "admin";
}, {
    email: string;
    password: string;
    displayName: string;
    role?: "speaker" | "listener" | "admin" | undefined;
}>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export declare const signInSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type SignInInput = z.infer<typeof signInSchema>;
export declare const supportedLanguageOptions: import("../index.js").SupportedLanguage[];
//# sourceMappingURL=events.d.ts.map