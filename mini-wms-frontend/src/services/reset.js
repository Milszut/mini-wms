import { apiFetch } from "./api";

export async function resetDemoData() {
  return apiFetch("/reset", {
    method: "POST",
  });
}