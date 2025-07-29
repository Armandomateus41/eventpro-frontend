import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthAPI } from "../../lib/api";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, Lock, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await AuthAPI.login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error("Credenciais inválidas. Verifique e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute w-[600px] h-[600px] bg-blue-700/30 rounded-full blur-3xl top-[-150px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-purple-700/30 rounded-full blur-3xl bottom-[-150px] right-[-150px]" />

      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl relative z-10 rounded-2xl">
        <CardContent className="p-10">
          {/* Logo ou Título */}
          <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            Bem-vindo de volta
          </h1>
          <p className="text-center text-white/70 mb-8">
            Acesse sua conta para explorar os melhores eventos.
          </p>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Campo Email */}
            <div>
              <Label htmlFor="email" className="text-white font-medium">
                E-mail
              </Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-white/10 border border-white/30 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-400/70 transition-all rounded-xl"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <Label htmlFor="password" className="text-white font-medium">
                Senha
              </Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-white/10 border border-white/30 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400/70 transition-all rounded-xl"
                />
              </div>
            </div>

            {/* Botão Login */}
            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold text-lg rounded-xl shadow-lg transform transition-all hover:scale-[1.02] flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Link Cadastro */}
          <p className="mt-8 text-center text-sm text-white/70">
            Não tem uma conta?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-400 hover:text-blue-300 cursor-pointer font-semibold transition"
            >
              Cadastre-se
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
