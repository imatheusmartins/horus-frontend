import ExameDetalhesPage from "@/pages/ExameDetalhes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/exames/$exameId")({
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { exameId } = Route.useParams();

  return <ExameDetalhesPage exameId={exameId} />;
}

