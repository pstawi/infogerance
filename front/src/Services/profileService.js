import api from "./http";

export async function getMe() {
  const res = await api.get(`/api/me`, { headers: { Accept: 'application/json' } });
  return res.data;
}

export async function updateMyProfile(payload) {
  const res = await api.patch(`/api/me/profile`, payload, { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } });
  return res.data;
} 