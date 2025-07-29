import axios from "axios";

const apiUrl =
  import.meta.env.VITE_API_URL || "https://eventpro-backend-yzlq.onrender.com";

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptador: injeta token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//
// =====================
// AUTH ENDPOINTS
// =====================
export const AuthAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (email: string, password: string, role: "USER" | "ADMIN" = "USER") =>
    api.post("/auth/register", { email, password, role }),

  profile: () => api.get("/users/me"),
};

//
// =====================
// EVENTS ENDPOINTS
// =====================
export const EventsAPI = {
  getAll: () => api.get("/events"),
  getById: (id: string) => api.get(`/events/${id}`),
  create: (eventData: any) => api.post("/events", eventData), // admin only
  update: (id: string, eventData: any) => api.put(`/events/${id}`, eventData), // admin only
  delete: (id: string) => api.delete(`/events/${id}`), // admin only
};

//
// =====================
// RESERVATIONS ENDPOINTS
// =====================
export const ReservationsAPI = {
  reserve: (eventId: string) => api.post(`/reservations/${eventId}/reserve`),
  cancel: (reservationId: string) => api.delete(`/reservations/${reservationId}`),
  myReservations: () => api.get("/reservations/my"),
  getEventReservations: (eventId: string) =>
    api.get(`/reservations/event/${eventId}`), // admin only
};
