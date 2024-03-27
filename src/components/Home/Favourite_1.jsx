import React from "react";
import FavouriteCarousel from "./FavouriteCarousel";

const Favourite = () => {
  return (
    <div className="lg:max-w-[1140px] 2xl:max-w-[1440px] mx-auto my-[80px]">
      <h1 className="text-[#142800] text-[36px] font-medium mb-[20px]">
        Local favorites near{" "}
        <span className="font-bold underline tracking-tight"> Los Angeles</span>
      </h1>
      <div>
        <FavouriteCarousel />
      </div>
    </div>
  );
};

export default Favourite;
