import { Skeleton } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SearchPlaceContext } from "../../context/SearchPlaceProvider";

function PlaceCard({ place, id }) {
  const { dependencyUp } = useContext(SearchPlaceContext); // Assuming dependencyUp is the state from your context
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 4000);
  }, [dependencyUp]);

  // const typeOfPlace = place?.types[0]?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  // const vicinity = place?.vicinity?.split(" ").slice(0, 2).join(" ");
  // const placeName = place?.name.split(" ").slice(0, 3).join(" ");
  return (
    <div className="flex justify-center items-center overflow-hidden">
      <Link to={`/singletour/${id}`}>
        <div className="mx-[10px] break-words flex flex-col md:items-start items-center">
          <Skeleton isLoaded={isLoaded} height="220px" width="300px" borderRadius="20px">
            <img
              src={place?.steps[0]?.image_url ? place?.steps[0]?.image_url : "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"}
              alt="ui/ux review check"
              className="rounded-[20px]"
              style={{
                height: "220px",
                width: "300px",
              }}
            />
          </Skeleton>
          <div className="p-[8px] flex flex-col break-words">
            <Skeleton isLoaded={isLoaded} height="20px" width="250px" borderRadius="5px" mb="4px">
              <p className="text-[#142800] text-[17px] font-bold">{place?.city + ', ' + place?.country}</p>
            </Skeleton>
            <Skeleton isLoaded={isLoaded} height="20px" width="200px" borderRadius="5px" mb="4px">
              <p className="text-[#142800] text-[14px] font-semibold">Type: Tourist place</p>
            </Skeleton>
            <div className="flex justify-between items-end gap-[5px] pt-4">
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PlaceCard;