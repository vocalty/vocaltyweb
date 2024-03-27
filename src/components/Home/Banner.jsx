import React from "react";
import banner1 from "../../assets/banners/banner1.jpg";
import banner2 from "../../assets/banners/banner2.jpeg";
import BannerMap from "./BannerMap";


const Banner = () => {
  return (
    <div className="w-[100%] flex justify-center items-center h-[600px] overflow-hidden relative">
      <img
        src={banner1}
        className="h-[800px] w-[50%] bannerImage"
        alt="banner1"
      />
      <img
        src={banner2}
        className="h-[800px] w-[50%] bannerImage"
        alt="banner2"
      />

      <div className="absolute">
        <h3 className="font-semibold text-white sm:text-[60px] text-4xl text-center">
          Find Your Outdoors
        </h3>
        <div className="relative pt-4">
          <BannerMap />
        </div>
      </div>
    </div>
  );
};

export default Banner;
