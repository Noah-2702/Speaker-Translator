import { describe, expect, it } from "vitest";
import { createEventSchema } from "./events.js";

describe("createEventSchema", () => {
  const validPayload = {
    title: "Sunday Service",
    targetLanguages: ["id", "zh-CN"],
    elevenLabsVoiceId: "voice_123",
    organizationId: "550e8400-e29b-41d4-a716-446655440000",
  };

  it("accepts valid event input", () => {
    const result = createEventSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects empty target languages", () => {
    const result = createEventSchema.safeParse({
      ...validPayload,
      targetLanguages: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects short titles", () => {
    const result = createEventSchema.safeParse({
      ...validPayload,
      title: "AB",
    });
    expect(result.success).toBe(false);
  });
});
