import React, { useState } from "react";
import banner1 from "../../assets/banners/banner1.jpg";
import banner2 from "../../assets/banners/banner2.jpeg";
import { CiSearch } from "react-icons/ci";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";
import BannerMap from "./BannerMap";
const Banner = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handlePlaceChange = (newPlace) => {
    if (newPlace) {
      setSelectedPlace(newPlace);
    }
  };
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
        <h3 className="font-semibold text-white text-[60px] text-center">
          Find Your Outdoors
        </h3>
        <div className="relative">
          <BannerMap handlePlaceChange={handlePlaceChange} />
          <CiSearch className="text-[#414141] absolute bottom-[15px] h-[32px] w-[32px] left-[14px]" />

        </div>
      </div>
    </div>
  );
};

export default Banner;
