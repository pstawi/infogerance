import api from "./http";

const JSON_HEADERS = { headers: { "Content-Type": "application/json", Accept: "application/json" } };

export async function login(email, password) {
  const res = await api.post(`/api/login_check`, { username: email, password }, JSON_HEADERS);
  const { token } = res.data;
  localStorage.setItem("auth_token", token);
  return token;
}

export function logout() {
  localStorage.removeItem("auth_token");
}

export async function getProfile() {
  const res = await api.get(`/api/me`, { headers: { Accept: "application/ld+json" } });
  return res.data;
}

export async function changePassword(currentPassword, newPassword) {
  const res = await api.post(`/api/change_password`, { currentPassword, newPassword }, JSON_HEADERS);
  return res.data;
} 