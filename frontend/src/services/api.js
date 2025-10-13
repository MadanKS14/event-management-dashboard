// src/services/api.js
import axios from 'axios'


const api = axios.create({
baseURL: import.meta.env.VITE_API_BASE ?? 'http://localhost:4000/api',
withCredentials: true,
})


export default api


// Events API helpers
export const eventsApi = {
getAll: () => api.get('/events'),
create: (data) => api.post('/events', data),
update: (id, data) => api.put(`/events/${id}`, data),
remove: (id) => api.delete(`/events/${id}`),
}