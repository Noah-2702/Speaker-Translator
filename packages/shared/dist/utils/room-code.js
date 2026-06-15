import { ROOM_CODE_ALPHABET, ROOM_CODE_LENGTH, } from "../constants/languages.js";
const defaultRandomSource = {
    nextInt(max) {
        return Math.floor(Math.random() * max);
    },
};
export function generateRoomCode(random = defaultRandomSource, length = ROOM_CODE_LENGTH) {
    let code = "";
    for (let i = 0; i < length; i += 1) {
        code += ROOM_CODE_ALPHABET[random.nextInt(ROOM_CODE_ALPHABET.length)];
    }
    return code;
}
export function isValidRoomCode(value) {
    if (value.length !== ROOM_CODE_LENGTH) {
        return false;
    }
    return [...value].every((char) => ROOM_CODE_ALPHABET.includes(char));
}
