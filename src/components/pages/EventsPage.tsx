import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, MapPin, Users, } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LayoutBase from "../layout/LayoutBase";

interface Event {
  id: string;
  name: string;
  description: string;
  eventDate: string;
  location: string;
  maxCapacity: number;
  availableSpots: number;
  price?: number;
  image?: string;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();
  const navigate = useNavigate();
  const apiUrl =
    import.meta.env.VITE_API_URL || "https://eventpro-backend-yzlq.onrender.com";

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${apiUrl}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Erro ao carregar eventos");
        setEvents(Array.isArray(data) ? data : []);
      } catch (err: any) {
        toast.error(err.message || "Falha ao buscar eventos");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token, apiUrl]);

  return (
    <LayoutBase title="Eventos Disponíveis" subtitle="Confira os melhores eventos" user={user}>
      {loading ? (
        <p className="text-white/70 text-center">Carregando eventos...</p>
      ) : events.length === 0 ? (
        <p className="text-white/70 text-center">
          Nenhum evento disponível no momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const formattedDate = new Date(event.eventDate);
            const dateValid = !isNaN(formattedDate.getTime());

            return (
              <Card
                key={event.id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-transform duration-300 rounded-2xl overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={event.image || "https://placehold.co/600x300"}
                    alt={event.name}
                    className="w-full h-48 object-cover brightness-90 hover:brightness-100 transition"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                    {dateValid
                      ? formattedDate.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Data inválida"}
                  </div>
                </div>

                <CardContent className="p-6 text-white space-y-4">
                  <h2 className="text-xl font-bold">{event.name}</h2>
                  <p className="text-white/70 text-sm">{event.description}</p>

                  <div className="flex items-center text-sm text-white/80">
                    <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                    {dateValid
                      ? formattedDate.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Horário indefinido"}
                  </div>

                  <div className="flex items-center text-sm text-white/80">
                    <MapPin className="w-4 h-4 mr-2 text-green-400" />
                    {event.location}
                  </div>

                  <div className="flex items-center text-sm text-white/80">
                    <Users className="w-4 h-4 mr-2 text-purple-400" />
                    {event.availableSpots} vagas de {event.maxCapacity}
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold text-blue-300">
                      {event.price ? `R$ ${event.price}` : "Gratuito"}
                    </span>
                  </div>

                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </LayoutBase>
  );
};

export default EventsPage;
