import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { HttpErrorApi } from "@/infra/HttpErrorApi";
import { createPaciente } from "@/service/Paciente";
import { getAuthUser, getAuthUserId } from "@/utils/session";
import { onlyNumbers } from "@/utils/formatters";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import styles from "./styles.module.scss";

export default function PacienteNovoPage() {
  const navigate = useNavigate();
  const authUser = useMemo(() => getAuthUser(), []);
  const authUserId = useMemo(() => getAuthUserId(authUser), [authUser]);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!authUserId) {
      setErrorMessage("Faça login para cadastrar um paciente.");
      return;
    }

    if (!nome.trim() || !cpf.trim() || !dataNascimento) {
      setErrorMessage("Preencha nome, CPF e data de nascimento.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createPaciente({
        nome: nome.trim(),
        cpf: onlyNumbers(cpf),
        dataNascimento,
        usuarioId: authUserId,
      });

      await navigate({ to: "/pacientes" });
    } catch (error) {
      if (error instanceof HttpErrorApi) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível cadastrar o paciente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <Box className={styles.pacienteNovoPage}>
        <Paper
          component="form"
          className={styles.pacienteNovoPage__panel}
          onSubmit={handleSubmit}
        >
          <Typography component="h1" className={styles.pacienteNovoPage__title}>
            Novo paciente
          </Typography>
          <Typography className={styles.pacienteNovoPage__text}>
            Cadastre um paciente vinculado ao seu usuário.
          </Typography>

          <Box className={styles.pacienteNovoPage__fields}>
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
                onChange={(event) => setCpf(event.target.value)}
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
                value={dataNascimento}
                onChange={(event) => setDataNascimento(event.target.value)}
              />
            </FormControl>
          </Box>

          {errorMessage ? (
            <Alert severity="error" className={styles.pacienteNovoPage__alert}>
              {errorMessage}
            </Alert>
          ) : null}

          <Box className={styles.pacienteNovoPage__actions}>
            <Button
              component={Link}
              to="/pacientes"
              variant="outlined"
              className={styles.pacienteNovoPage__backButton}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={styles.pacienteNovoPage__button}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar paciente"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
