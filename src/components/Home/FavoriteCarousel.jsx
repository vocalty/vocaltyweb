import React, { useContext } from "react";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { SearchPlaceContext } from "../../context/SearchPlaceProvider";
import Loading from "../Loading";
import PlaceCard from "./PlaceCard";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div onClick={onClick} className="absolute bg-white right-0 z-30 ml-5 h-[50px] w-[50px] hover:cursor-pointer shadow-md shadow-[#00000057] rounded-full flex justify-center items-center bottom-[50%]">
      <FaArrowRight className="text-[22px] text-[#142800]" />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div onClick={onClick} className="absolute bg-white left-0 z-30 mr-5 h-[50px] w-[50px] hover:cursor-pointer shadow-md shadow-[#00000057] rounded-full flex justify-center items-center bottom-[50%]">
      <FaArrowLeft className="text-[22px] text-[#142800]" />
    </div>
  );
}

const FavoriteCarousel = () => {
  const { tourPlaces } = useContext(SearchPlaceContext);
  let settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1080,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      }, {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          prevArrow: false,
          nextArrow: false,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          prevArrow: false,
          nextArrow: false,
          dots: false,
        },
      }, {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          prevArrow: false,
          nextArrow: false,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          prevArrow: false,
          nextArrow: false,
          dots: false,
        },
      }
    ],
  };

  return (
    <div className="slider-container relative">
      {
        tourPlaces?.length > 0 ?
          <Slider {...settings}>
            {
              tourPlaces?.map((place) => (
                <PlaceCard place={place?.data} id={place?.id} key={place?.id} />
              ))}
          </Slider>
          :
          <Loading />
      }
    </div>
  );
};

export default FavoriteCarousel;