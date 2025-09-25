import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
const API_URL = `${BASE_URL}/api/roles`;

function fromApiListResponse(data) {
  if (data && Array.isArray(data["member"])) {
    return data["member"]; 
  }
  return Array.isArray(data) ? data : [];
}

export async function getRoles() {
  const res = await axios.get(API_URL, { headers: { Accept: "application/ld+json" } });
  return fromApiListResponse(res.data);
} 