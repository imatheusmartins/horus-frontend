import type React from "react";
import { Box } from "@mui/material";
import styles from "./styles.module.scss";

type CarouselContentProps = {
  children: React.ReactNode;
  background: string;
};

const isVideo = (src: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);

const CarouselContent = ({ children, background }: CarouselContentProps) => {
  return (
    <Box className={styles.wrapper}>
      {isVideo(background) ? (
        <Box
          component="video"
          className={styles.video}
          src={background}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <Box
          className={styles.image}
          style={{ backgroundImage: `url(${background})` }}
        />
      )}

      <Box className={styles.overlay} />

      {children}
    </Box>
  );
};

export default CarouselContent;
