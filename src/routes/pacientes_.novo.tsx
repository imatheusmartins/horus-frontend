import PacienteNovoPage from "@/pages/PacienteNovo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pacientes_/novo")({
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  return <PacienteNovoPage />;
}
