import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateRoute from "./components/ProtectedRoute";

// Lazy loading das páginas
const Login = lazy(() => import("./components/pages/Login"));
const RegisterPage = lazy(() => import("./components/pages/RegisterPage"));
const Dashboard = lazy(() => import("./components/pages/Dashboard"));
const Reservations = lazy(() => import("./components/pages/Reservations"));
const EventsPage = lazy(() => import("./components/pages/EventsPage"));
const CreateEventPage = lazy(
  () => import("./components/pages/CreateEventPage")
);
import EditEventPage from "./components/pages/EditEventPage";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-900 to-blue-950 text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-400"></div>
          </div>
        }
      >
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/reservations"
            element={
              <PrivateRoute>
                <Reservations />
              </PrivateRoute>
            }
          />

          <Route
            path="/events"
            element={
              <PrivateRoute>
                <EventsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/create-event"
            element={
              <PrivateRoute>
                <CreateEventPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/events/edit/:id"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <EditEventPage />
              </PrivateRoute>
            }
          />

          {/* Fallback para rotas não encontradas */}
          <Route
            path="*"
            element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
