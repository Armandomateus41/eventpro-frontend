import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Calendar, MapPin, Users, Link2, FileText, Loader2 } from "lucide-react";

const CreateEventPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [onlineLink, setOnlineLink] = useState("");
  const [maxCapacity, setMaxCapacity] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const apiUrl =
    import.meta.env.VITE_API_URL || "https://eventpro-backend-yzlq.onrender.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !eventDate || !location || !maxCapacity) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          eventDate,
          location,
          onlineLink,
          maxCapacity: Number(maxCapacity),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar evento");

      toast.success("Evento criado com sucesso!");
      navigate("/events");
    } catch (err: any) {
      toast.error(err.message || "Falha ao criar evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-2xl p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Criar Novo Evento
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome do evento */}
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <Input
              type="text"
              placeholder="Nome do evento"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl focus:bg-white/15"
              required
            />
          </div>

          {/* Descrição */}
          <div className="relative">
            <Textarea
              placeholder="Descrição do evento"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl focus:bg-white/15 min-h-[100px]"
              required
            />
          </div>

          {/* Data e Hora */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <Input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl focus:bg-white/15"
              required
            />
          </div>

          {/* Local */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <Input
              type="text"
              placeholder="Local do evento"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl focus:bg-white/15"
              required
            />
          </div>

          {/* Link Online */}
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <Input
              type="url"
              placeholder="Link para acesso online (opcional)"
              value={onlineLink}
              onChange={(e) => setOnlineLink(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl focus:bg-white/15"
            />
          </div>

          {/* Capacidade Máxima */}
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <Input
              type="number"
              placeholder="Capacidade máxima"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value ? Number(e.target.value) : "")}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl focus:bg-white/15"
              required
            />
          </div>

          {/* Botão */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
            {loading ? "Criando evento..." : "Cadastrar Evento"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
