import { describe, expect, it } from "vitest";
import { generateRoomCode, isValidRoomCode } from "./room-code.js";
import { ROOM_CODE_ALPHABET, ROOM_CODE_LENGTH } from "../constants/languages.js";

describe("generateRoomCode", () => {
  it("generates a code of the configured length", () => {
    const code = generateRoomCode({ nextInt: () => 0 });
    expect(code).toHaveLength(ROOM_CODE_LENGTH);
    expect(code).toBe(ROOM_CODE_ALPHABET[0]!.repeat(ROOM_CODE_LENGTH));
  });

  it("uses only allowed alphabet characters", () => {
    const code = generateRoomCode();
    expect(isValidRoomCode(code)).toBe(true);
  });
});

describe("isValidRoomCode", () => {
  it("rejects invalid characters and lengths", () => {
    expect(isValidRoomCode("ABC")).toBe(false);
    expect(isValidRoomCode("ABCIO1")).toBe(false);
  });

  it("accepts valid codes", () => {
    expect(isValidRoomCode("AB2K9P")).toBe(true);
  });
});
