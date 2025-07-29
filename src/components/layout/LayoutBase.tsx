import { ReactNode } from "react";
import { Button } from "../ui/button";
import { LogOut, Calendar, Users, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  user?: { name?: string };
}

const LayoutBase = ({ children, title, subtitle, user }: LayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white/10 backdrop-blur-md border-r border-white/20 p-6 flex flex-col">
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
            E
          </div>
          <h2 className="ml-3 text-xl font-bold">EventPro</h2>
        </div>

        <nav className="flex-1 space-y-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-blue-600/30"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Button>
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
            <Users className="w-5 h-5 mr-3" /> Minhas Reservas
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-blue-600/30"
            onClick={() => navigate("/stats")}
          >
            <BarChart3 className="w-5 h-5 mr-3" /> Estatísticas
          </Button>
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

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-8 py-4 border-b border-white/20 bg-white/10 backdrop-blur-md">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-white/60 text-sm">{subtitle}</p>}
          </div>
          <div className="flex items-center space-x-4">
            <span>{user?.name || "Usuário"}</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
};

export default LayoutBase;
