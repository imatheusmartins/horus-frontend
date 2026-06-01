import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { HttpErrorApi, HttpStatusCode } from "@/infra/HttpErrorApi";
import { deletePaciente, getPaciente, type Paciente } from "@/service/Paciente";
import { deleteExame, getExamesByPaciente, type Exame } from "@/service/Exame";
import { formatDate, formatDateTime, formatPercent } from "@/utils/formatters";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { Edit, Eye, FileImage, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

function getPredictionDescription(label?: string, description?: string) {
  if (description) {
    return description;
  }

  const descriptions: Record<string, string> = {
    "0": "Sem retinopatia diabética",
    "1": "Retinopatia leve",
    "2": "Retinopatia moderada",
    "3": "Retinopatia grave",
    "4": "Retinopatia diabética proliferativa",
  };

  return label ? descriptions[label] : undefined;
}

interface PacienteDetalhesPageProps {
  pacienteId: string;
}

export default function PacienteDetalhesPage({
  pacienteId,
}: PacienteDetalhesPageProps) {
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [exames, setExames] = useState<Exame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPaciente() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [pacienteData, examesData] = await Promise.all([
          getPaciente(pacienteId),
          getExamesByPaciente(pacienteId),
        ]);

        if (isMounted) {
          setPaciente(pacienteData);
          setExames(examesData);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (
          error instanceof HttpErrorApi &&
          error.statusCode === HttpStatusCode.NOT_FOUND
        ) {
          setErrorMessage("Paciente não encontrado.");
        } else if (error instanceof HttpErrorApi) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Não foi possível carregar o paciente.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPaciente();

    return () => {
      isMounted = false;
    };
  }, [pacienteId]);

  async function handleDeletePaciente() {
    const confirmed = window.confirm(
      "Deseja remover este paciente? Esta ação não pode ser desfeita.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePaciente(pacienteId);
      await navigate({ to: "/pacientes" });
    } catch (error) {
      if (error instanceof HttpErrorApi) {
        setActionError(error.message);
      } else {
        setActionError("Não foi possível remover o paciente.");
      }
    }
  }

  async function handleDeleteExame(exameId: number) {
    const confirmed = window.confirm("Deseja remover este exame?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteExame(exameId);
      setExames((current) => current.filter((exame) => exame.id !== exameId));
    } catch (error) {
      if (error instanceof HttpErrorApi) {
        setActionError(error.message);
      } else {
        setActionError("Não foi possível remover o exame.");
      }
    }
  }

  return (
    <DashboardLayout>
      <Box className={styles.pacienteDetalhesPage}>
        <Box className={styles.pacienteDetalhesPage__header}>
          <Box>
            <Typography component="h1" className={styles.pacienteDetalhesPage__title}>
              Detalhes do paciente
            </Typography>
            <Typography className={styles.pacienteDetalhesPage__subtitle}>
              Consulte os dados do paciente e acompanhe suas análises.
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/pacientes"
            variant="outlined"
            className={styles.pacienteDetalhesPage__secondaryButton}
          >
            Voltar
          </Button>
        </Box>

        {isLoading ? (
          <Box className={styles.pacienteDetalhesPage__feedback}>
            <CircularProgress size={32} />
            <Typography>Carregando paciente...</Typography>
          </Box>
        ) : null}

        {!isLoading && errorMessage ? (
          <Alert severity="error">{errorMessage}</Alert>
        ) : null}

        {!isLoading && !errorMessage && paciente ? (
          <>
            {actionError ? <Alert severity="error">{actionError}</Alert> : null}

            <Paper className={styles.pacienteDetalhesPage__panel}>
              <Box className={styles.pacienteDetalhesPage__panelHeader}>
                <Box>
                  <Typography component="h2">{paciente.nome}</Typography>
                  <Typography>CPF: {paciente.cpf}</Typography>
                  <Typography>
                    Data de nascimento: {formatDate(paciente.dataNascimento)}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Button
                    href={`/pacientes/${pacienteId}/editar`}
                    variant="outlined"
                    startIcon={<Edit size={18} />}
                    className={styles.pacienteDetalhesPage__secondaryButton}
                  >
                    Editar
                  </Button>
                  <Button
                    color="error"
                    variant="outlined"
                    startIcon={<Trash2 size={18} />}
                    onClick={handleDeletePaciente}
                    className={styles.pacienteDetalhesPage__dangerButton}
                  >
                    Excluir
                  </Button>
                </Stack>
              </Box>
            </Paper>

            <Box className={styles.pacienteDetalhesPage__sectionHeader}>
              <Box>
                <Typography component="h2">Exames e análises</Typography>
                <Typography>
                  Histórico de imagens enviadas para avaliação da IA.
                </Typography>
              </Box>
              <Button
                href={`/pacientes/${pacienteId}/analises/nova`}
                variant="contained"
                startIcon={<Plus size={18} />}
                className={styles.pacienteDetalhesPage__primaryButton}
              >
                Nova análise
              </Button>
            </Box>

            {exames.length === 0 ? (
              <Paper className={styles.pacienteDetalhesPage__emptyState}>
                <FileImage size={28} />
                <Typography component="h3">Nenhum exame cadastrado</Typography>
                <Typography>
                  Envie uma imagem de retina para visualizar o resultado da IA.
                </Typography>
              </Paper>
            ) : (
              <Box className={styles.pacienteDetalhesPage__examList}>
                {exames.map((exame) => (
                  <Paper key={exame.id} className={styles.pacienteDetalhesPage__examItem}>
                    <Box>
                      {(() => {
                        const topPrediction = exame.analiseIA?.top_prediction;
                        const description = getPredictionDescription(
                          topPrediction?.label,
                          topPrediction?.descricao ?? topPrediction?.description,
                        );

                        return (
                          <>
                      <Typography component="h3">
                        Exame #{exame.id}
                      </Typography>
                      <Typography>{formatDateTime(exame.dataExame)}</Typography>
                      <Typography>
                        Resultado principal:{" "}
                              {description ?? topPrediction?.label ?? "Não informado"}
                        {" - "}
                              {formatPercent(topPrediction?.confidence)}
                      </Typography>
                          </>
                        );
                      })()}
                    </Box>
                    <Divider flexItem />
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                      <Button
                        href={`/exames/${exame.id}`}
                        variant="contained"
                        startIcon={<Eye size={18} />}
                        className={styles.pacienteDetalhesPage__primaryButton}
                      >
                        Ver resultado
                      </Button>
                      <Button
                        color="error"
                        variant="outlined"
                        startIcon={<Trash2 size={18} />}
                        onClick={() => void handleDeleteExame(exame.id)}
                        className={styles.pacienteDetalhesPage__dangerButton}
                      >
                        Excluir
                      </Button>
                    </Stack>
                  </Paper>
                ))}
              </Box>
            )}
          </>
        ) : null}
      </Box>
    </DashboardLayout>
  );
}
