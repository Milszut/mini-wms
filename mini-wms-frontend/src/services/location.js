import { apiFetch } from "./api";

export async function getLocations() {
  return apiFetch("/location", {
    method: "GET",
  });
}

export async function addLocation(data) {
  return apiFetch("/location", {
    method: "POST",
    body: data,
  });
}

export async function updateLocation(id, data) {
  return apiFetch(`/location/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteLocation(id) {
  return apiFetch(`/location/${id}`, {
    method: "DELETE",
  });
}