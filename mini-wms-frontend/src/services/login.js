import { apiFetch } from "./api";

export async function login(username, password) {
    return apiFetch('/auth/login', {
        method: 'POST',
        body: {username, password},
    });
}

export async function logout() {
    return apiFetch('/auth/logout', {
        method: 'POST'
    });
}

export async function getUser(){
    return apiFetch('/user', {
        method: 'GET'
    });
}