import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { Loader2 } from "lucide-react";

const EditEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [maxCapacity, setMaxCapacity] = useState<number>(0);
  const [onlineLink, setOnlineLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(data.name);
        setDescription(data.description);
        setEventDate(data.eventDate.split("T")[0]);
        setLocation(data.location);
        setMaxCapacity(data.maxCapacity);
        setOnlineLink(data.onlineLink || "");
      } catch {
        toast.error("Erro ao carregar dados do evento");
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id, token, navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(
        `/events/${id}`,
        { name, description, eventDate, location, maxCapacity, onlineLink },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Evento atualizado com sucesso!");
      navigate("/events");
    } catch {
      toast.error("Erro ao atualizar evento.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        Carregando evento...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Editar Evento</h1>
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-white/80 mb-1">Nome</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Descrição</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Data</label>
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Local</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Capacidade Máxima</label>
              <Input
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value))}
                required
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-1">Link Online</label>
              <Input
                value={onlineLink}
                onChange={(e) => setOnlineLink(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <Button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl"
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditEventPage;
