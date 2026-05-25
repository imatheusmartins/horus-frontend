import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { HttpErrorApi, HttpStatusCode } from "@/infra/HttpErrorApi";
import {
  getPacientesByUsuario,
  type Paciente,
} from "@/service/Paciente";
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
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";

interface AuthUser {
  id?: string | number;
  usuarioId?: string | number;
  userId?: string | number;
}

function getAuthUser(): AuthUser | null {
  const storedUser = localStorage.getItem("authUser");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
  }).format(parsedDate);
}

function getAuthUserId(authUser: AuthUser | null) {
  return authUser?.id ?? authUser?.usuarioId ?? authUser?.userId ?? null;
}

export default function PacientesPage() {
  const navigate = useNavigate();
  const authUser = useMemo(() => getAuthUser(), []);
  const authUserId = useMemo(() => getAuthUserId(authUser), [authUser]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!authUserId) {
      setIsLoading(false);
      setErrorMessage("Faca login para visualizar seus pacientes.");
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
          setErrorMessage("Nao foi possivel carregar os pacientes.");
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

  return (
    <DashboardLayout>
      <Box className={styles.pacientesPage}>
        <Box className={styles.pacientesPage__header}>
          <Box>
            <Typography component="h1" className={styles.pacientesPage__title}>
              Pacientes
            </Typography>
            <Typography className={styles.pacientesPage__subtitle}>
              Acompanhe os pacientes vinculados ao seu usuario.
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

        {!isLoading && !errorMessage && pacientes.length === 0 ? (
          <Paper className={styles.pacientesPage__emptyState}>
            <Typography component="h2">Nenhum paciente cadastrado</Typography>
            <Typography>
              Quando houver pacientes vinculados ao seu usuario, eles
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
                </TableRow>
              </TableHead>
              <TableBody>
                {pacientes.map((paciente) => (
                  <TableRow key={paciente.id}>
                    <TableCell>{paciente.nome}</TableCell>
                    <TableCell>{paciente.cpf}</TableCell>
                    <TableCell>{formatDate(paciente.dataNascimento)}</TableCell>
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
