import api from "./http";

const API_URL = `/api/roles`;

function fromApiListResponse(data) {
  if (data && Array.isArray(data["hydra:member"])) {
    return data["hydra:member"]; 
  }
  if (data && Array.isArray(data["member"])) {
    return data["member"]; 
  }
  return Array.isArray(data) ? data : [];
}

export async function getRoles() {
  const res = await api.get(API_URL, { headers: { Accept: "application/ld+json" } });
  return fromApiListResponse(res.data);
} 