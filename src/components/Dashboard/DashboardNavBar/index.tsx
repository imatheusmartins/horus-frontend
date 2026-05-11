import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import styles from "./styles.module.scss";
import { Link } from "@tanstack/react-router";
import logoHorus from "@/assets/logo.png";

const pages = ["teste", "teste", "teste"];

export default function MenuAppBar() {
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  return (
    <AppBar className={styles.dashboardNavBar}>
      <Container className={styles.dashboardNavBar__container}>
        <Toolbar disableGutters className={styles.dashboardNavBar__toolbar}>
          <Box
            component="img"
            src={logoHorus}
            alt=""
            className={styles.dashboardNavBar__logoImg}
          />
          <Box className={styles.dashboardNavBar__tabs}>
            <List className={styles.dashboardNavBar__list}>
              {pages.map((page) => (
                <ListItem
                  key={page}
                  disablePadding
                  className={styles.dashboardNavBar__listItem}
                >
                  <ListItemButton
                    component={Link}
                    to={`/${page.toLowerCase().replace(/\s+/g, "-")}`}
                    className={styles.dashboardNavBar__listItemButton}
                  >
                    <ListItemText
                      primary={page}
                      className={styles.dashboardNavBar__listItemText}
                    />
                    <Box className={styles.bottomBar} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box></Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
