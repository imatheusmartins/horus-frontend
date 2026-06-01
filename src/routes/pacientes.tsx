import PacientesPage from "@/pages/Pacientes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pacientes")({
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  return <PacientesPage />;
}
