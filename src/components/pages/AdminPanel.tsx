import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
  BarChart3,
  Search,
  Filter,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,    
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  availableSpots: number;
  price: number;
  category: string;
  image: string;
  organizer: string;
}

interface Reservation {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  reservedAt: string;
  status: "confirmed" | "pending" | "cancelled";
}

const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    price: "",
    category: "",
    image: "",
    organizer: "Admin",
  });

  const token = localStorage.getItem("token");

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      date: "",
      time: "",
      location: "",
      capacity: "",
      price: "",
      category: "",
      image: "",
      organizer: "Admin",
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const eventRes = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!eventRes.ok) throw new Error("Erro ao carregar eventos");
      const eventsData = await eventRes.json();
      setEvents(eventsData);

      const resRes = await fetch(`${import.meta.env.VITE_API_URL}/reservations/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resRes.ok) throw new Error("Erro ao carregar reservas");
      const reservationsData = await resRes.json();
      setReservations(reservationsData);
    } catch (err: any) {
      toast.error(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          capacity: parseInt(formData.capacity) || 0,
          availableSpots: parseInt(formData.capacity) || 0,
          price: parseFloat(formData.price) || 0,
          image:
            formData.image ||
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar evento");

      toast.success("Evento criado com sucesso!");
      setIsCreateDialogOpen(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingEvent) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${editingEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          capacity: parseInt(formData.capacity) || editingEvent.capacity,
          price: parseFloat(formData.price) || editingEvent.price,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao atualizar evento");

      toast.success("Evento atualizado com sucesso!");
      setIsEditDialogOpen(false);
      setEditingEvent(null);
      resetForm();
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao deletar evento");

      toast.success("Evento deletado com sucesso!");
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getTotalRevenue = () => {
    return reservations.reduce((total, r) => {
      const event = events.find((e) => e.id === r.eventId);
      return total + (event ? event.price : 0);
    }, 0);
  };

  const getEventStats = () => {
    const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);
    const totalReserved = events.reduce((sum, e) => sum + (e.capacity - e.availableSpots), 0);
    return {
      totalEvents: events.length,
      totalReservations: reservations.length,
      totalRevenue: getTotalRevenue(),
      occupancyRate: totalCapacity > 0 ? ((totalReserved / totalCapacity) * 100).toFixed(1) : "0",
    };
  };

  const stats = getEventStats();

  if (loading) return <p className="text-center text-white">Carregando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-slate-400">Gerencie eventos e acompanhe reservas</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Evento</DialogTitle>
              <DialogDescription className="text-slate-400">
                Preencha as informações abaixo para criar um novo evento.
              </DialogDescription>
            </DialogHeader>
            {/* Reuso do formulário */}
            {/* Aqui você chamaria o mesmo EventForm que já tinha */}
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="events">Eventos ({events.length})</TabsTrigger>
          <TabsTrigger value="reservations">Reservas ({reservations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <p>Total de Eventos: {stats.totalEvents}</p>
              <p>Total de Reservas: {stats.totalReservations}</p>
              <p>Receita Total: R$ {stats.totalRevenue}</p>
              <p>Taxa de Ocupação: {stats.occupancyRate}%</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          {/* Tabela de eventos + botões de editar/deletar */}
        </TabsContent>

        <TabsContent value="reservations">
          {/* Tabela de reservas */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
