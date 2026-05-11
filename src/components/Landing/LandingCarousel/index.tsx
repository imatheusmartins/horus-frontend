import { Carousel } from "antd";
import CarouselContent from "./CarouselContent";
import team from "@/assets/team.png";
import eye from "@/assets/eye.png";
import oftalmologista from "@/assets/oftalmologista.mp4";
import Content from "./Content";

const LandingCarousel = () => {
  return (
    <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={2000}>
      <CarouselContent background={team}>
        <Content
          buttonText="About Us"
          typographyText="Conheça nosso time"
          typographyWidth="29rem"
          to="/aboutUs"
        />
      </CarouselContent>
      <CarouselContent background={eye}>
        <Content
          buttonText="Referencial Teórico"
          typographyText="Confira nosso referencial teórico"
          typographyWidth="59rem"
          to=""
        />
      </CarouselContent>
      <CarouselContent background={oftalmologista}>
        <Content
          buttonText="Projeto"
          typographyText="Entenda sobre o projeto"
          typographyWidth="39rem"
          to=""
        />
      </CarouselContent>
    </Carousel>
  );
};

export default LandingCarousel;
