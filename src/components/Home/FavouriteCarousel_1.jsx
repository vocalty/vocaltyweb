import React from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PlaceCard from "./PlaceCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div onClick={onClick} className="absolute right-[-60px] h-[50px] w-[50px] hover:cursor-pointer shadow-md shadow-[#00000057] rounded-full flex justify-center items-center bottom-[50%]">
        <FaArrowRight className="text-[22px] text-[#142800]" />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div onClick={onClick} className="absolute left-[-60px] h-[50px] w-[50px] hover:cursor-pointer shadow-md shadow-[#00000057] rounded-full flex justify-center items-center bottom-[50%]">
        <FaArrowLeft className="text-[22px] text-[#142800]" />
    </div>
  );
}

const FavouriteCarousel = () => {
  var settings = {
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
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="slider-container relative">
      <Slider {...settings}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
          <PlaceCard key={number} />
        ))}
      </Slider>
    </div>
  );
};

export default FavouriteCarousel;
