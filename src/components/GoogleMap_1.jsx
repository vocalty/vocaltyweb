import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer,  } from '@react-google-maps/api';
import direction from "../assets/direction.png";
import like from "../assets/like.png"
import distacelogo from "../assets/distance.png"
import durationlogo from "../assets/time.png"
import startaddress from "../assets/start-location.png"
import walking from "../assets/walking.png"
import { useRecoilState } from 'recoil';
import stepsAtom from '../atoms/stepsAtom';

const containerStyle = {
  width: '100%',
  height: '70vh'
};

const GoogleMapView = () => {

  const [steps, setSteps] = useRecoilState(stepsAtom)
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionRes, setDirectionRes] = useState(null);
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [start, setStart] = useState(null);
  const [address, setAddress] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
  });


  useEffect(() => {
    if (steps && steps.length >= 1) {
      setStart({
        lat: steps[0]?.latitude,
        lng: steps[0]?.longitude
      });
    }
  }, []);


  const calculateRoute = async () => {
    if(isLoaded && steps?.length > 1){
      try {
        const directionService = new window.google.maps.DirectionsService();
    
        const waypointsCoordinates = steps.map(step => ({
          location: { lat: step.latitude, lng: step.longitude }
        }));
    
        const request = {
          origin: waypointsCoordinates[0].location, // Starting point
          destination: waypointsCoordinates[waypointsCoordinates.length - 1].location, // Destination
          waypoints: waypointsCoordinates.slice(1, -1), // Intermediate waypoints
          travelMode: window.google.maps.TravelMode.WALKING
        };
    
        const res = await directionService.route(request);
    
        if (res?.status === 'OK') {
          // Handle the directions response here
          // For example:
          let totalDistance = 0;
          let totalTime = 0;
          setDirectionRes(res)
          res.routes.forEach(route => {
            route.legs.forEach(leg => {
              totalDistance += leg.distance.value
              totalTime += leg.duration.value
              setAddress(leg.start_address)
              });
          });
          totalTime = totalTime/60
          setDistance(totalDistance)
          setDuration(totalTime)
        } else {
          console.error('Directions request failed:', res);
        }
      } catch (error) {
        console.error('Error calculating directions:', error);
      }
    }else{
      console.log("steps less then 2")
    }
    
  };
 
  useEffect(() => {
    calculateRoute();
  }, [isLoaded, start]);

  return isLoaded ? (
    <>
    <div className='w-full justify-center gap-20'>
      <div className='w-full'>
        <div className='flex justify-center items-center p-1  border-2 border-black w-[100px] rounded-xl my-5'>
          <div  className={` px-2 flex justify-center items-center`}>
            <img className='h-6 w-6' src={walking} alt=''/>
            <div className='font-bold'>Walk</div>
          </div> 
        </div>
        <div className='w-full grid grid-cols-3 items-center justify-center text-center mt-6 mb-40'>
            <div className='flex h-12 overflow-hidden justify-center gap-3'>
              <img className='h-12 w-12' src={startaddress} alt=''/>
              <div className='text-start'>
                <div className='text-sm text-gray-700'>Start Point</div>
                <div className=' font-bold'>{address}</div>
              </div>
            </div>
            <div className='flex h-12 overflow-hidden justify-center gap-3'>
              <img className='h-12 w-12' src={distacelogo} alt=''/>
              <div className='text-start'>
                <div className='text-sm text-gray-700'>Distance</div>
                <div className=' font-bold'>{distance} m</div>
              </div>
            </div>
            <div className='flex h-12 overflow-hidden justify-center gap-3'>
              <img className='h-12 w-12' src={durationlogo} alt=''/>
              <div className='text-start'>
                <div className='text-sm text-gray-700 '>Estimated Time</div>
                <div className='flex'>
                  <div className=' font-bold w-[33px] overflow-hidden'>{duration}</div>
                  <div className='font-bold'>min</div>
                </div>
              </div>
            </div>
        </div>
      <GoogleMap
          mapContainerStyle={containerStyle}
          center={start}
          zoom={15}
          onLoad={(map) => { setMap(map); }}
          options={{
            streetViewControl: false,
            mapTypeControl: false
          }}
        >
            <div className='relative  mt-1 z-20  w-[60px]  '>
              <button className="" onClick={()=> map.panTo(start)}><img className='rounded-full' src={direction} alt=''/></button>
            </div>
              {
                steps?.length === 1 ? 
                <>
                <MarkerF position={{lat:steps[0]?.latitude, lng: steps[0]?.longitude}}></MarkerF>
                </>
                :
                steps?.length > 1 ?
                (directionRes && (
                  <>
                    <DirectionsRenderer directions={directionRes} />
                  </>
                ))
                :<></>
              }
        </GoogleMap>
   
        </div>
        <div className='w-full mt-40 '>
          {steps && steps.map((step, i) =>(
            <div className='flex justify-start items-start  gap-10 mt-10 ' key={i}>
                <div className='h-44 flex justify-center items-center  overflow-hidden w-[30%]'>
                  <img className='h-44' src={step.image_url} alt='' />
                </div>
                <div className='p-5 w-[70%]'>
                  <div className='flex justify-between w-full'>
                    <div className='text-sm text-gray-600'>Caption </div>
                    <div className='flex justify-center items-center gap-1'>
                      <img className='h-5 w-5' src={like} alt=''/>
                      <span>{step?.likes?.length}</span>
                    </div>
                  </div>
                  <div className='flex text-start font-medium'>{step.caption}</div>
                </div>      
            </div>
          ))}
        </div>
        </div>
      </>
    ) : <></>;
};

export default GoogleMapView;
