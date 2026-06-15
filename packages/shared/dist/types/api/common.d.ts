export type ApiErrorCode = "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR" | "RATE_LIMITED" | "INTERNAL_ERROR" | "PROVIDER_UNAVAILABLE";
export interface ApiError {
    error: {
        code: ApiErrorCode;
        message: string;
        details?: Record<string, unknown>;
        requestId?: string;
    };
}
export interface Paginated<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        hasMore: boolean;
    };
}
export declare function createApiError(code: ApiErrorCode, message: string, details?: Record<string, unknown>): ApiError;
//# sourceMappingURL=common.d.ts.map