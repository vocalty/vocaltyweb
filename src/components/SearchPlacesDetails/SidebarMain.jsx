import { FaSearch, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Binocular from "../../assets/svg/binoculars.svg";


export default function SidebarMain({parkLocations: matchedPlaces}) {
    return (
        <>
        <nav className="flex-1 px-4 pb-4 md:inline-block hidden relative">
            {
              matchedPlaces.length > 0 ? ( 
                <span className="flex items-baseline justify-evenly sticky bg-white top-0 py-4 z-50">
                    <h1 className="text-xl text-gray-600 font-extralight">Searched Nearby places</h1>
                    <FaSearch className=" text-sm"/>
                </span>) : null
            }
                            {
                            // parkLocations.length > 0 ? (
                            matchedPlaces.length > 0 ? (
                                matchedPlaces.map((park) => (
                                    <Link key={park?.id} to={`/singletour/${park?.id}`}>
                                    <div className="overflow-hidden shadow-sm mb-8 px-2 pb-4">
                                        <Swiper
                                            slidesPerView={1}
                                            spaceBetween={30}
                                            loop={true}
                                            pagination={{
                                              clickable: true,
                                            }}
                                            navigation={true}
                                            modules={[Pagination, Navigation]}
                                            className="mySwiper"
                                            >
                                                        {
                                                            park?.data?.steps.map(step => (
                                                            <SwiperSlide key={step.image_url}>
                                                                <img  className="w-full h-full rounded-md" src={step.image_url} alt={step.caption} />
                                                            </SwiperSlide>
                                                            ))
                                                        }
                                            
                                        </Swiper>
                                        <div className=" py-4">
                                            <h1 className="font-bold text-xl mb-2">{ park?.data?.city}</h1>
                                            <h3 className="font-medium text-base">
                                                {park?.data?.title ? park?.data?.title : " "}
                                            </h3>
                                        </div>
                                        <div className="font-medium text-gray-900 flex flex-row">
                                            <span className="flex flex-row"><FaStar className=" text-yellow-900 mr-1" />{park?.data?.country_code}{" -"}</span>
                                            {/* <span className="ml-1 flex flex-row items-center"><CiUser />{park?.data?.likes.length > 0 ? park?.data?.likes.length : 0}</span> */}
                                            <span className="ml-1 text-gray-600">- { park?.data?.country}</span>
                                        </div>
                                    </div>
                                    </Link>
                                ))
                                
                            ): (
                                <div className="result-empty-message text-center flex flex-col justify-center items-center mt-2 bg-gray-100 px-4 py-6 rounded">
                                <img className=" w-1/3" src={Binocular} alt="Binocular" />
                                <h1 className=" text-3xl text-light-blue-600">No results found</h1>
                                <p className="">Let's get you back on track! Zoom out or try the "Community content" tab to see if others have explored this area.</p>
                                <Link to={"/"} className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-2 py-2 px-6 rounded-full">
                                    Explore community
                                </Link>
                                </div>
                                )
                            }
                            
                        </nav>
        </>
    );
}