import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer, Polyline } from '@react-google-maps/api';
import direction from "../assets/direction.png";
import like from "../assets/like.png"
import distacelogo from "../assets/distance.png"
import durationlogo from "../assets/time.png"
import startaddress from "../assets/start-location.png"
import walking from "../assets/walking.png"
import cycling from "../assets/cycling.png"
import driving from "../assets/driving.png"
import vocalty from "../assets/vocalty-logo.png"
import { useRecoilState } from 'recoil';
import stepsAtom from '../atoms/stepsAtom';

const containerStyle = {
  width: '100%',
  height: '70vh'
};

const MapReplica = () => {

  const [steps, setSteps] = useRecoilState(stepsAtom)
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionRes, setDirectionRes] = useState(null);
  const [distance, setDistance] = useState('')
  const [path, setPath] = useState([])
  const [duration, setDuration] = useState('')
  const [walktype, setWalkType] = useState("WALKING")
  const [start, setStart] = useState(null);
  const [address, setAddress] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
  });

  const someCoords= [
    {lat: steps[0]?.latitude, lng: steps[0]?.longitude},
    {lat: steps[1]?.latitude, lng: steps[1]?.longitude}
  ];


  useEffect(() => {
    if (steps && steps.length >= 1) {
      setStart({
        lat: steps[0]?.latitude,
        lng: steps[0]?.longitude
      });
    }

  }, []);

  const calculateRoute = async (type) => {
    if (!steps.length >= 2) {
      return;
    }
    try {
      let org = {lat: steps[0]?.latitude, lng: steps[0]?.longitude}
      let dest = {lat: steps[1]?.latitude, lng: steps[1]?.longitude}
      // eslint-disable-next-line no-undef
      const directionService = new window.google.maps.DirectionsService();
      if(type=== "WALKING"){
        console.log("WALKING  ::::: ")
        const res = await directionService.route({
          origin: org,
          destination: dest,
          // eslint-disable-next-line no-undef
          travelMode: window.google.maps.TravelMode.WALKING
        });
        if (res?.status === 'OK') {
          setDirectionRes(res);
          setDistance(res.routes[0].legs[0].distance.text)
          setDuration(res.routes[0].legs[0].duration.text)
          setAddress(res.routes[0].legs[0].start_address)
        } else {
          console.error('Directions request failed:', res);
        }
      }
      if(type=== "DRIVING"){
        console.log("Driving  ::::: ")
        const res = await directionService.route({
          origin: org,
          destination: dest,
          // eslint-disable-next-line no-undef
          travelMode: window.google.maps.TravelMode.DRIVING
        });
        if (res?.status === 'OK') {
          setDirectionRes(res);
          setDistance(res.routes[0].legs[0].distance.text)
          setDuration(res.routes[0].legs[0].duration.text)
          setAddress(res.routes[0].legs[0].start_address)
        } else {
          console.error('Directions request failed:', res);
        }
      }
      if(type=== "BICYCLING"){
        console.log("BICYCLING  ::::: ")
        const res = await directionService.route({
          origin: org,
          destination: dest,
          // eslint-disable-next-line no-undef
          travelMode: window.google.maps.TravelMode.BICYCLING
        });
        if (res?.status === 'OK') {
          setDirectionRes(res);
          setDistance(res.routes[0].legs[0].distance.text)
          setDuration(res.routes[0].legs[0].duration.text)
          setAddress(res.routes[0].legs[0].start_address)
        } else {
          console.error('Directions request failed:', res);
        }
      }
    
    } catch (error) {
      console.error('Error calculating directions:', error);
    }
  };

  const handleWalkType =(type)=>{
    if(type==="WALKING"){
      setWalkType(type)
      calculateRoute(type)
    }
    if(type==="BICYCLING"){
      setWalkType(type)
      calculateRoute(type)
    }
    if(type==="DRIVING"){
      setWalkType(type)
      calculateRoute(type)
    }
  }
 
  useEffect(() => {
    calculateRoute("WALKING");
  }, [start]);

  return isLoaded ? (
    <>
    <div className='w-full justify-center gap-20'>
      <div className='w-full'>
        <div className='flex justify-center items-center p-1  border-2 border-black w-[190px] rounded-xl my-5'>
          <button onClick={()=>{handleWalkType("WALKING")}} className={`${walktype === "WALKING" ? "bg-sky-300" : ""} border-r-2 px-2 border-black flex justify-center items-center`}>
            <img className='h-8 w-8' src={walking} alt=''/>
          </button> 
          <button onClick={()=>{handleWalkType("BICYCLING")}} className={`${walktype === "BICYCLING" ? "bg-sky-300" : ""} border-r-2 px-2 border-black flex justify-center items-center`}>
            <img className='h-8 w-8' src={cycling} alt=''/>
          </button> 
          <button onClick={()=>{handleWalkType("DRIVING")}} className={`${walktype === "DRIVING" ? "bg-sky-300" : ""} flex px-2 justify-center items-center`}>
            <img className='h-8 w-8' src={driving} alt=''/>
          </button>
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
                <div className=' font-bold'>{distance}</div>
              </div>
            </div>
            <div className='flex h-12 overflow-hidden justify-center gap-3'>
              <img className='h-12 w-12' src={durationlogo} alt=''/>
              <div className='text-start'>
                <div className='text-sm text-gray-700'>Estimated Time</div>
                <div className=' font-bold'>{duration}</div>
              </div>
            </div>
        </div>
      <div className='absolute top-50  -mb-36 z-20 right-[225px] bottom-0 w-full  my-3'>
        <button className="" onClick={()=> map.panTo(start)}><img className='rounded-full' src={direction} alt=''/></button>
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
          
           {steps &&
            steps.map((step, i) => (
              <MarkerF
                key={i}
                position={{ lat: step.latitude, lng: step.longitude }}
                options={{icon : vocalty}}
              />
            ))}

          {directionRes && (
            <>
              <DirectionsRenderer directions={directionRes} />
              <MarkerF  options={{icon : vocalty}} position={directionRes?.routes[0]?.legs[0]?.start_location}>
                <div className='text-xl font-bold'>Distance: {distance}</div>
              </MarkerF>
              <MarkerF  options={{icon : vocalty}} position={directionRes?.routes[0]?.legs[0]?.end_location}>
                <div className='text-xl font-bold'>Duration: {duration}</div>
              </MarkerF>
            </>
          )}
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

export default MapReplica;
