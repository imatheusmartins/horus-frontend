import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { HttpErrorApi } from "@/infra/HttpErrorApi";
import { createExame } from "@/service/Exame";
import { getPaciente, type Paciente } from "@/service/Paciente";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import styles from "./styles.module.scss";

const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png"];

interface AnaliseNovaPageProps {
  pacienteId: string;
}

export default function AnaliseNovaPage({ pacienteId }: AnaliseNovaPageProps) {
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPaciente() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await getPaciente(pacienteId);

        if (isMounted) {
          setPaciente(data);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof HttpErrorApi) {
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

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file && !tiposPermitidos.includes(file.type)) {
      setImagem(null);
      setPreviewUrl("");
      setErrorMessage("Envie uma imagem JPG, JPEG ou PNG.");
      return;
    }

    setErrorMessage("");
    setImagem(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!imagem) {
      setErrorMessage("Selecione uma imagem para análise.");
      return;
    }

    if (!tiposPermitidos.includes(imagem.type)) {
      setErrorMessage("Envie uma imagem JPG, JPEG ou PNG.");
      return;
    }

    setIsSubmitting(true);

    try {
      const exame = await createExame(pacienteId, imagem);

      await navigate({
        to: "/exames/$exameId",
        params: { exameId: String(exame.id) },
      });
    } catch (error) {
      if (error instanceof HttpErrorApi) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível enviar a imagem para análise.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <Box className={styles.analiseNovaPage}>
        <Paper
          component="form"
          className={styles.analiseNovaPage__panel}
          onSubmit={handleSubmit}
        >
          <Typography component="h1" className={styles.analiseNovaPage__title}>
            Nova análise
          </Typography>
          <Typography className={styles.analiseNovaPage__text}>
            Envie uma imagem de retina vinculada ao paciente selecionado.
          </Typography>

          {isLoading ? (
            <Box className={styles.analiseNovaPage__feedback}>
              <CircularProgress size={28} />
              <Typography>Carregando paciente...</Typography>
            </Box>
          ) : null}

          {paciente ? (
            <Box className={styles.analiseNovaPage__patient}>
              <Typography component="h2">{paciente.nome}</Typography>
              <Typography>CPF: {paciente.cpf}</Typography>
            </Box>
          ) : null}

          <Box className={styles.analiseNovaPage__upload}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<Upload size={18} />}
              className={styles.analiseNovaPage__backButton}
            >
              Selecionar imagem
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageChange}
              />
            </Button>
            <Typography>
              {imagem ? imagem.name : "Nenhuma imagem selecionada"}
            </Typography>
          </Box>

          {previewUrl ? (
            <Box className={styles.analiseNovaPage__preview}>
              <Box component="img" src={previewUrl} alt="Prévia do exame" />
            </Box>
          ) : null}

          {isSubmitting ? (
            <Box className={styles.analiseNovaPage__feedback}>
              <CircularProgress size={28} />
              <Typography>
                Analisando imagem... Esse processo pode levar alguns segundos.
              </Typography>
            </Box>
          ) : null}

          {errorMessage ? (
            <Alert severity="error" className={styles.analiseNovaPage__alert}>
              {errorMessage}
            </Alert>
          ) : null}

          <Box className={styles.analiseNovaPage__actions}>
            <Button
              href={`/pacientes/${pacienteId}`}
              variant="outlined"
              className={styles.analiseNovaPage__backButton}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || isLoading}
              className={styles.analiseNovaPage__button}
            >
              {isSubmitting ? "Enviando..." : "Enviar para análise"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
