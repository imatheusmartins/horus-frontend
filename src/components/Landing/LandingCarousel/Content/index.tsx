import { Button, Typography, Box } from "@mui/material";
import { Link } from "@tanstack/react-router";
import styles from "./styles.module.scss";

type ContentProps = {
  typographyText: string;
  typographyWidth: string;
  to: string;
  buttonText: string;
};

export default function Content({
  typographyText,
  typographyWidth,
  to,
  buttonText,
}: ContentProps): React.ReactNode {
  return (
    <Box className={styles.contentBox}>
      <Typography
        className={styles.contentTypography}
        sx={{
          width: typographyWidth,
        }}
      >
        {typographyText}
      </Typography>
      <Button component={Link} to={to} className={styles.contentButton}>
        {buttonText}
      </Button>
    </Box>
  );
}
