import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { HttpErrorApi, HttpStatusCode } from "@/infra/HttpErrorApi";
import {
  deletePaciente,
  getPacientesByUsuario,
  type Paciente,
} from "@/service/Paciente";
import { formatCpf, formatDate } from "@/utils/formatters";
import { getAuthUser, getAuthUserId } from "@/utils/session";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";

export default function PacientesPage() {
  const navigate = useNavigate();
  const authUser = useMemo(() => getAuthUser(), []);
  const authUserId = useMemo(() => getAuthUserId(authUser), [authUser]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (!authUserId) {
      setIsLoading(false);
      setErrorMessage("Faça login para visualizar seus pacientes.");
      void navigate({ to: "/login" });
      return;
    }

    const usuarioId = authUserId;
    let isMounted = true;

    async function loadPacientes() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await getPacientesByUsuario(usuarioId);

        if (isMounted) {
          setPacientes(data);
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
          setErrorMessage("");
        } else if (error instanceof HttpErrorApi) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Não foi possível carregar os pacientes.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPacientes();

    return () => {
      isMounted = false;
    };
  }, [authUserId, navigate]);

  async function handleDeletePaciente(pacienteId: number) {
    const confirmed = window.confirm("Deseja remover este paciente?");

    if (!confirmed) {
      return;
    }

    setActionError("");

    try {
      await deletePaciente(pacienteId);
      setPacientes((current) =>
        current.filter((paciente) => paciente.id !== pacienteId),
      );
    } catch (error) {
      if (error instanceof HttpErrorApi) {
        setActionError(error.message);
      } else {
        setActionError("Não foi possível remover o paciente.");
      }
    }
  }

  return (
    <DashboardLayout>
      <Box className={styles.pacientesPage}>
        <Box className={styles.pacientesPage__header}>
          <Box>
            <Typography component="h1" className={styles.pacientesPage__title}>
              Pacientes
            </Typography>
            <Typography className={styles.pacientesPage__subtitle}>
              Acompanhe os pacientes vinculados ao seu usuário.
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/pacientes/novo"
            variant="contained"
            startIcon={<Plus size={18} />}
            className={styles.pacientesPage__newButton}
          >
            Novo paciente
          </Button>
        </Box>

        {isLoading ? (
          <Box className={styles.pacientesPage__feedback}>
            <CircularProgress size={32} />
            <Typography>Carregando pacientes...</Typography>
          </Box>
        ) : null}

        {!isLoading && errorMessage ? (
          <Alert severity="error">{errorMessage}</Alert>
        ) : null}

        {!isLoading && actionError ? (
          <Alert severity="error">{actionError}</Alert>
        ) : null}

        {!isLoading && !errorMessage && pacientes.length === 0 ? (
          <Paper className={styles.pacientesPage__emptyState}>
            <Typography component="h2">Nenhum paciente cadastrado</Typography>
            <Typography>
              Quando houver pacientes vinculados ao seu usuário, eles
              aparecerao nesta lista.
            </Typography>
          </Paper>
        ) : null}

        {!isLoading && !errorMessage && pacientes.length > 0 ? (
          <TableContainer
            component={Paper}
            className={styles.pacientesPage__tableContainer}
          >
            <Table>
              <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>CPF</TableCell>
                    <TableCell>Data de nascimento</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pacientes.map((paciente) => (
                  <TableRow key={paciente.id}>
                    <TableCell>{paciente.nome}</TableCell>
                    <TableCell>{formatCpf(paciente.cpf)}</TableCell>
                    <TableCell>{formatDate(paciente.dataNascimento)}</TableCell>
                    <TableCell align="right">
                      <Box className={styles.pacientesPage__tableActions}>
                        <Button
                          href={`/pacientes/${paciente.id}`}
                          variant="outlined"
                          startIcon={<Eye size={16} />}
                          className={styles.pacientesPage__actionButton}
                        >
                          Ver
                        </Button>
                        <Button
                          href={`/pacientes/${paciente.id}/editar`}
                          variant="outlined"
                          startIcon={<Edit size={16} />}
                          className={styles.pacientesPage__actionButton}
                        >
                          Editar
                        </Button>
                        <Button
                          color="error"
                          variant="outlined"
                          startIcon={<Trash2 size={16} />}
                          className={styles.pacientesPage__deleteButton}
                          onClick={() => void handleDeletePaciente(paciente.id)}
                        >
                          Excluir
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </Box>
    </DashboardLayout>
  );
}
