import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import logoHorus from "@/assets/horus-logo.png";
import { HttpErrorApi } from "@/infra/HttpErrorApi";
import { createUser } from "@/service/User";
import styles from "./styles.module.scss";

const FIELD_HEIGHT = "2.5rem";
const LABEL_FONT_SIZE = 14;

const RegisterForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const preventMouseDefault = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const user = await createUser({
        nome: nome.trim(),
        email: email.trim(),
        password,
      });

      localStorage.setItem("authToken", user.token);
      localStorage.setItem("authUser", JSON.stringify(user));

      await navigate({ to: "/dashboard" });
    } catch (error) {
      if (error instanceof HttpErrorApi) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível concluir o cadastro. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      className={styles.registerForm}
      onSubmit={handleSubmit}
    >
      <Box
        component="img"
        src={logoHorus}
        alt="Horus logo"
        className={styles.registerForm__logoImg}
      />

      <Typography
        sx={{
          color: "var(--horus-blue)",
          fontWeight: "bold",
          margin: ".1rem auto",
        }}
      >
        Criar conta
      </Typography>
      <Typography
        sx={{
          color: "var(--horus-blue)",
          fontSize: ".8rem",
          margin: ".1rem auto 1.5rem",
          textAlign: "center",
        }}
      >
        Cadastre seu usuário para acessar a plataforma Horus.
      </Typography>

      <Box className={styles.registerForm__fields}>
        <FormControl fullWidth variant="outlined" required>
          <InputLabel sx={{ fontSize: LABEL_FONT_SIZE }} htmlFor="register-name">
            Nome
          </InputLabel>
          <OutlinedInput
            id="register-name"
            label="Nome"
            sx={{ height: FIELD_HEIGHT }}
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton edge="end">
                  <User size={18} />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl fullWidth variant="outlined" required>
          <InputLabel
            sx={{ fontSize: LABEL_FONT_SIZE }}
            htmlFor="register-email"
          >
            Email
          </InputLabel>
          <OutlinedInput
            id="register-email"
            label="Email"
            type="email"
            sx={{ height: FIELD_HEIGHT }}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton edge="end">
                  <Mail size={18} />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl fullWidth variant="outlined" required>
          <InputLabel
            sx={{ fontSize: LABEL_FONT_SIZE }}
            htmlFor="register-password"
          >
            Senha
          </InputLabel>
          <OutlinedInput
            id="register-password"
            label="Senha"
            type={showPassword ? "text" : "password"}
            sx={{ height: FIELD_HEIGHT }}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
                  onClick={handleTogglePassword}
                  onMouseDown={preventMouseDefault}
                  onMouseUp={preventMouseDefault}
                  edge="end"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>

      {errorMessage ? (
        <Alert severity="error" sx={{ mt: 1.5 }}>
          {errorMessage}
        </Alert>
      ) : null}

      <Box className={styles.registerForm__actions}>
        <Button
          type="submit"
          variant="contained"
          className={styles.registerForm__registerButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </Button>
        <Divider sx={{ fontSize: 12 }}>OU</Divider>
        <Button
          component={Link}
          to="/login"
          variant="outlined"
          className={styles.registerForm__loginButton}
        >
          Voltar para login
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterForm;
