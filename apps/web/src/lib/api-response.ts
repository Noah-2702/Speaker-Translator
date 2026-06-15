import { createApiError, type ApiError } from "@rt/shared";
import { NextResponse } from "next/server";

export function jsonError(
  status: number,
  code: ApiError["error"]["code"],
  message: string,
  details?: Record<string, unknown>,
) {
  return NextResponse.json(createApiError(code, message, details), { status });
}

export function jsonData<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}
