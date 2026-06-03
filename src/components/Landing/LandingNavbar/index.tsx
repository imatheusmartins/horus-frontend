import {
  AppBar,
  Container,
  Toolbar,
  Box,
  Typography,
  Button,
  ButtonBase,
} from "@mui/material";
import styles from "./styles.module.scss";
import { Link } from "@tanstack/react-router";
import logoHorus from "@/assets/logo.png";

function Logo() {
  return (
    <ButtonBase
      component={Link}
      to="/"
      disableRipple
      className={styles.landingNavBar__logoBtnBase}
    >
      <Box
        component="img"
        src={logoHorus}
        alt=""
        className={styles.landingNavBar__logoImg}
      />
      <Typography noWrap className={styles.landingNavBar__logoName}>
        HÓRUS
      </Typography>
    </ButtonBase>
  );
}

export default function LandingNavBar() {
  return (
    <AppBar
      position="absolute"
      color="transparent"
      elevation={0} // evita sombra residual
      enableColorOnDark
      className={styles.landingNavBar__appBar}
      sx={{ backgroundImage: "none" }} // MUI v5 adiciona gradiente em AppBars escuros
    >
      <Container maxWidth={false} className={styles.landingNavBar__container}>
        <Toolbar disableGutters className={styles.landingNavBar__toolBar}>
          <Logo />

          <Box className={styles.landingNavBar__actions}>
            <Button
              component={Link}
              to="/login"
              variant="text"
              className={styles.landingNavBar__loginButton}
            >
              Entrar
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              className={styles.landingNavBar__signupButton}
            >
              Cadastrar
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
