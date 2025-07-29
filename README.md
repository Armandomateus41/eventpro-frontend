# EventPro Frontend  

Aplicação web desenvolvida em **React + Vite + TypeScript** para gerenciamento de eventos e reservas. Este projeto faz parte da solução **EventPro**, que inclui autenticação, sistema de reservas, painel administrativo e interface moderna.  

##  Visão Geral  

O **EventPro Frontend** permite que usuários:  
- Criem e gerenciem suas contas.  
- Visualizem eventos disponíveis.  
- Reservem vagas em eventos.  
- Consultem e cancelem suas reservas.  

E que administradores:  
- Criem novos eventos.  
- Atualizem e editem eventos existentes.  
- Excluam eventos.  
- Consultem estatísticas sobre reservas.  

A aplicação é **100% responsiva**, possui **autenticação JWT** e segue boas práticas de arquitetura, escalabilidade e usabilidade.  

---

##  Funcionalidades  

### Usuário (USER)  
- Registro e login.  
- Visualização de eventos.  
- Filtros de busca (por categoria e data).  
- Reserva de eventos.  
- Cancelamento de reservas.  
- Consulta de histórico de reservas.  

### Administrador (ADMIN)  
- Todas as funcionalidades de usuário.  
- Criação de eventos.  
- Edição de eventos.  
- Exclusão de eventos.  
- Acesso a estatísticas do sistema.  

---

##  Tecnologias Utilizadas  

- **React 18 + Vite + TypeScript** – Frontend SPA.  
- **TailwindCSS + shadcn/ui** – Estilização e UI responsiva.  
- **React Router DOM** – Gerenciamento de rotas.  
- **Lucide React** – Ícones modernos.  
- **Sonner** – Toasts de feedback.  
- **Radix UI (Dialog)** – Componentes de modal acessíveis.  
- **Context + Hooks personalizados** – Gerenciamento de autenticação e chamadas API.  
- **JWT (via backend)** – Autenticação segura.  

---