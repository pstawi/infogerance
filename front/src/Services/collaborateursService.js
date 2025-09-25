import axios from "axios";

const API_URL = "http://localhost:5000/api/collaborateurs";

export async function getCollaborateurs() {
  const res = await axios.get(API_URL);
  return res.data;
}

export async function addCollaborateur(data) {
  const res = await axios.post(API_URL, data);
  return res.data;
}

export async function updateCollaborateur(id, data) {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
}

export async function deleteCollaborateur(id) {
  await axios.delete(`${API_URL}/${id}`);
}