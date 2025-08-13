import type { AxiosError } from "axios";

export function getApiError(e: unknown, fallback = "Something went wrong") {
  const err = e as AxiosError<any>;
  return err?.response?.data?.message || err?.message || fallback;
}
