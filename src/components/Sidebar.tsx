import React, { useEffect, useState } from 'react';
import { Calendar, Settings, Home, BarChart3, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';
import { toast } from 'sonner';

interface SidebarProps {
  currentPage: 'dashboard' | 'event-details' | 'reservations' | 'admin';
  onNavigate: (page: 'dashboard' | 'event-details' | 'reservations' | 'admin') => void;
  userRole: 'user' | 'admin';
}

const Sidebar = ({ currentPage, onNavigate, userRole }: SidebarProps) => {
  const [stats, setStats] = useState({
    activeEvents: 0,
    totalReservations: 0,
    occupancyRate: 0,
  });
  const [myReservations, setMyReservations] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Buscar eventos
        const resEvents = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resEvents.ok) throw new Error('Erro ao carregar eventos');
        const events = await resEvents.json();

        // Buscar reservas do usuário
        const resReservations = await fetch(`${import.meta.env.VITE_API_URL}/reservations/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resReservations.ok) throw new Error('Erro ao carregar reservas');
        const reservations = await resReservations.json();

        // Estatísticas
        const totalCapacity = events.reduce((sum: number, e: any) => sum + e.capacity, 0);
        const totalReserved = events.reduce(
          (sum: number, e: any) => sum + (e.capacity - e.availableSpots),
          0
        );

        setStats({
          activeEvents: events.length,
          totalReservations: reservations.length,
          occupancyRate: totalCapacity > 0 ? Math.round((totalReserved / totalCapacity) * 100) : 0,
        });

        setMyReservations(reservations.length);
      } catch (error: any) {
        toast.error(error.message || 'Erro ao carregar estatísticas');
      }
    };

    fetchStats();
  }, []);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Eventos',
      icon: Home,
      description: 'Descobrir eventos',
    },
    {
      id: 'reservations',
      label: 'Reservas',
      icon: Calendar,
      description: 'Minhas reservas',
      badge: myReservations > 0 ? String(myReservations) : undefined,
    },
  ];

  const adminItems = [
    {
      id: 'admin',
      label: 'Painel Admin',
      icon: Settings,
      description: 'Gerenciar eventos',
    },
  ];

  const quickActions = [
    {
      label: 'Novo Evento',
      icon: Plus,
      action: () => onNavigate('admin'),
      adminOnly: true,
    },
    {
      label: 'Relatórios',
      icon: BarChart3,
      action: () => onNavigate('admin'),
      adminOnly: true,
    },
  ];

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/10 backdrop-blur-md border-r border-white/20 shadow-xl">
      <div className="p-6">
        {/* Main Navigation */}
        <nav className="space-y-2">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
              Navegação
            </h2>
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  'w-full justify-start h-auto p-4 text-left rounded-xl transition-all duration-200',
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-400/30 shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
                onClick={() => onNavigate(item.id as any)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-500/20 text-blue-300 text-xs rounded-full"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-white/60 mt-0.5">{item.description}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {/* Admin Section */}
          {userRole === 'admin' && (
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
                Administração
              </h2>
              {adminItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    'w-full justify-start h-auto p-4 text-left rounded-xl transition-all duration-200',
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-400/30 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                  onClick={() => onNavigate(item.id as any)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{item.label}</span>
                      <p className="text-xs text-white/60 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {userRole === 'admin' && (
            <div className="pt-6 border-t border-white/20">
              <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
                Ações Rápidas
              </h2>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    size="sm"
                    className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-xl shadow-lg"
                    onClick={action.action}
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Statistics */}
        <div className="mt-8 p-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
          <h3 className="text-sm font-medium text-white mb-3">Estatísticas</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-white/80">
              <span>Eventos Ativos</span>
              <span className="text-emerald-400 font-medium">{stats.activeEvents}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Total Reservas</span>
              <span className="text-blue-400 font-medium">{stats.totalReservations}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Taxa Ocupação</span>
              <span className="text-purple-400 font-medium">{stats.occupancyRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
