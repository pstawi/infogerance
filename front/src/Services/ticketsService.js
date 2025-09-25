import api from "./http";

const API_URL = `/api/tickets`;

function fromApiListResponse(data) {
  if (data && Array.isArray(data["hydra:member"])) {
    return data["hydra:member"]; 
  }
  if (data && Array.isArray(data["member"])) {
    return data["member"]; 
  }
  return Array.isArray(data) ? data : [];
}

function toApiPayload(data) {
  const payload = {
    titre: data.titre,
    description: data.description,
  };
  if (data.client) payload.clientId = `/api/clients/${data.client}`;
  if (data.contact) payload.contactId = `/api/contacts/${data.contact}`;
  if (data.collaborateur) payload.collaborateurId = `/api/collaborateurs/${data.collaborateur}`;
  if (data.statut) payload.statutId = `/api/statuts/${data.statut}`;
  if (data.tpsResolution !== "" && data.tpsResolution !== null && data.tpsResolution !== undefined) {
    const n = Number(data.tpsResolution);
    if (!Number.isNaN(n)) payload.tpsResolution = n;
  }
  return payload;
}

const ACCEPT_JSONLD = { headers: { Accept: "application/ld+json" } };
const JSONLD_HEADERS = { headers: { "Content-Type": "application/ld+json", Accept: "application/ld+json" } };
const MERGE_PATCH_HEADERS = { headers: { "Content-Type": "application/merge-patch+json", Accept: "application/ld+json" } };

export async function getTickets() {
  const res = await api.get(API_URL, ACCEPT_JSONLD);
  return fromApiListResponse(res.data);
}

export async function addTicket(data) {
  const res = await api.post(API_URL, toApiPayload(data), JSONLD_HEADERS);
  return res.data;
}

export async function updateTicket(id, data) {
  const res = await api.patch(`${API_URL}/${id}`, toApiPayload(data), MERGE_PATCH_HEADERS);
  return res.data;
}

export async function deleteTicket(id) {
  await api.delete(`${API_URL}/${id}`, ACCEPT_JSONLD);
} 