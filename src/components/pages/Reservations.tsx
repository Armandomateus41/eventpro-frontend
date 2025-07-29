import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";
import {
  Calendar,
  MapPin,
  Users,
  LogOut,
  Ticket,
  Loader2,
  Search,
  TrendingUp,
  Edit,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import { useNavigate } from "react-router-dom";

interface Reservation {
  id: string;
  event: {
    id: string;
    name: string;
    description: string;
    eventDate: string;
    location: string;
    price?: number | null;
  };
  status: string;
  createdAt: string;
}

const Reservations = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [search, setSearch] = useState("");

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  // Buscar reservas
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const { data } = await api.get("/reservations/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Erro ao carregar suas reservas");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchReservations();
  }, [token]);

  // Cancelar reserva
  const handleCancel = async () => {
    if (!selected) return;
    try {
      await api.delete(`/reservations/${selected.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Reserva cancelada!");
      setReservations((prev) => prev.filter((r) => r.id !== selected.id));
      setSelected(null);
    } catch {
      toast.error("Erro ao cancelar a reserva.");
    }
  };

  // Estatísticas
  const total = reservations.length;
  const confirmadas = reservations.filter((r) => r.status === "CONFIRMED").length;
  const investido = reservations.reduce((acc, r) => acc + (r.event.price ?? 0), 0);

  // Filtro de busca
  const reservasFiltradas = reservations.filter((r) =>
    r.event.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        Carregando reservas...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white/10 backdrop-blur-lg border-r border-white/10 p-6 flex flex-col">
        <div className="flex items-center mb-10">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
            E
          </div>
          <h2 className="ml-3 text-lg font-bold">EventPro</h2>
        </div>
        <nav className="flex-1 space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-white/80 hover:bg-blue-600/20 rounded-xl"
            onClick={() => navigate("/events")}
          >
            Eventos
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/40 text-white rounded-xl shadow-md"
            onClick={() => navigate("/reservations")}
          >
            Minhas Reservas
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white/80 hover:bg-green-600/20 rounded-xl"
            onClick={() => navigate("/stats")}
          >
            Estatísticas
          </Button>
        </nav>
        <Button
          variant="ghost"
          className="mt-8 w-full justify-start text-red-400 hover:bg-red-500/20 rounded-xl"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          <LogOut className="w-5 h-5 mr-3" /> Sair
        </Button>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center px-8 py-6 border-b border-white/20 bg-white/10 backdrop-blur-md">
          <div>
            <h1 className="text-3xl font-bold">Minhas Reservas</h1>
            <p className="text-white/60">Gerencie suas reservas e eventos</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                placeholder="Buscar reserva..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl w-72"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 overflow-y-auto p-10 space-y-10">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-400/30 shadow-lg rounded-2xl hover:scale-[1.02] transition-transform">
              <CardContent className="p-8 text-center">
                <Ticket className="w-6 h-6 mx-auto text-purple-300 mb-3" />
                <p className="text-4xl font-bold">{total}</p>
                <p className="text-purple-200">Total de Reservas</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-400/30 shadow-lg rounded-2xl hover:scale-[1.02] transition-transform">
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-6 h-6 mx-auto text-blue-300 mb-3" />
                <p className="text-4xl font-bold">{confirmadas}</p>
                <p className="text-blue-200">Confirmadas</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-400/30 shadow-lg rounded-2xl hover:scale-[1.02] transition-transform">
              <CardContent className="p-8 text-center">
                <Users className="w-6 h-6 mx-auto text-green-300 mb-3" />
                <p className="text-4xl font-bold">R$ {investido.toFixed(2)}</p>
                <p className="text-green-200">Total Investido</p>
              </CardContent>
            </Card>
          </div>

          {/* Reservas */}
          {reservasFiltradas.length === 0 ? (
            <div className="text-center py-20">
              <Ticket className="w-12 h-12 mx-auto text-white/40 mb-6" />
              <h3 className="text-xl font-bold">Nenhuma reserva encontrada</h3>
              <Button
                className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg"
                onClick={() => navigate("/events")}
              >
                Explorar Eventos
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reservasFiltradas.map((res) => {
                const date = new Date(res.event.eventDate);
                return (
                  <Card
                    key={res.id}
                    className="bg-white/10 backdrop-blur-lg border-white/20 shadow-lg rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-transform"
                  >
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-bold">{res.event.name}</h3>
                      <p className="text-white/70">{res.event.description}</p>
                      <p className="flex items-center text-white/80">
                        <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                        {date.toLocaleDateString("pt-BR")} às{" "}
                        {date.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="flex items-center text-white/80">
                        <MapPin className="w-4 h-4 mr-2 text-green-400" />
                        {res.event.location}
                      </p>
                      <p className="flex items-center text-white/80">
                        <Users className="w-4 h-4 mr-2 text-purple-400" />
                        Status: {res.status}
                      </p>
                      <p className="text-amber-300 font-bold">
                        {res.event.price
                          ? `R$ ${res.event.price.toFixed(2)}`
                          : "Gratuito"}
                      </p>

                      <div className="flex gap-4 pt-4">
                        {/* Ver Ingresso */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl">
                              Ver Ingresso
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white/10 backdrop-blur-lg border-white/20 rounded-xl text-white p-6">
                            <DialogHeader>
                              <DialogTitle>Ingresso - {res.event.name}</DialogTitle>
                            </DialogHeader>
                            <p>
                              Data: {date.toLocaleDateString("pt-BR")} às{" "}
                              {date.toLocaleTimeString("pt-BR")}
                            </p>
                            <p>Local: {res.event.location}</p>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="secondary">Fechar</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Cancelar */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                              onClick={() => setSelected(res)}
                            >
                              Cancelar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white/10 backdrop-blur-lg border-white/20 rounded-xl text-white p-6">
                            <DialogHeader>
                              <DialogTitle>Cancelar Reserva</DialogTitle>
                            </DialogHeader>
                            <p>
                              Deseja realmente cancelar a reserva de{" "}
                              <span className="font-bold">{res.event.name}</span>?
                            </p>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="secondary">Voltar</Button>
                              </DialogClose>
                              <Button
                                className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                                onClick={handleCancel}
                              >
                                Confirmar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Editar Evento (apenas ADMIN) */}
                        {user?.role === "ADMIN" && (
                          <Button
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl"
                            onClick={() => navigate(`/events/edit/${res.event.id}`)}
                          >
                            <Edit className="w-4 h-4 mr-2" /> Editar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Reservations;
