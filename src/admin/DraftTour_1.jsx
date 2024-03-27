import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer } from '@react-google-maps/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db, fbStorage } from '../firebase';
import { useParams} from "react-router-dom"
import headphonelogo from "../assets/headphone.png"
// import microphonelogo from "../assets/microphoe.png"
import imagelogo from "../assets/image.png"
import deletelogo from "../assets/delete.png"
import bluehand from "../assets/bluehand.png"
import bluemarker from "../assets/bluemarker.png"
import darkbluemarker from "../assets/darkbluemarker.png"
import whitehand from "../assets/whitehand.png"
import whitemarker from "../assets/whitemarker.png"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import markerlogo from '../assets/vocalty-logo.png'


const containerStyle = {
  width: '100%',
  height: '70vh',
  borderRadius:"10px"
};

const DraftTour = () => {

  const {id} = useParams()
  const [draft, setDraft] = useState(null)
  const [start, setStart] = useState(null)
  const [mapaction, setMapAction] = useState("hand")
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const[loading, setLoading] = useState(false)
  const[deletestep, setDeleteStep] = useState(false)
  const[updatestep, setUpdateStep] = useState(false)
  const [directionRes, setDirectionRes] = useState(null);
  const[index, setIndex] = useState(null)
  const[imgloading, setImgLoading] = useState(false)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
  });

  const [step, setStep] = useState({
    caption: "",
    audio_url: "",
    image_url: '',
    audio_duration: "",
  });

  let Name, Value;
  const PostData =(e)=>{
    Name = e.target.name;
    Value = e.target.value;

    setStep({...step, [Name]:Value})
  }

  const getDraft = async()=>{
    if(loading) return
    setLoading(true)
    try {
        const docRef = doc(db, "draft_tour", id)
        const docSnap = await getDoc(docRef)
        if(docSnap.exists()){
            setDraft(docSnap.data())
            if(docSnap.data()?.steps?.length > 0){
              setStart({lat:docSnap.data()?.steps[0]?.latitude, lng:docSnap.data()?.steps[0]?.longitude})
            }else{
              setStart({lat:docSnap.data()?.latitude, lng:docSnap.data()?.longitude})
            }     
        }
    } catch (error) {
        console.log("Error ::: "+error)
    }finally{
        setLoading(false)
        calculateRoute()
    }
  }

  const calculateRoute = async () => {
    if(draft?.steps?.length > 1){
      try {
        const directionService = new window.google.maps.DirectionsService();
    
        const waypointsCoordinates = draft?.steps?.map(step => ({
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
  }, [start]);


  const handleStepLocation = async (location) => {
    try {
      const docRef = doc(db, "draft_tour", id);
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.data();
      
      // If steps array already exists, push the new location
      if (existingData && Array.isArray(existingData.steps)) {
        existingData.steps.push({ latitude: location.lat, longitude: location.lng });
        // Update the document with the modified steps array
        await updateDoc(docRef, {
          steps: existingData.steps
        });
      } else {
        // If steps array doesn't exist, create a new array with the new location
        await updateDoc(docRef, {
          steps: [{ latitude: location.lat, longitude: location.lng }]
        });
      }
    } catch (error) {
      console.error(error);
    }finally{
      getDraft()
    }
  };

  const deleteStep = async () => {
    try {
      const docRef = doc(db, "draft_tour", id);
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.data();
  
      // If steps array already exists and the index is valid
      if (existingData && Array.isArray(existingData.steps) && index >= 0 && index < existingData.steps.length) {
        existingData.steps.splice(index, 1); // Remove the element at the specified index
        // Update the document with the modified steps array
        await updateDoc(docRef, {
          steps: existingData.steps
        });
      }else{
        console.log("index not found")
      }
    } catch (error) {
      console.log("Error ::: " + error);
    } finally {
      setDeleteStep(false)
      calculateRoute()
      getDraft()
    }
  };
  
  const updateStep = async (e) => {
    e.preventDefault()
    if (!step.image_url || !step.audio_url || !step.caption) {
      toast.info("Please Upload Image, Audio and Caption!");
      return;
    }
    if(imgloading){
      toast.warn("Image Uploading Wait..")
      return
    }
    setImgLoading(true)
    try {
      const docRef = doc(db, "draft_tour", id);
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.data();
  
      existingData.steps[index].caption = step.caption || ""
      existingData.steps[index].image_url = step.image_url || ""
      existingData.steps[index].audio_url = step.audio_url || ""
      existingData.steps[index].audio_duration = step.audio_duration || ""

      await updateDoc(docRef, existingData);
    } catch (error) {
      console.log(error);
    }finally{
      setImgLoading(false)
      setUpdateStep(false)
      getDraft()
    }
  };
  
  
  const handleDeleteStep =(i)=>{
    setIndex(i)
    setDeleteStep(true)
  }
  const handleUpdateStep=async(i)=>{
      setIndex(i)
      let audio = draft?.steps[i]?.audio_url
      let image = draft?.steps[i]?.image_url
      let caption = draft?.steps[i]?.caption
      let duration = draft?.steps[i]?.audio_duration
      setStep((prev)=>({audio_url: audio, image_url:image, caption: caption, audio_duration: duration}))
      setUpdateStep(true)
  }

  useEffect(()=>{
      getDraft()
  },[])


  const handleUpload = (e) => {

    if(imgloading){
      toast.warn("Image Already Uploading")
      return
    }
    setImgLoading(true)
    const fileName = `${draft?.steps?.[index]?.latitude}`;
    let uploadRef  
    try {
      if(e.target.id === "imgUrl"){
        uploadRef = ref(fbStorage, 'tours/images/'+fileName)
        uploadBytes(uploadRef, e.target.files[0]).then(data =>
          getDownloadURL(data.ref).then(url=>{
            setStep(prev =>({...prev, image_url: url}))
            toast.success("Image Uploaded")
          })
        )
      }
      if(e.target.id === "audio_url"){
        uploadRef = ref(fbStorage, 'tours/audio/'+fileName)
        uploadBytes(uploadRef, e.target.files[0]).then(data =>
          getDownloadURL(data.ref).then(url=>{
            setStep(prev =>({...prev, audio_url: url}))
            const objectUrl = URL.createObjectURL(e.target.files[0]) //file[0
            const audio = document.createElement("audio")
            audio.src = objectUrl
    
            audio.addEventListener("loadedmetadata", () => {
              setStep(prev =>({...prev, audio_duration: audio.duration}))
            })
            toast.success("Audio Uploaded")
          })
        )
      }
    } catch (error) {
      console.log(error)
    }finally{
      setImgLoading(false)
    }
  };


  const handleCancelUpdate =()=>{
    setUpdateStep(false)
  }

  const handlePublish = async () => {
    try {
      const updateRef = doc(db, "draft_tour", id);
      await updateDoc(updateRef, { tour_visibility:"PUBLIC"});
        const docSnap = await getDoc(updateRef)
        if(docSnap.exists()){
          const docRef = await addDoc(collection(db, "tour_item"), docSnap.data()); 
          await updateDoc(updateRef, {published_id: docRef.id});
        }
      toast.success("Tour Published! Visit the App to listen")
    } catch (error) {
      console.error("Error adding document:", error);
    }finally{
      getDraft()
    }
  };

  const handleUnPublish = async () => {
    try {
      await deleteDoc(doc(db, "tour_item", draft.published_id))
      
      const updateRef = doc(db, "draft_tour", id);
      await updateDoc(updateRef, {published_id: "", tour_visibility:"DRAFT"});

      toast.error("Tour UnPublished!")
    } catch (error) {
      console.error("Error adding document:", error);
    }finally{
      getDraft()
    }
  };

  return isLoaded ? (
    <>
    <div className=" px-5 pb-5  bg-gray-200 h-[91.5%]">
      <div className="text-black font-bold text-xl pt-3">Draft Tour</div>
        <div className=" bg-white border shadow-lg rounded-2xl h-[94%] w-full overflow-y-auto p-3">
          <div className='flex justify-between items-center h-12'>
            <div></div>
            <div className='text-xl font-medium'>{draft?.title}</div>
            <div className='flex gap-3'>
              {/* <button className='px-3 py-0.5 rounded bg-sky-600 text-sm text-white font-medium hover:bg-sky-700'>Save</button> */}
              {
                (draft?.published_id === undefined || draft?.published_id === "") ?
                <button onClick={handlePublish} className='px-3 py-1 rounded bg-sky-700 text-sm text-white font-medium hover:bg-sky-800'>Publish</button>
                :
                <button onClick={handleUnPublish} className='px-3 py-1 rounded bg-red-700 text-sm text-white font-medium hover:bg-red-800'>UnPublish</button>
              }
              
            </div>
          </div>
          <div className='grid grid-cols-3 mt-2 gap-3'>
            <div className='col-span-2 '>
              <GoogleMap
                onClick={mapaction === "marker" ? ev => handleStepLocation({
                   lat: ev.latLng.lat(),
                   lng: ev.latLng.lng()
                }): {}}   
                mapContainerStyle={containerStyle}
                center={start}
                
                zoom={15}
                onLoad={(map) => { setMap(map)}}
                options={{
                  draggableCursor: mapaction ==="marker" ? "crosshair": "",
                  streetViewControl: false,
                  mapTypeControl: false
                }}
              >
              <div className='flex relative w-[90px]  top-0 right-0 justify-end py-1'>
                <div className='flex  border-2 border-sky-700 mt-1.5 bg-white'>
                  <button onClick={()=>setMapAction("hand")} className=''>
                    {
                      mapaction ==="hand" ? 
                      <img className='h-9 w-9 bg-sky-700 p-1 ' src={whitehand} alt='' />
                      :
                      <img className='h-9 w-9 p-1' src={bluehand} alt='' />
                    }
                  </button>
                  <button onClick={()=>setMapAction("marker")}>
                    {
                      mapaction ==="marker" ? 
                      <img className='h-9 w-9 bg-sky-700 p-1' src={whitemarker} alt='' />
                      :
                      <img className='h-9 w-9 p-1' src={bluemarker} alt='' />
                    }
                  </button>
                </div>       
              </div>
              {
                draft?.steps?.length === 1 ? 
                <>
                <MarkerF position={{lat: draft?.steps[0]?.latitude, lng: draft?.steps[0]?.longitude}}></MarkerF>
                </>
                :
                draft?.steps?.length > 1 ?
                (directionRes && (
                  <>
                    <DirectionsRenderer directions={directionRes} />
                  </>
                ))
                :<></>
              }
           
              </GoogleMap>
            </div>
            <div className='col-span-1 p-1 h-[440px] overflow-y-scroll no-scrollbar space-y-2'>
              {
                (draft?.steps?.length === 0 || draft?.steps === undefined) ? 
                <div>
                  <div className='text-gray-700 text-2xl flex justify-center items-center text-center'>+Add Steps</div>
                  <div className='text-sm text-center mt-3 font-medium'>click on the location icon on the Map</div>
                </div>
                
                :<>
                {
                  draft && draft?.steps?.map((currentstep, i)=>(
                    <div key={i} className='flex justify-between shadow-lg border-2 border-b-gray-300 p-2'>
                      <div className='flex h-20 w-[25%]'>
                        <img className='h-20 w-20 ' src={currentstep?.image_url} alt=''/>
                      </div>
                      <div className='grid w-[55%]'>
                        <div className='flex justify-start items-center'>
                          <img className=' h-8 w-8' src={darkbluemarker} alt=''/>
                          <div className=' relative  text-white -top-1 -left-[19px] text-xs flex text-center'>{i+1}</div>
                        </div>
                        <div className='font-medium'>{currentstep?.caption || "No Caption"}</div>
                      </div>
                      <div className='grid gap-7 justify-end items-end w-[20%]'>
                        <div className='w-full flex justify-end'>
                          <button onClick={()=>handleDeleteStep(i)} className='px-1 w-[40px] py-0.5 flex justify-center hover:bg-gray-200'><img className='h-5 w-5' src={deletelogo} alt='' /></button>
                        </div>    
                        <button onClick={()=>handleUpdateStep(i)} className='px-3 text-xs font-medium rounded bg-sky-600 hover:bg-sky-500 py-1 text-white'>Update</button>
                      </div>
                    </div>
                  ))
                }
                </>
               
              }
            
            </div>  
          </div>
        </div>
    </div> 
    {
      deletestep && (
      <div className='bg-black bg-opacity-50 flex justify-center items-center fixed right-0 top-0 bottom-0 left-0 z-50'>
        <div className='grid justify-center items-center bg-white h-[200px] w-[400px] py-5 rounded-lg'>
          <div className='text-center text-gray-600'>
            Are you sure, you want to delete <br></br> step <span className='text-lg text-black font-medium'>"{index + 1}"</span>
          </div>
          <div className='flex justify-center gap-4'>
            <button onClick={()=>setDeleteStep(false)} className='text-gray-500 border border-gray-300 px-3 py-0.5 rounded hover:bg-gray-200' >Cancel</button>
            <button onClick={deleteStep} className='text-white border border-gray-300 px-3 py-0.5 rounded bg-red-600 hover:bg-red-700'>Delete</button>
          </div>
        </div>
      </div>
      )
      
    }
    {
      updatestep && (
      <div className='bg-black bg-opacity-50 flex justify-center items-center fixed right-0 top-0 bottom-0 left-0 z-50'>
        <form onSubmit={updateStep}>
        <div className='grid justify-center items-center bg-white h-[300px] w-[500px] py-5 rounded-lg'>
          <div className='text-center text-gray-600'>
            You are updating <br></br> step <span className='text-lg text-black font-medium'>"{index + 1}"</span>
          </div>
          <div className=''>
            <div className='flex'>
              
              <input required value={ step?.caption || ""} onChange={PostData} type="text" name='caption' className='w-[230px] rounded py-1 px-3 border-2 border-[#04A2D3] focus:outline-none focus:border-sky-700 text-sm' placeholder='caption e.g Eiffel Tower' />
              <div className='flex px-3 justify-between w-[130px]'>
                <label htmlFor="imgUrl" className=" flex justify-center w-10 h-10 hover:bg-gray-200">
                    <div className="flex justify-center items-center">
                      <img className="h-8 w-8" alt="" src={imagelogo}/>
                    </div>
                    <input 
                    onChange={(e)=>handleUpload(e)}
                    id="imgUrl" type="file" accept='image/jpeg, image/png, image/jfif' className="hidden " />
                </label>
                <label htmlFor="audio_url" className=" flex justify-center w-10 h-10 hover:bg-gray-200">
                    <div className="flex justify-center items-center">
                      <img className="h-8 w-8" alt="" src={headphonelogo}/>
                    </div>
                    <input 
                    onChange={(e)=>handleUpload(e)}
                    id="audio_url" type="file" accept='audio/mp3' className="hidden " />
                </label>
                {/* <button className='px-1 py-0.5 hover:bg-gray-200'><img className='h-8 w-8' src={microphonelogo} alt=''/></button> */}
              </div>
              
            </div>
          </div>
          <div className='h-20 w-20'>
            <img className='h-20 w-20' src={ step?.image_url || draft?.steps[index]?.image_url } alt=''/>
          </div>
          <div className='flex justify-center gap-4'>
            <button onClick={handleCancelUpdate} className='text-gray-500 border border-gray-300 px-3 py-0.5 rounded hover:bg-gray-200' >Cancel</button>
            {
              imgloading ?     
              <div className='text-white border border-gray-300 px-3 py-0.5 rounded bg-sky-400 hover:bg-sky-500'>loading..</div>
              :
              <button type='submit' className='text-white border border-gray-300 px-3 py-0.5 rounded bg-sky-600 hover:bg-sky-700'>Update</button>
            }
          </div>
        </div>
        </form>
      </div>
      )
      
    }    
    <ToastContainer />
  </>
  ) :<></>
}

export default DraftTour