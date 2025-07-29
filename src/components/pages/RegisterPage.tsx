import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Mail, Lock, User, Loader2 } from "lucide-react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const apiUrl =
    import.meta.env.VITE_API_URL || "https://eventpro-backend-yzlq.onrender.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Nome, email e senha são obrigatórios");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }), // agora envia name também
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao registrar");

      toast.success("Conta criada com sucesso! Faça login.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-3xl font-bold shadow-lg">
            E
          </div>
          <h1 className="text-3xl font-bold text-white mt-4">Criar Conta</h1>
          <p className="text-white/70 text-sm mt-2">
            Preencha os campos abaixo para se registrar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nome */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <Input
              type="text"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl focus:bg-white/15"
            />
          </div>

          {/* Campo Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl focus:bg-white/15"
            />
          </div>

          {/* Campo Senha */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <Input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl focus:bg-white/15"
            />
          </div>

          {/* Campo Confirmar Senha */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <Input
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl focus:bg-white/15"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
            {loading ? "Criando conta..." : "Registrar"}
          </Button>
        </form>

        <p className="text-center text-sm text-white/60 mt-6">
          Já tem uma conta?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium"
          >
            Faça login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
