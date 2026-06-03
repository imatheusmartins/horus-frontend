import { Carousel } from "antd";
import CarouselContent from "./CarouselContent";
import Content from "./Content";
import team from "@/assets/team.png";
import eye from "@/assets/eye.png";
import oftalmologista from "@/assets/oftalmologista.mp4";

const description =
  "Protótipo acadêmico voltado ao diagnóstico assistido de retinopatia diabética, utilizando deep learning para apoiar a análise de imagens de retina e a organização dos resultados clínicos.";

const LandingCarousel = () => {
  return (
    <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={5000}>
      <CarouselContent background={team}>
        <Content
          typographyText="HÓRUS"
          typographyWidth="29rem"
          description={description}
        />
      </CarouselContent>
      <CarouselContent background={eye}>
        <Content
          typographyText="HÓRUS"
          typographyWidth="59rem"
          description={description}
        />
      </CarouselContent>
      <CarouselContent background={oftalmologista}>
        <Content
          typographyText="HÓRUS"
          typographyWidth="39rem"
          description={description}
        />
      </CarouselContent>
    </Carousel>
  );
};

export default LandingCarousel;
