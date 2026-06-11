import { apiFetch } from "./api";

export async function getServices() {
  return apiFetch("/service", {
    method: "GET",
  });
}

export async function addService(data) {
  return apiFetch("/service", {
    method: "POST",
    body: data,
  });
}

export async function updateService(id, data) {
  return apiFetch(`/service/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteService(id) {
  return apiFetch(`/service/${id}`, {
    method: "DELETE",
  });
}