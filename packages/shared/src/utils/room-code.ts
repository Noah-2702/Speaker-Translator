import {
  ROOM_CODE_ALPHABET,
  ROOM_CODE_LENGTH,
} from "../constants/languages.js";

export interface RandomSource {
  nextInt(max: number): number;
}

const defaultRandomSource: RandomSource = {
  nextInt(max: number) {
    return Math.floor(Math.random() * max);
  },
};

export function generateRoomCode(
  random: RandomSource = defaultRandomSource,
  length: number = ROOM_CODE_LENGTH,
): string {
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += ROOM_CODE_ALPHABET[random.nextInt(ROOM_CODE_ALPHABET.length)]!;
  }
  return code;
}

export function isValidRoomCode(value: string): boolean {
  if (value.length !== ROOM_CODE_LENGTH) {
    return false;
  }
  return [...value].every((char) => ROOM_CODE_ALPHABET.includes(char));
}
