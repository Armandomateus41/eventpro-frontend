import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  MapPin,
  Users,
  LogOut,
  BarChart3,
  Plus,
} from "lucide-react";

interface Event {
  id: string;
  name: string;
  description: string;
  eventDate: string;
  location: string;
  onlineLink?: string;
  maxCapacity: number;
}

const Dashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const apiUrl =
    import.meta.env.VITE_API_URL ||
    "https://eventpro-backend-yzlq.onrender.com";

  useEffect(() => {
    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      navigate("/login");
      return;
    }

    const fetchEvents = async () => {
      try {
        const res = await fetch(`${apiUrl}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao carregar eventos");

        setEvents(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
        toast.error(err.message || "Falha ao buscar eventos");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token, navigate, apiUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Carregando eventos...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white/10 backdrop-blur-md border-r border-white/20 p-6 flex flex-col">
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
            E
          </div>
          <h2 className="ml-3 text-xl font-bold text-white">EventPro</h2>
        </div>

        <nav className="flex-1 space-y-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-blue-600/30"
            onClick={() => navigate("/events")}
          >
            <Calendar className="w-5 h-5 mr-3" /> Eventos
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-blue-600/30"
            onClick={() => navigate("/reservations")}
          >
            <Users className="w-5 h-5 mr-3" /> Reservas
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-blue-600/30"
            onClick={() => navigate("/stats")}
          >
            <BarChart3 className="w-5 h-5 mr-3" /> Estatísticas
          </Button>

          {/* Botão Criar Evento (apenas ADMIN) */}
          {user?.role === "ADMIN" && (
            <Button
              variant="ghost"
              className="w-full justify-start text-green-400 hover:bg-green-600/30"
              onClick={() => navigate("/create-event")}
            >
              <Plus className="w-5 h-5 mr-3" /> Criar Evento
            </Button>
          )}
        </nav>

        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:bg-red-500/20"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          <LogOut className="w-5 h-5 mr-3" /> Sair
        </Button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-white/20 bg-white/10 backdrop-blur-md">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Botão Novo Evento no Header (apenas ADMIN) */}
            {user?.role === "ADMIN" && (
              <Button
                onClick={() => navigate("/create-event")}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" /> Novo Evento
              </Button>
            )}
            <span className="text-white select-none cursor-default">
              {user?.name || "Usuário"}
            </span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Eventos</h2>

          {/* Barra de Filtros */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl mb-8">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                <Input
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 rounded-xl"
                />
              </div>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                className="bg-white/10 border-white/20 text-white rounded-xl"
              />

              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl">
                Aplicar Filtros
              </Button>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-600/20 to-blue-400/20 border-blue-400/30">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-bold text-white">{events.length}</p>
                <p className="text-white/70">Eventos Encontrados</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-600/20 to-green-400/20 border-green-400/30">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-bold text-white">
                  {events.reduce((acc, ev) => acc + ev.maxCapacity, 0)}
                </p>
                <p className="text-white/70">Vagas Disponíveis</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-600/20 to-pink-400/20 border-purple-400/30">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-bold text-white">
                  {new Set(events.map((ev) => ev.location)).size}
                </p>
                <p className="text-white/70">Locais Diferentes</p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Eventos */}
          {events.length === 0 ? (
            <p className="text-white/70 text-center">
              Nenhum evento disponível no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition shadow-lg"
                >
                  <CardContent className="p-5 text-white">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-lg font-bold">{event.name}</div>
                      <div className="flex items-center text-sm text-blue-300">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(event.eventDate).toLocaleDateString("pt-BR")}
                      </div>
                    </div>

                    <p className="text-white/70 mb-3">{event.description}</p>

                    <div className="flex items-center mb-3">
                      <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                      <span>{event.location}</span>
                    </div>

                    <div className="flex items-center text-sm text-white/70">
                      <Users className="w-4 h-4 mr-2 text-green-400" />
                      Capacidade: {event.maxCapacity}
                    </div>

                    {event.onlineLink && (
                      <a
                        href={event.onlineLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-3 text-blue-400 underline"
                      >
                        Acessar Link do Evento
                      </a>
                    )}

                    <Button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl">
                      Reservar Agora
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
