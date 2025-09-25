import api from "./http";

const API_URL = `/api/statuts`;

function fromApiListResponse(data) {
  if (data && Array.isArray(data["hydra:member"])) {
    return data["hydra:member"]; 
  }
  if (data && Array.isArray(data["member"])) {
    return data["member"]; 
  }
  return Array.isArray(data) ? data : [];
}

export async function getStatuts() {
  const res = await api.get(API_URL, { headers: { Accept: "application/ld+json" } });
  return fromApiListResponse(res.data);
} 