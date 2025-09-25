import api from "./http";

const API_URL = `/api/collaborateurs`;

function toApiPayload(data) {
  const payload = {
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
  };
  if (data.password) {
    payload.password = data.password;
  }
  if (data.role) {
    payload.roleId = `/api/roles/${data.role}`;
  }
  return payload;
}

function fromApiListResponse(data) {
  if (data && Array.isArray(data["hydra:member"])) {
    return data["hydra:member"]; 
  }
  if (data && Array.isArray(data["member"])) {
    return data["member"]; 
  }
  return Array.isArray(data) ? data : [];
}

const ACCEPT_JSONLD = { headers: { Accept: "application/ld+json" } };
const JSONLD_HEADERS = { headers: { "Content-Type": "application/ld+json", Accept: "application/ld+json" } };
const MERGE_PATCH_HEADERS = { headers: { "Content-Type": "application/merge-patch+json", Accept: "application/ld+json" } };

export async function getCollaborateurs() {
  const res = await api.get(API_URL, ACCEPT_JSONLD);
  return fromApiListResponse(res.data);
}

export async function addCollaborateur(data) {
  const res = await api.post(API_URL, toApiPayload(data), JSONLD_HEADERS);
  return res.data;
}

export async function updateCollaborateur(id, data) {
  const res = await api.patch(`${API_URL}/${id}`, toApiPayload(data), MERGE_PATCH_HEADERS);
  return res.data;
}

export async function deleteCollaborateur(id) {
  await api.delete(`${API_URL}/${id}`, ACCEPT_JSONLD);
}