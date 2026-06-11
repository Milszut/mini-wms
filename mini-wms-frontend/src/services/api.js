const API_BASE = import.meta.env.VITE_API_BASE;

function getCookie(name) {
  return document.cookie
    .split('; ')
    .find(r => r.startsWith(name + '='))
    ?.split('=')[1];
}

const MUTATION = new Set(['POST','PUT','PATCH','DELETE']);

export async function apiFetch(path, { method = 'GET', body, headers } = {}) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    credentials: 'include',
  };

  if (MUTATION.has(method.toUpperCase())) {
    const csrf = getCookie('csrf');
    if (csrf) options.headers['X-CSRF-Token'] = csrf;
  }

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, options);

  if (res.status === 401) {
    sessionStorage.clear();
    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    let data = null;
    try { 
        data = await res.json(); 
        if (data?.error) msg = data.error; 
    } 
    catch {}
    const err = new Error(msg); 
    err.status = res.status; 
    err.data = data;
    throw err;
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function imageUpload(path, file, extraFields = {}, method = "POST") {
  const fd = new FormData();

  if (file) fd.append("file", file);
  for (const [k, v] of Object.entries(extraFields)) {
    fd.append(k, v ?? "");
  }

  const headers = {};
  const csrf = getCookie("csrf");
  if (csrf) headers["X-CSRF-Token"] = csrf;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers,
    body: fd,
  });

  if (res.status === 401) {
    sessionStorage.clear();
    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    let data = null;
    try {
      data = await res.json();
      if (data?.error) msg = data.error;
    } catch {}
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}