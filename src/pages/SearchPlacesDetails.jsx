import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import MapComponent from './../components/SearchPlacesDetails/MapComponent';
import { useContext, useState } from "react";
import { SearchPlaceContext } from "../context/SearchPlaceProvider";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import { FaMap, FaStar } from 'react-icons/fa';
import { CiUser } from "react-icons/ci";
import { useJsApiLoader } from "@react-google-maps/api";
import SidebarMain from "../components/SearchPlacesDetails/SidebarMain";
import SidebarResponsive from "../components/SearchPlacesDetails/SidebarResponsive";


export default function SearchPlacesDetails() {
    const [showMap, setShowMap] = useState(false);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
      });
    const {matchedPlaces} = useContext(SearchPlaceContext);
    const { place } = useParams();
    return (
        <>
            <div className='h-[80px] bg-sky-500 w-full'></div>
            <div className="flex md:flex-row flex-col h-[90vh] px-4 mx-auto overflow-hidden relative">
                {/* sidebar */}
                <div className="md:flex flex-col hidden w-1/2 md:w-[25%] overflow-x-hidden overflow-y-scroll">
                    <div className="flex flex-col flex-1">
                        <SidebarMain parkLocations={matchedPlaces}/>
                    </div>
                </div>
                {/* Main content */}
                <div className="flex flex-col flex-1 md:w-[65%] w-full bg-[#f5f5f5] relative">
                        {
                            isLoaded && (
                                <MapComponent place={place} />
                            )
                        }
                        <SidebarResponsive parkLocations={matchedPlaces} showMap={showMap}/>
                </div>
                <button onClick={() => setShowMap(!showMap)} className="md:hidden flex justify-center items-center rounded-full absolute top-20 right-[25px] z-40 bg-white border-4 shadow-xl border-gray-400 h-12 w-12" type="button"><FaMap className="text-[25px] text-black" /></button>
            </div >
        </>
    );
}