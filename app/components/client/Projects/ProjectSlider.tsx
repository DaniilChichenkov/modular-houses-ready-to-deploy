/* eslint-disable react/prop-types */
import { lazy, Suspense, type MouseEventHandler } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Settings } from "react-slick";

//For Slick Slider to work
import ClientOnly from "~/components/ClientOnly";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const Slider = lazy(() => import("react-slick"));

//For testing
import house from "/src/house.jpg";

interface ArrowProps {
  onClick?: MouseEventHandler<SVGSVGElement>;
  className?: string;
  style?: React.CSSProperties;
}

//Custom Left Arrow
const PreviousSlideArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <ChevronLeft
      color="#fff"
      size={30}
      strokeWidth={3}
      className="absolute cursor-pointer left-1 top-1/2 -translate-y-1/2 z-10"
      onClick={onClick}
    />
  );
};

//Custom Right Arrow
const NextSlideArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <ChevronRight
      color="#fff"
      size={30}
      strokeWidth={3}
      className="absolute cursor-pointer right-1 top-1/2 -translate-y-1/2 z-10"
      onClick={onClick}
    />
  );
};

//Main Slider
const ProjectSlider = () => {
  //Slider settings
  const sliderSettings: Settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PreviousSlideArrow />,
    nextArrow: <NextSlideArrow />,
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <ClientOnly>
      <Suspense fallback={<div>loading slider...</div>}>
        <Slider {...sliderSettings}>
          <div>
            <img src={house} alt="#" />
          </div>
          <div>
            <img src={house} alt="#" />
          </div>
          <div>
            <img src={house} alt="#" />
          </div>
          <div>
            <img src={house} alt="#" />
          </div>
        </Slider>
      </Suspense>
    </ClientOnly>
  );
};

export default ProjectSlider;
