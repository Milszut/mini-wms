import { apiFetch } from "./api";

export async function getDashboardStats() {
  return apiFetch("/stats/dashboard", {
    method: "GET",
  });
}