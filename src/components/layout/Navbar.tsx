import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, CalendarCheck, LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 to-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <Link
          to="/dashboard"
          className="text-2xl font-bold tracking-wide hover:text-blue-200 transition-colors"
        >
          EventPro
        </Link>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2">
                <Avatar className="w-9 h-9 border-2 border-white/30 shadow-lg">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block font-medium">{user.name}</span>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link to="/reservations" className="flex items-center gap-2">
                  <CalendarCheck size={16} /> Minhas Reservas
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-400 hover:text-red-500"
              >
                <LogOut size={16} /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Navbar;
