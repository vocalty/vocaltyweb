import React, { useContext } from "react";
import { SearchPlaceContext } from '../../context/SearchPlaceProvider';
import FavoriteCarousel from './FavoriteCarousel';
import FavoriteCarouselBest from './FavoriteCarouselBest';

const Favorite = () => {
  const { localPlaceName } = useContext(SearchPlaceContext);
  const extractAddressPart = (address) => {
    let parts = address?.split(",");
    if (parts?.length > 1) {
      return parts[0].trim() + ", " + parts[1]?.trim();
    } else {
      let words = address?.split(" ");
      return words?.slice(0, 2).join(" ");
    }
  }
  return (
    <>
      <div className="lg:max-w-[1140px] 2xl:max-w-[1440px] mx-auto my-[80px] px-4 md:overflow-visible overflow-x-hidden">
        <h1 className="text-[#142800] md:text-[36px] text-[25px] font-medium mb-[20px]">
          Most Favorite Tours
        </h1>
        <div>
          <FavoriteCarousel />
        </div>
      </div>
      <div className="lg:max-w-[1140px] 2xl:max-w-[1440px] mx-auto my-[80px] px-4 md:overflow-visible overflow-x-hidden">
        <h1 className="text-[#142800] text-[25px] md:text-[36px] font-medium mb-[20px]">
          Best Tours You May Like
        </h1>
        <div>
          <FavoriteCarouselBest />
        </div>
      </div>
    </>
  );
};

export default Favorite;