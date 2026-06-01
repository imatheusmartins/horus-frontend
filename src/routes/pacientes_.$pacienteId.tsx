import PacienteDetalhesPage from "@/pages/PacienteDetalhes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pacientes_/$pacienteId")({
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { pacienteId } = Route.useParams();

  return <PacienteDetalhesPage pacienteId={pacienteId} />;
}

