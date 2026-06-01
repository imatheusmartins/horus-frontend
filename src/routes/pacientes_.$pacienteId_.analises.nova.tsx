import AnaliseNovaPage from "@/pages/AnaliseNova";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pacientes_/$pacienteId_/analises/nova")({
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { pacienteId } = Route.useParams();

  return <AnaliseNovaPage pacienteId={pacienteId} />;
}

