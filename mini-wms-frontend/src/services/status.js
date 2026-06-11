import { apiFetch } from "./api";

export async function getStatuses() {
  return apiFetch("/status", {
    method: "GET",
  });
}