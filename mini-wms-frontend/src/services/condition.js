import { apiFetch } from "./api";

export async function getConditions() {
  return apiFetch("/condition", {
    method: "GET",
  });
}