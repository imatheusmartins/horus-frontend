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
import { Eye, EyeOff, User } from "lucide-react";
import logoHorus from "@/assets/horus-logo.png";
import { HttpErrorApi, HttpStatusCode } from "@/infra/HttpErrorApi";
import { login } from "@/service/User";
import styles from "./styles.module.scss";

const FIELD_HEIGHT = "2.5rem";
const LABEL_FONT_SIZE = 14;
const INVALID_CREDENTIALS_MESSAGE = "Email ou senha inválidos";

const FormLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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
      const user = await login({
        email: email.trim(),
        password,
      });

      localStorage.setItem("authToken", user.token);
      localStorage.setItem("authUser", JSON.stringify(user));

      await navigate({ to: "/dashboard" });
    } catch (error) {
      if (
        error instanceof HttpErrorApi &&
        error.statusCode === HttpStatusCode.UNAUTHORIZED
      ) {
        setErrorMessage(INVALID_CREDENTIALS_MESSAGE);
      } else {
        setErrorMessage("Não foi possível fazer login. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      className={styles.loginForm}
      onSubmit={handleSubmit}
    >
      <Box
        component="img"
        src={logoHorus}
        alt="Horus logo"
        className={styles.loginForm__logoImg}
      />

      <Typography
        sx={{
          color: "var(--horus-blue)",
          fontWeight: "bold",
          margin: ".1rem auto",
        }}
      >
        Bem vindo de volta!
      </Typography>
      <Typography
        sx={{
          color: "var(--horus-blue)",
          fontSize: ".8rem",
          margin: ".1rem auto 1.5rem",
        }}
      >
        Conectando conhecimento clínico e precisão de IA na saúde da retina.
      </Typography>

      <Box className={styles.loginForm__fields}>
        <FormControl fullWidth variant="outlined" required>
          <InputLabel sx={{ fontSize: LABEL_FONT_SIZE }} htmlFor="login-email">
            Email
          </InputLabel>
          <OutlinedInput
            id="login-email"
            label="Email"
            type="email"
            sx={{ height: FIELD_HEIGHT }}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
            htmlFor="login-password"
          >
            Senha
          </InputLabel>
          <OutlinedInput
            id="login-password"
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

      <Button
        component={Link}
        to="/forgot-password"
        variant="text"
        className={styles.loginForm__forgotPassword}
      >
        Esqueceu a senha?
      </Button>

      <Box className={styles.loginForm__actions}>
        <Button
          type="submit"
          variant="contained"
          className={styles.loginForm__loginButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Entrando..." : "Login"}
        </Button>
        <Divider sx={{ fontSize: 12 }}>OU</Divider>
        <Button
          component={Link}
          to="/register"
          variant="outlined"
          className={styles.loginForm__registerButton}
        >
          Cadastrar
        </Button>
      </Box>
    </Box>
  );
};

export default FormLogin;
