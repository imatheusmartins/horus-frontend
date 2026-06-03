import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { HttpErrorApi } from "@/infra/HttpErrorApi";
import { getPaciente, updatePaciente } from "@/service/Paciente";
import { formatCpf, onlyNumbers } from "@/utils/formatters";
import { getAuthUser, getAuthUserId } from "@/utils/session";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import styles from "./styles.module.scss";

interface PacienteEditarPageProps {
  pacienteId: string;
}

export default function PacienteEditarPage({
  pacienteId,
}: PacienteEditarPageProps) {
  const navigate = useNavigate();
  const authUser = useMemo(() => getAuthUser(), []);
  const authUserId = useMemo(() => getAuthUserId(authUser), [authUser]);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPaciente() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const paciente = await getPaciente(pacienteId);

        if (isMounted) {
          setNome(paciente.nome);
          setCpf(formatCpf(paciente.cpf));
          setDataNascimento(paciente.dataNascimento);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!authUserId) {
      setErrorMessage("Faça login para editar um paciente.");
      return;
    }

    if (!nome.trim() || !cpf.trim() || !dataNascimento) {
      setErrorMessage("Preencha nome, CPF e data de nascimento.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updatePaciente(pacienteId, {
        nome: nome.trim(),
        cpf: onlyNumbers(cpf),
        dataNascimento,
        usuarioId: authUserId,
      });

      await navigate({
        to: "/pacientes/$pacienteId",
        params: { pacienteId },
      });
    } catch (error) {
      if (error instanceof HttpErrorApi) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível atualizar o paciente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <Box className={styles.pacienteEditarPage}>
        <Paper
          component="form"
          className={styles.pacienteEditarPage__panel}
          onSubmit={handleSubmit}
        >
          <Typography component="h1" className={styles.pacienteEditarPage__title}>
            Editar paciente
          </Typography>
          <Typography className={styles.pacienteEditarPage__text}>
            Atualize os dados cadastrais do paciente.
          </Typography>

          {isLoading ? (
            <Box className={styles.pacienteEditarPage__feedback}>
              <CircularProgress size={28} />
              <Typography>Carregando paciente...</Typography>
            </Box>
          ) : (
            <Box className={styles.pacienteEditarPage__fields}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="paciente-nome">Nome</InputLabel>
                <OutlinedInput
                  id="paciente-nome"
                  label="Nome"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                />
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel htmlFor="paciente-cpf">CPF</InputLabel>
                <OutlinedInput
                  id="paciente-cpf"
                  label="CPF"
                  inputProps={{ maxLength: 14 }}
                  value={cpf}
                  onChange={(event) => setCpf(formatCpf(event.target.value))}
                />
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel htmlFor="paciente-data-nascimento" shrink>
                  Data de nascimento
                </InputLabel>
                <OutlinedInput
                  id="paciente-data-nascimento"
                  label="Data de nascimento"
                  type="date"
                  notched
                  value={dataNascimento}
                  onChange={(event) => setDataNascimento(event.target.value)}
                />
              </FormControl>
            </Box>
          )}

          {errorMessage ? (
            <Alert severity="error" className={styles.pacienteEditarPage__alert}>
              {errorMessage}
            </Alert>
          ) : null}

          <Box className={styles.pacienteEditarPage__actions}>
            <Button
              href={`/pacientes/${pacienteId}`}
              variant="outlined"
              className={styles.pacienteEditarPage__backButton}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={styles.pacienteEditarPage__button}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? "Salvando..." : "Salvar alteracoes"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
