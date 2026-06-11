import { apiFetch, imageUpload } from "./api";

export async function getItems(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const url = query ? `/items?${query}` : "/items";
  return apiFetch(url, { method: "GET" });
}

export async function getItemById(id) {
  const data = await apiFetch(`/items/${id}`, { method: "GET" });
  const API_BASE = import.meta.env.VITE_API_BASE;
  return {...data, image_url: data.image_path ? API_BASE + data.image_path : null,};
}

export async function addItem(formData) {
  const { image_path, ...rest } = formData;
  return imageUpload("/items", image_path, rest);
}

export async function updateItem(id, formData) {
  const { image_path, ...rest } = formData;
  return imageUpload(`/items/${id}`, image_path, rest, "PUT");
}

export async function disposeItem(id, data) {
  return apiFetch(`/items/${id}/dispose`, { method: "POST", body: data,});
}

export async function restoreItem(id, data) {
  return apiFetch(`/items/${id}/restore`, { method: "POST", body: data,});
}