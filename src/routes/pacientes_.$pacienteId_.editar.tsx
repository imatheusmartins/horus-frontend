import PacienteEditarPage from "@/pages/PacienteEditar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pacientes_/$pacienteId_/editar")({
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { pacienteId } = Route.useParams();

  return <PacienteEditarPage pacienteId={pacienteId} />;
}

