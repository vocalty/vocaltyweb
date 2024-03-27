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
  height: '90vh'
};

const GoogleMapView = ({setAddress, setDistance, setDuration }) => {

  const [steps, setSteps] = useRecoilState(stepsAtom)
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionRes, setDirectionRes] = useState(null);
  const [start, setStart] = useState(null);

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
      <div className='md:w-[75%] w-full relative flex items-start'>
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
                <div className='absolute top-3 left-2 z-20  w-[60px]  '>
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
      </>
    ) : <></>;
};

export default GoogleMapView;
