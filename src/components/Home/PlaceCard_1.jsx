import { FaStar } from "react-icons/fa";

function PlaceCard() {
  return (
    <div className="mx-[10px]">
      <img
        src="https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
        alt="ui/ux review check"
        className="rounded-[20px]"
      />
      <div className="p-[8px]">
        <p className="text-[#142800] text-[17px] font-bold">Echo Park Lake</p>
        <p className="text-[#142800] text-[14px] font-bold">Echo Park</p>
        <div className="flex justify-start items-center gap-[5px]">
          <div className="flex justify-center items-center gap-[3px]">
            <FaStar className="text-[#fce74b] mb-1" />

            <p className="text-[#142800] text-[14px] font-bold"> 4.4</p>
          </div>
          <div className="h-[4px] w-[4px] rounded-full bg-[#3a3a3a]"></div>
          <p className="text-[#142800] text-[14px] font-bold">1.0 mi</p>
          <div className="h-[4px] w-[4px] rounded-full bg-[#3a3a3a]"></div>
          <p className="text-[#142800] text-[14px] font-bold">1.0</p>
        </div>
      </div>
    </div>
  );
}

export default PlaceCard;
