import { Box } from "@mui/material";
import loginVideo from "@/assets/backLogin.mp4";
import RegisterForm from "@/components/Register/RegisterForm";

const RegisterPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        component="video"
        autoPlay
        muted
        loop
        playsInline
        src={loginVideo}
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          objectFit: "cover",
          zIndex: -1,
        }}
      />

      <Box sx={{ zIndex: 1 }}>
        <RegisterForm />
      </Box>
    </Box>
  );
};

export default RegisterPage;
