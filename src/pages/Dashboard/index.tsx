import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Box, Paper, Typography } from "@mui/material";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Box>
        <Typography
          component="h1"
          sx={{
            color: "var(--horus-blue)",
            fontSize: "2rem",
            fontWeight: 700,
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Home
        </Typography>
        <Typography sx={{ color: "#5f6b7a", mt: 0.5 }}>
          Bem-vindo a plataforma Horus.
        </Typography>
      </Box>

      <Paper
        sx={{
          borderRadius: 2,
          boxShadow: "none",
          mt: 3,
          p: 3,
        }}
      >
        <Typography sx={{ color: "#1f2937" }}>
          Use o menu lateral para acessar os recursos da aplicacao.
        </Typography>
      </Paper>
    </DashboardLayout>
  );
}
