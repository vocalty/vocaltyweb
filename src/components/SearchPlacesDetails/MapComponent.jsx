import React, { useContext, useEffect, useState } from 'react'
import {
    GoogleMap,
    useJsApiLoader,
    MarkerF,
    OverlayViewF,
    OverlayView,
  } from "@react-google-maps/api";
import direction from "../../assets/direction.png";
import { collection,getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Loading from '../Loading';
import { SearchPlaceContext } from './../../context/SearchPlaceProvider';
import { Link } from 'react-router-dom';
import { IoMdCloseCircle } from "react-icons/io";
import Tour from './../Tour_1';


const containerStyle = {
  width: '100%',
  height: '90vh'
};

const MapComponent = ({place}) => {
  const {selectedPlace, parkLocations, setParkLocations, setMatchedPlaces} = useContext(SearchPlaceContext);
    const [map, setMap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [start, setStart] = useState(selectedPlace);
    const [showData, setShowData] = useState(false);
    const [showHover, setShowHover] = useState(false);
    const [index, setIndex] = useState(null);
    const [indexh, setIndexH] = useState(null);

    const handleShowData = (i) => {
      setIndex(i);
      setShowData(true);
    };
    const handleShowHover = (i) => {
        setIndexH(i);
        setShowHover(true);
    };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
  });

  const getPlace = async()=>{
      if(loading) return;
      setLoading(true);
      try {
            const tourRef = collection(db, 'tour_item');
            const tourSnapshot = await getDocs(tourRef);
            const fetchedTours = [];
            tourSnapshot.forEach((doc) => {
              fetchedTours.push({
                id: doc.id,
                data: doc.data(),
              });
            });
            // const matched_Places = fetchedTours.filter((tour) => tour?.data?.country === place || tour?.data?.city === place);
            
            let splittedPlace = place.split(/[ ,]+/).map(word => word.toLowerCase());

// Function to preprocess country names
          // Function to preprocess country names
            function preprocessCountry(country) {
              switch (country.toLowerCase()) {
                  case 'united states':
                  case 'usa':
                      return 'usa';
                  case 'united kingdom':
                  case 'uk':
                      return 'uk';
                  case 'china':
                  case 'cn':
                      return 'cn';
                  case 'india':
                  case 'in':
                      return 'in';
                  default:
                      return country.toLowerCase();
              }
            }

            function checkMatch(fetchedTours, input) {
              let splitted = input.split(/[ ,]+/).map(word => word.toLowerCase());
              let singleWordInput = input.toLowerCase();
              let matches = [];
              for (let tour of fetchedTours) {
                  let cityLowerCase = tour.data.city.toLowerCase();
                  let countryLowerCase = preprocessCountry(tour.data.country);

                  let cityWords = cityLowerCase.split(' ');
                  let countryWords = countryLowerCase.split(' ');

                  
                  let cityMatch = cityWords.some(word => splitted.includes(word));
                  let countryMatch = countryWords.some(word => splitted.includes(word));
                  
                  if (cityMatch || countryMatch || cityLowerCase === input || countryLowerCase === input || singleWordInput === cityLowerCase || singleWordInput === countryLowerCase) {
                      matches.push(tour);
                  }

                  for (let i = 0; i < splitted.length - 1; i++) {
                      let pair = splitted[i] + ' ' + splitted[i + 1];
                      if (cityWords.includes(pair) || countryWords.includes(pair)) {
                          matches.push(tour);
                      }
                  }
                  const matched_Places = fetchedTours.filter((tour) => tour?.data?.country.toLowerCase() === input.toLowerCase() || tour?.data?.city.toLowerCase() === input.toLowerCase());
                  if(matched_Places.length > 0){
                      matches = [...matched_Places];
                  }
              }
              return matches;
            }


            const getTourPlaces = checkMatch(fetchedTours, place);

            setParkLocations(fetchedTours);
            setMatchedPlaces(getTourPlaces);
      } catch (error) {
          console.log("Error ::: "+error)
      }finally{
          setLoading(false)
      }
  }

  useEffect(()=>{
    getPlace()
  },[]);


  if(loading){
    return <Loading />
  }

  return isLoaded ? (
    <>
    <div className='overflow-hidden'>
      <div>
       
               {
                isLoaded && (
                  <>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={start}
                        zoom={5}
                        onLoad={(map)=>{setMap(map)}}
                        options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        zoomControl: false
                        }}
                    >
                       <div className='relative  mt-1 z-20  w-[60px]  '>
                            <button className="" onClick={()=> map.panTo(start)}><img className='rounded-full' src={direction} alt=''/></button>
                          </div>
                          {
                            parkLocations && (
                              parkLocations?.map((single, i)=>(
                                <MarkerF  onMouseOver={() => { handleShowHover(i) }}
                                onMouseOut={() => { setShowHover(false) }}
                                 onClick={()=>{handleShowData(i)}} 
                                 key={i} 
                                 position={{lat: parseFloat(single.data.latitude), lng: parseFloat(single.data.longitude)}}>
                                  {
                                    showData && (index === i) && (
                                      <OverlayViewF
                                      position={{lat: parseFloat(single.data.latitude), lng: parseFloat(single.data.longitude)}}
                                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                      
                                    >
                                      <Link to={`/singletour/${single.id}`} className='bg-white h-[160px] w-full grid justify-center rounded-xl  relative z-20'>
                                        <div className='h-[90px] w-[170px] flex justify-end rounded border-4 shadow-2xl absolute' 
                                        style={{
                                          backgroundImage: `url(${single.data.steps[0].image_url})`,
                                          // Custom styling here (size, background position, etc.)
                                          width: '200px', // Example styling
                                          height: '80%',
                                          backgroundSize: 'cover', // Ensure image fills the container
                                        }}
                                        >
                                        </div>
                                        <div className=' z-50 absolute bottom-7 left-0 pl-2 h-10 bg-white flex flex-col justify-center'>
                                            <p className='font-bold text-sm block'>{single.data.title}</p>
                                            <p className='font-bold text-gray-500 h-6 w-[170px] block'>{single.data.description}</p>
                                        </div>
                                      </Link>
                                    </OverlayViewF>
                                    )
                                  }
                                  {
                                    showHover && (indexh === i) && (
                                      <OverlayViewF
                                      
                                      position={{lat: parseFloat(single.data.latitude), lng: parseFloat(single.data.longitude)}}
                                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                      
                                    >
                                      <div className='bg-white h-[36px] -mt-20 w-full rounded grid justify-center p-2  relative z-20'>
                                        <div className='text-sm font-medium'>{single.data.title}</div>
                                      </div>
                                    </OverlayViewF>
                                    )
                                  }
                                </MarkerF>
                              ))
                            )
                          }
                    </GoogleMap>
                  </>
                )
               } 
        </div>
    </div>
      </>
    ) : <></>;
};

export default MapComponent