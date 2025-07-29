import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { Button } from "../ui/button";
import {
  Calendar,
  MapPin,
  Users,
  Loader2,
  ArrowLeft,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const { data: event, loading, error, refetch } = useApi<any>(
    `/events/${id}`,
    { immediate: true }
  );

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const handleReserve = async () => {
    if (!token) {
      toast.error("Você precisa estar logado para reservar.");
      navigate("/login");
      return;
    }

    try {
      await api.post(
        `/reservations/${id}/reserve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Reserva realizada com sucesso!");
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erro ao reservar");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        Carregando detalhes do evento...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center text-red-400 mt-20">
        Erro ao carregar evento. {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-indigo-900 to-purple-950 text-white">
      {/* Hero Section */}
      <div className="relative w-full h-72 md:h-96">
        <img
          src={event.image || "https://placehold.co/1200x400"}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-6 left-6">
          <h1 className="text-3xl md:text-5xl font-bold">{event.name}</h1>
          <p className="text-white/80 mt-2 max-w-2xl">
            {event.category || "Evento"}
          </p>
        </div>
        <Button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-black/40 hover:bg-black/60 text-white rounded-full px-3 py-2 shadow-md"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
      </div>

      {/* Event Content */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Descrição */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 space-y-4 border border-white/20">
          <p className="text-lg leading-relaxed">{event.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div className="flex items-center gap-3 text-blue-300">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(event.eventDate).toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                às{" "}
                {new Date(event.eventDate).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center gap-3 text-green-300">
              <MapPin className="w-5 h-5" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-3 text-purple-300">
              <Users className="w-5 h-5" />
              <span>{event.availableSpots} vagas restantes</span>
            </div>
          </div>
        </div>

        {/* Preço + Ação */}
        <div className="bg-gradient-to-r from-indigo-800/50 to-purple-800/50 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-lg text-white/70">Valor do ingresso</p>
            <p className="text-3xl font-bold text-amber-300">
              {event.price ? `R$ ${event.price.toFixed(2)}` : "Gratuito"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleReserve}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-3 rounded-xl text-lg shadow-lg transition-transform hover:scale-105"
            >
              Reservar Agora
            </Button>

            {user?.role === "ADMIN" && (
              <Button
                onClick={() => navigate(`/events/edit/${event.id}`)}
                className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-xl text-lg shadow-lg transition-transform hover:scale-105"
              >
                <Pencil className="w-4 h-4 mr-2" /> Editar Evento
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
