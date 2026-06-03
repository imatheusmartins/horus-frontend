import { Button, Typography, Box } from "@mui/material";
import { Link } from "@tanstack/react-router";
import styles from "./styles.module.scss";

type ContentProps = {
  typographyText: string;
  typographyWidth: string;
  description?: string;
  to?: string;
  buttonText?: string;
};

export default function Content({
  typographyText,
  typographyWidth,
  description,
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
      {description ? (
        <Typography className={styles.contentDescription}>
          {description}
        </Typography>
      ) : null}
      {buttonText && to && (
        <Button component={Link} to={to} className={styles.contentButton}>
          {buttonText}
        </Button>
      )}
    </Box>
  );
}
