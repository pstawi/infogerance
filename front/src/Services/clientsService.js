import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
const API_URL = `${BASE_URL}/api/clients`;

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

export async function getClients() {
  const res = await axios.get(API_URL, ACCEPT_JSONLD);
  return fromApiListResponse(res.data);
}

export async function addClient(data) {
  // dateCreation gérée coté back si configurée, sinon passer une date ici
  const res = await axios.post(API_URL, data, JSONLD_HEADERS);
  return res.data;
}

export async function updateClient(id, data) {
  const res = await axios.patch(`${API_URL}/${id}`, data, MERGE_PATCH_HEADERS);
  return res.data;
}

export async function deleteClient(id) {
  await axios.delete(`${API_URL}/${id}`, ACCEPT_JSONLD);
} 