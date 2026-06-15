export interface RandomSource {
    nextInt(max: number): number;
}
export declare function generateRoomCode(random?: RandomSource, length?: number): string;
export declare function isValidRoomCode(value: string): boolean;
//# sourceMappingURL=room-code.d.ts.map