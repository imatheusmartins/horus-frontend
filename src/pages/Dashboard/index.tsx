import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { HttpErrorApi, HttpStatusCode } from "@/infra/HttpErrorApi";
import { getExamesByPaciente, type Exame } from "@/service/Exame";
import { getPacientesByUsuario, type Paciente } from "@/service/Paciente";
import { formatDateTime, formatPercent } from "@/utils/formatters";
import { getAuthUser, getAuthUserId } from "@/utils/session";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { Activity, ArrowRight, Clock, FileImage, Plus, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";

interface ExamWithPatient extends Exame {
  pacienteNome?: string;
}

function getPredictionDescription(exame?: Exame) {
  const topPrediction = exame?.analiseIA?.top_prediction;

  if (!topPrediction) {
    return "Sem resultado";
  }

  const descriptions: Record<string, string> = {
    "0": "Sem retinopatia diabética",
    "1": "Retinopatia leve",
    "2": "Retinopatia moderada",
    "3": "Retinopatia grave",
    "4": "Retinopatia diabética proliferativa",
  };

  return (
    topPrediction.descricao ??
    topPrediction.description ??
    descriptions[topPrediction.label] ??
    topPrediction.label
  );
}

function getMostRecentExam(exames: ExamWithPatient[]) {
  return [...exames].sort(
    (a, b) =>
      new Date(b.dataExame).getTime() - new Date(a.dataExame).getTime(),
  )[0];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const authUser = useMemo(() => getAuthUser(), []);
  const authUserId = useMemo(() => getAuthUserId(authUser), [authUser]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [exames, setExames] = useState<ExamWithPatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!authUserId) {
      setIsLoading(false);
      void navigate({ to: "/login" });
      return;
    }

    const usuarioId = authUserId;
    let isMounted = true;

    async function loadDashboard() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const pacientesData = await getPacientesByUsuario(usuarioId);

        const examesPorPaciente = await Promise.all(
          pacientesData.map(async (paciente) => {
            try {
              const examesData = await getExamesByPaciente(paciente.id);
              return examesData.map((exame) => ({
                ...exame,
                pacienteNome: paciente.nome,
              }));
            } catch {
              return [];
            }
          }),
        );

        if (isMounted) {
          setPacientes(pacientesData);
          setExames(examesPorPaciente.flat());
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (
          error instanceof HttpErrorApi &&
          error.statusCode === HttpStatusCode.NOT_FOUND
        ) {
          setPacientes([]);
          setExames([]);
        } else if (error instanceof HttpErrorApi) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Não foi possível carregar o resumo da aplicação.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [authUserId, navigate]);

  const ultimoExame = getMostRecentExam(exames);
  const confiancaUltimoExame =
    ultimoExame?.analiseIA?.top_prediction?.confidence;

  return (
    <DashboardLayout>
      <Box className={styles.dashboardPage}>
        <Box className={styles.dashboardPage__header}>
          <Box>
            <Typography component="h1" className={styles.dashboardPage__title}>
              Visão geral
            </Typography>
            <Typography className={styles.dashboardPage__subtitle}>
              Acompanhe pacientes, exames e resultados gerados pela IA.
            </Typography>
          </Box>

          <Box className={styles.dashboardPage__actions}>
            <Button
              component={Link}
              to="/pacientes/novo"
              variant="contained"
              startIcon={<Plus size={18} />}
              className={styles.dashboardPage__primaryButton}
            >
              Novo paciente
            </Button>
            <Button
              component={Link}
              to="/pacientes"
              variant="outlined"
              endIcon={<ArrowRight size={18} />}
              className={styles.dashboardPage__secondaryButton}
            >
              Ver pacientes
            </Button>
          </Box>
        </Box>

        {isLoading ? (
          <Box className={styles.dashboardPage__feedback}>
            <CircularProgress size={32} />
            <Typography>Carregando resumo...</Typography>
          </Box>
        ) : null}

        {!isLoading && errorMessage ? (
          <Alert severity="error">{errorMessage}</Alert>
        ) : null}

        {!isLoading && !errorMessage ? (
          <>
            <Box className={styles.dashboardPage__metrics}>
              <Paper className={styles.dashboardPage__metric}>
                <Users size={24} />
                <Typography component="strong">{pacientes.length}</Typography>
                <Typography>Pacientes cadastrados</Typography>
              </Paper>

              <Paper className={styles.dashboardPage__metric}>
                <FileImage size={24} />
                <Typography component="strong">{exames.length}</Typography>
                <Typography>Analises realizadas</Typography>
              </Paper>

              <Paper className={styles.dashboardPage__metric}>
                <Activity size={24} />
                <Typography component="strong">
                  {ultimoExame ? getPredictionDescription(ultimoExame) : "-"}
                </Typography>
                <Typography>Último resultado</Typography>
              </Paper>

              <Paper className={styles.dashboardPage__metric}>
                <Clock size={24} />
                <Typography component="strong">
                  {ultimoExame ? formatDateTime(ultimoExame.dataExame) : "-"}
                </Typography>
                <Typography>Última análise</Typography>
              </Paper>
            </Box>

            <Box className={styles.dashboardPage__contentGrid}>
              <Paper className={styles.dashboardPage__panel}>
                <Typography component="h2">Fluxo de demonstração</Typography>
                <Box className={styles.dashboardPage__steps}>
                  <Box>
                    <Typography component="strong">1. Paciente</Typography>
                    <Typography>Cadastre ou selecione um paciente.</Typography>
                  </Box>
                  <Box>
                    <Typography component="strong">2. Imagem</Typography>
                    <Typography>Envie uma imagem de retina para análise.</Typography>
                  </Box>
                  <Box>
                    <Typography component="strong">3. Resultado</Typography>
                    <Typography>Consulte a classificação retornada pela IA.</Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper className={styles.dashboardPage__panel}>
                <Typography component="h2">Último exame</Typography>

                {ultimoExame ? (
                  <Box className={styles.dashboardPage__lastExam}>
                    <Typography component="strong">
                      {ultimoExame.pacienteNome ?? ultimoExame.nomePaciente ?? "Paciente"}
                    </Typography>
                    <Typography>{formatDateTime(ultimoExame.dataExame)}</Typography>
                    <Typography>
                      Resultado: {getPredictionDescription(ultimoExame)}
                    </Typography>
                    <Typography>
                      Confiança: {formatPercent(confiancaUltimoExame)}
                    </Typography>
                    <Button
                      href={`/exames/${ultimoExame.id}`}
                      variant="contained"
                      className={styles.dashboardPage__primaryButton}
                    >
                      Ver resultado
                    </Button>
                  </Box>
                ) : (
                  <Box className={styles.dashboardPage__emptyState}>
                    <Typography component="strong">Nenhuma análise registrada</Typography>
                    <Typography>
                      Após enviar a primeira imagem, o resultado mais recente
                      aparecerá aqui.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>

            <Alert severity="info">
              Resultados de IA neste protótipo são voltados para fins
              acadêmicos e tem como objetivo auxiliar na tomada de decisão clínica.
            </Alert>
          </>
        ) : null}
      </Box>
    </DashboardLayout>
  );
}
