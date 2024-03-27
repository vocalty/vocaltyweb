import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-[100%] lg:px-[25px] xl:px-[45px] h-[80px] flex justify-between items-center fixed top-0 bg-[white] z-50">
      <div className="flex justify-start items-center gap-[32px]">
        <div className="text-xl md:text-2xl font-black ">
          <Link to={"/"} className="text-[#142800]">
            VOCALTY
          </Link>
        </div>
        <Link>
          <p className="text-[#142800] font-bold text-[14px]">Explore</p>
        </Link>
        <Link>
          <p className="text-[#142800] font-bold text-[14px]">Community</p>
        </Link>
        <Link>
          <p className="text-[#142800] font-bold text-[14px]">Saved</p>
        </Link>
        <Link>
          <p className="text-[#142800] font-bold text-[14px]">Shop</p>
        </Link>
      </div>
      <div className="flex justify-start items-center gap-[27px]">
        <Link>
          <p className="text-[#142800] font-bold text-[14px]">Help</p>
        </Link>
        <Link>
          <p className="text-[#142800] bg-[#64f67b] font-semibold px-[18px] py-[8px] rounded-full text-[14px]">
            Try Vocalty+ for free
          </p>
        </Link>

        <Link>
          <p className="text-[#142800] bg-[#151b0d14] font-semibold px-[18px] py-[8px] rounded-full text-[14px]">
            Log in
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
