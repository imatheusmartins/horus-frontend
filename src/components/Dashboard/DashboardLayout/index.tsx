import MenuAppBar from "@/components/Dashboard/DashboardNavBar";
import { getAuthUser } from "@/utils/session";
import { Box } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import styles from "./styles.module.scss";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const authUser = getAuthUser();

  useEffect(() => {
    if (!authUser) {
      void navigate({ to: "/login" });
    }
  }, [authUser, navigate]);

  if (!authUser) {
    return null;
  }

  return (
    <Box className={styles.dashboardLayout}>
      <MenuAppBar />
      <Box component="main" className={styles.dashboardLayout__content}>
        {children}
      </Box>
    </Box>
  );
}
