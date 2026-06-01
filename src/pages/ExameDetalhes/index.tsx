import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { HttpErrorApi } from "@/infra/HttpErrorApi";
import { getExame, type Exame } from "@/service/Exame";
import { formatDateTime, formatPercent } from "@/utils/formatters";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

function resolveImageUrl(url?: string) {
  if (!url) {
    return "";
  }

  if (/^(https?:|data:|blob:)/.test(url)) {
    return url;
  }

  return `${apiBaseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

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

interface ExameDetalhesPageProps {
  exameId: string;
}

export default function ExameDetalhesPage({ exameId }: ExameDetalhesPageProps) {
  const [exame, setExame] = useState<Exame | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadExame() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await getExame(exameId);

        if (isMounted) {
          setExame(data);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof HttpErrorApi) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Não foi possível carregar o exame.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadExame();

    return () => {
      isMounted = false;
    };
  }, [exameId]);

  const originalUrl = resolveImageUrl(exame?.urlImagemOriginal);
  const annotatedUrl = resolveImageUrl(exame?.urlImagemAnotada);
  const predictions = exame?.analiseIA?.predictions ?? [];
  const detections = exame?.analiseIA?.detections ?? [];
  const topPrediction = exame?.analiseIA?.top_prediction;
  const topDescription = getPredictionDescription(
    topPrediction?.label,
    topPrediction?.descricao ?? topPrediction?.description,
  );

  return (
    <DashboardLayout>
      <Box className={styles.exameDetalhesPage}>
        <Box className={styles.exameDetalhesPage__header}>
          <Box>
            <Typography component="h1" className={styles.exameDetalhesPage__title}>
              Resultado da análise
            </Typography>
            <Typography className={styles.exameDetalhesPage__subtitle}>
              Imagens do exame, predicoes e possiveis deteccoes da IA.
            </Typography>
          </Box>

          {exame ? (
            <Button
              href={`/pacientes/${exame.pacienteId}`}
              variant="outlined"
              className={styles.exameDetalhesPage__secondaryButton}
            >
              Voltar ao paciente
            </Button>
          ) : null}
        </Box>

        {isLoading ? (
          <Box className={styles.exameDetalhesPage__feedback}>
            <CircularProgress size={32} />
            <Typography>Carregando resultado...</Typography>
          </Box>
        ) : null}

        {!isLoading && errorMessage ? (
          <Alert severity="error">{errorMessage}</Alert>
        ) : null}

        {!isLoading && !errorMessage && exame ? (
          <>
            <Paper className={styles.exameDetalhesPage__summary}>
              <Box>
                <Typography component="h2">
                  {exame.nomePaciente ?? "Paciente"}
                </Typography>
                <Typography>Exame #{exame.id}</Typography>
                <Typography>{formatDateTime(exame.dataExame)}</Typography>
              </Box>
              <Box className={styles.exameDetalhesPage__highlight}>
                <Typography>Resultado principal</Typography>
                <Typography component="strong">
                  {topPrediction?.label ?? "Não informado"}
                </Typography>
                {topDescription ? <Typography>{topDescription}</Typography> : null}
                <Typography>{formatPercent(topPrediction?.confidence)}</Typography>
              </Box>
            </Paper>

            <Box className={styles.exameDetalhesPage__images}>
              <Paper className={styles.exameDetalhesPage__imagePanel}>
                <Typography component="h2">Imagem original</Typography>
                {originalUrl ? (
                  <Box component="img" src={originalUrl} alt="Imagem original do exame" />
                ) : (
                  <Typography>Imagem original não disponível.</Typography>
                )}
              </Paper>

              <Paper className={styles.exameDetalhesPage__imagePanel}>
                <Typography component="h2">Imagem anotada</Typography>
                {annotatedUrl ? (
                  <Box component="img" src={annotatedUrl} alt="Imagem anotada pela IA" />
                ) : (
                  <Typography>Imagem anotada não disponível.</Typography>
                )}
              </Paper>
            </Box>

            <Paper className={styles.exameDetalhesPage__panel}>
              <Typography component="h2">Predicoes</Typography>
              {predictions.length === 0 ? (
                <Typography>Nenhuma predição retornada pela IA.</Typography>
              ) : (
                <Box className={styles.exameDetalhesPage__list}>
                  {predictions.map((prediction, index) => (
                    <Box key={`${prediction.label}-${index}`} className={styles.exameDetalhesPage__row}>
                      <Box>
                        <Typography component="h3">{prediction.label}</Typography>
                        <Typography>
                          {getPredictionDescription(
                            prediction.label,
                            prediction.descricao ?? prediction.description,
                          ) ?? "Descrição não informada"}
                        </Typography>
                        <Typography>{formatPercent(prediction.confidence)}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(prediction.confidence * 100, 100)}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>

            <Paper className={styles.exameDetalhesPage__panel}>
              <Typography component="h2">Deteccoes</Typography>
              {detections.length === 0 ? (
                <Typography>Nenhuma detecção retornada pela IA.</Typography>
              ) : (
                <Box className={styles.exameDetalhesPage__list}>
                  {detections.map((detection, index) => (
                    <Box key={`${detection.label}-${index}`} className={styles.exameDetalhesPage__detection}>
                      <Box>
                        <Typography component="h3">{detection.label}</Typography>
                        <Typography>
                          Confiança: {formatPercent(detection.confidence)}
                        </Typography>
                      </Box>
                      {detection.bbox ? (
                        <>
                          <Divider />
                          <Typography>
                            Area: x1 {detection.bbox.x1}, y1 {detection.bbox.y1},
                            x2 {detection.bbox.x2}, y2 {detection.bbox.y2}
                          </Typography>
                        </>
                      ) : null}
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>

            <Alert severity="info">
              Resultado gerado por modelo de IA para fins acadêmicos. Não
              substitui avaliação médica.
            </Alert>
          </>
        ) : null}
      </Box>
    </DashboardLayout>
  );
}
