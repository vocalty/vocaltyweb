import React, { useEffect, useRef, useState } from 'react'
import { MdAudiotrack } from "react-icons/md";
import { MdArrowBackIosNew } from "react-icons/md";
import { GoogleMap, useJsApiLoader, DirectionsRenderer, MarkerF } from '@react-google-maps/api';
import direction from "../assets/direction.png";
import pause from "../assets/pause.png"
import play from "../assets/continue.png"
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import AudioPlayer from '../components/TourPlayer/AudioPlayer'

const containerStyle = {
  width: '100%',
  height: '92vh'
};

const TourPlayer = () => {

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionRes, setDirectionRes] = useState(null);
  const [start, setStart] = useState(null);
  const [audioplay, setAudioPlay] = useState(false);
  const [audio, setAudio] = useState(null);
  const [steps, setSteps] = useState([]);


  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
  });

  const[loading, setLoading] = useState(false)
  const {id} = useParams()

  const getTour = async()=>{
      if(loading) return
      setLoading(true)
      try {
          const docRef = doc(db, "tour_item", id)
          const docSnap = await getDoc(docRef)
          if(docSnap.exists()){
              let data = docSnap.data()?.steps
              setSteps(data)
              // setAudio(data?.steps[0]?.audio_url)
              setStart({
                lat: docSnap.data()?.steps[0]?.latitude,
                lng: docSnap.data()?.steps[0]?.longitude
              });
          }
      } catch (error) {
          console.log("Error ::: "+error)
      }finally{
          setLoading(false)
      }
  }

  useEffect(()=>{
    getTour()
  },[])


  const calculateRoute = async () => {
    if(isLoaded && steps?.length > 1){
      
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
          setDirectionRes(res)
        }
    }else{
      console.log("Steps less than 2")
    }
  };
 
  useEffect(() => {
    calculateRoute();
  }, [isLoaded, steps]);
 

  
  const handleAudio = (i) => {
    setIndex(i);
    setAudioPlay(true);
    setTimeout(() => {
      handlePlay();
    }, 100);
  };
  const[showPlayList, setShowPlayList] = useState(false)
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [index, setIndex] = useState(0);

  const handleSeek = (e) => {
    audioRef.current.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };
  
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const handlePlay = () => {
      audioRef.current.play();
      setIsPlaying(true);
  };
  
  const handlePause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };
  
  const handlePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };
  
  const formatDuration = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    const formattedSec = seconds.toString().padStart(2, "0");
    return `${minutes}:${formattedSec}`;
  };
  
  useEffect(() => { 
    
      if(isPlaying){
          const handleAudioEnd = () => {
          setIsPlaying(false);
          setCurrentTime(0);
          const nextAudioIndex = index + 1;
          if (nextAudioIndex < steps.length) {
            handleAudio(nextAudioIndex);
          }
        }
        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.addEventListener('ended', handleAudioEnd);
        return () => {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('ended', handleAudioEnd);
        };
      }
  }, [audioRef, isPlaying]);
  
  const handleForward = () => {
    audioRef.current.currentTime += 10;
    setCurrentTime(audioRef.current.currentTime);
  };
  
  const handleBackward = () => {
    audioRef.current.currentTime -= 10;
    setCurrentTime(audioRef.current.currentTime);
  };
  


  if(loading){
    return <Loading />
  }

  
  return isLoaded ? (
    <>
    <div className='h-screen overflow-hidden border-b'>
    <div className='h-[80px] bg-sky-500 w-full'></div>
      <div className='w-full grid md:grid-cols-3 grid-col gap-1 overflow-hidden relative'>
          <div className='w-full col-span-2'>
            <div className='grid grid-cols w-full relative'>
              <React.Fragment>
                {
                  audioplay && (
                    <AudioPlayer
                      formatDuration={formatDuration} 
                      steps={steps} 
                      index={index} 
                      handleAudio={handleAudio} 
                      handleForward={handleForward} 
                      handleBackward={handleBackward} 
                      handlePlayPause={handlePlayPause} 
                      handleSeek={handleSeek} 
                      isPlaying={isPlaying} 
                      currentTime={currentTime} 
                      duration={duration} 
                      audioRef={audioRef} />
                  )
                }
              </React.Fragment>
              <div className={`${audioplay ? ""  : ""}`}>
               {
                steps && (
                  <>
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
                      <div className='relative m-1 w-[60px] z-20 '>
                        <button className="" onClick={()=> map.panTo(start)}><img className='rounded-full' src={direction} alt=''/></button>
                      </div>
                      {
                        steps?.length === 1 ? 
                        <>
                        <MarkerF position={{lat: steps[0]?.latitude, lng: steps[0]?.longitude}}></MarkerF>
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
                  </>
                )
               } 
              </div>
            </div>
          </div>
          <div className='w-full h-[100vh] col-span-1 overflow-y-scroll  pb-20 border-2 md:block hidden'>
            {/* <AudioPlayList steps={steps} handleAudio={handleAudio} index={index} /> */}
            {steps && steps.map((step, i) =>{
                return(
                  <div className={`${ index === i ? "bg-gray-200" : ""} flex justify-start items-start mt-2  hover:bg-gray-100 border`} key={i}>
                    <div className='h-28 flex justify-center items-center  overflow-hidden w-[40%]'>
                      <img className='h-28' src={step.image_url} alt='' />
                    </div>
                    <div className='grid p-2 w-[60%]'>
                      <div className='flex'>
                        <div className='font-medium'>{i+1 }. </div>
                        <div className='flex text-start font-medium'> {step.caption}</div>
                      </div>
                      <div >
                        {
                            isPlaying && index === i ?
                            <div onClick={handlePlayPause} className='flex justify-start'>
                                <button className='flex justify-center items-center h-10 w-10 rounded-full border-2 border-[#04A2D3] hover:bg-sky-100 bg-white font-medium hover:bg- mt-3'>
                                    <img className='h-5 w-5' src={pause} alt='' />
                                </button>
                            </div>
                            :
                            <div className='flex justify-start'>
                                <button onClick={()=>handleAudio(i)} className='flex justify-center items-center h-10 w-10 rounded-full border-2 border-[#04A2D3] bg-white hover:bg-sky-100 font-medium hover:bg- mt-3'>
                                    <img className='h-5 w-5' src={play} alt='' />
                                </button>
                            </div>
                        }
                    </div>
                    </div>      
                  </div>
                )
              })}
          </div>
          <div className={`${showPlayList ? "block" : "hidden"} md:hidden absolute overflow-auto h-[50vh] rounded-br-3xl top-0 left-0 bg-white z-50`}>
            {steps && steps.map((step, i) =>{
                      return(
                      <div className={`${ index === i ? "bg-gray-200" : ""} flex justify-start items-start mt-2  hover:bg-gray-100 border`} key={i}>
                          <div className='h-28 flex justify-center items-center  overflow-hidden w-[40%]'>
                          <img className='h-28' src={step.image_url} alt='' />
                          </div>
                          <div className='grid p-2 w-[60%]'>
                          <div className='flex'>
                              <div className='font-medium'>{i+1 }. </div>
                              <div className='flex text-start font-medium'> {step.caption}</div>
                          </div>
                          <div >
                              {
                                  isPlaying && index === i ?
                                  <div onClick={handlePlayPause} className='flex justify-start'>
                                      <button className='flex justify-center items-center h-10 w-10 rounded-full border-2 border-[#04A2D3] hover:bg-sky-100 bg-white font-medium hover:bg- mt-3'>
                                          <img className='h-5 w-5' src={pause} alt='' />
                                      </button>
                                  </div>
                                  :
                                  <div className='flex justify-start'>
                                      <button onClick={()=>handleAudio(i)} className='flex justify-center items-center h-10 w-10 rounded-full border-2 border-[#04A2D3] bg-white hover:bg-sky-100 font-medium hover:bg- mt-3'>
                                          <img className='h-5 w-5' src={play} alt='' />
                                      </button>
                                  </div>
                              }
                          </div>
                          </div>      
                      </div>
                      )
              })}
          </div>
          <button onClick={()=> setShowPlayList(!showPlayList)} className='bg-light-blue-500 absolute md:hidden top-14 right-2 h-12 w-12 border-4 border-gray-100 shadow-xl rounded-full flex justify-center items-center z-50' type="button">
            { showPlayList ? <MdArrowBackIosNew className='text-xl text-white' /> : <MdAudiotrack className='text-xl text-white' />}
          </button>
        </div>
    
    </div>
      </>
    ) : <></>;
};

export default TourPlayer