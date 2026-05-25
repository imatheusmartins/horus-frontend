import MenuAppBar from "@/components/Dashboard/DashboardNavBar";
import { Box } from "@mui/material";
import type { ReactNode } from "react";
import styles from "./styles.module.scss";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Box className={styles.dashboardLayout}>
      <MenuAppBar />
      <Box component="main" className={styles.dashboardLayout__content}>
        {children}
      </Box>
    </Box>
  );
}
