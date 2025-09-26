import api from "./http";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

export async function uploadTicketAttachment(ticketId, file) {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post(`/api/tickets/${ticketId}/attachments`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function getTicketAttachments(ticketId) {
  const res = await api.get(`/api/tickets/${ticketId}/attachments`);
  const list = Array.isArray(res.data) ? res.data : [];
  return list.map((att) => ({ ...att, url: att.url?.startsWith('http') ? att.url : `${BASE_URL}${att.url || ''}` }));
}

export async function deleteTicketAttachment(id) {
  await api.delete(`/api/ticket_attachments/${id}`, { headers: { Accept: 'application/ld+json' } });
} 