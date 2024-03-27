import { DirectionsRenderer, GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { GoSidebarExpand } from "react-icons/go";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRecoilState } from 'recoil';
import backbutton from '../assets/backbutton.png';
import bluehand from "../assets/bluehand.png";
import bluemarker from "../assets/bluemarker.png";
import darkbluemarker from "../assets/darkbluemarker.png";
import deletelogo from "../assets/delete.png";
import headphonelogo from "../assets/headphone.png";
import imagelogo from "../assets/image.png";
import updown from '../assets/updownarrow.png';
import markerlogo from '../assets/vocalty-logo.png';
import whitehand from "../assets/whitehand.png";
import whitemarker from "../assets/whitemarker.png";
import tourtypeAtom from '../atoms/tourtypeAtom';
import { db, fbStorage } from '../firebase';

const containerStyle = {
  width: '100%',
  height: '70vh',
  borderRadius: "10px"
};

const DraftTour = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const [tourtype, setTourType] = useRecoilState(tourtypeAtom)
  const [draft, setDraft] = useState(null)
  const [start, setStart] = useState(null)
  const [mapaction, setMapAction] = useState("hand")
  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [loading, setLoading] = useState(false)
  const [deletestep, setDeleteStep] = useState(false)
  const [updatestep, setUpdateStep] = useState(false)
  const [directionRes, setDirectionRes] = useState(null);
  const [index, setIndex] = useState(null)
  const [time, setTime] = useState([])
  const [imgloading, setImgLoading] = useState(false)
  const [title, setTitle] = useState(false)
  const [titledata, setTitleData] = useState("")
  const [showStep, setShowStep] = useState(false);
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
  const PostData = (e) => {
    Name = e.target.name;
    Value = e.target.value;

    setStep({ ...step, [Name]: Value })
  }

  const getDraft = async () => {
    if (loading) return
    setLoading(true)
    try {
      let docRef
      if (tourtype === 'pub') {
        docRef = doc(db, "tour_item", id)
      } else {
        docRef = doc(db, "draft_tour", id)
      }

      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setDraft(docSnap.data())
        setTitleData(docSnap.data().title)
        if (docSnap.data()?.steps?.length > 0) {
          setStart({ lat: docSnap.data()?.steps[0]?.latitude, lng: docSnap.data()?.steps[0]?.longitude })
        } else {
          setStart({ lat: docSnap.data()?.latitude, lng: docSnap.data()?.longitude })
        }
      }
    } catch (error) {
      console.log("Error ::: " + error)
    } finally {
      setLoading(false)
      calculateRoute()
    }
  }

  const calculateRoute = async () => {
    if (draft?.steps?.length > 1) {
      try {
        const directionService = new window.google.maps.DirectionsService();

        const waypointsCoordinates = draft?.steps?.map(step => ({
          location: { lat: step.latitude, lng: step.longitude }
        }));

        let res
        if (draft.tour_type === 'WALK') {
          const request = {
            origin: waypointsCoordinates[0].location, // Starting point
            destination: waypointsCoordinates[waypointsCoordinates.length - 1].location, // Destination
            waypoints: waypointsCoordinates.slice(1, -1), // Intermediate waypoints
            travelMode: window.google.maps.TravelMode.WALKING
          };
          res = await directionService.route(request);
        } else {
          const request = {
            origin: waypointsCoordinates[0].location, // Starting point
            destination: waypointsCoordinates[waypointsCoordinates.length - 1].location, // Destination
            waypoints: waypointsCoordinates.slice(1, -1), // Intermediate waypoints
            travelMode: window.google.maps.TravelMode.DRIVING
          };
          res = await directionService.route(request);
        }

        let time = []
        if (res?.status === 'OK') {
          setDirectionRes(res)
          res.routes.forEach(route => {
            route.legs.forEach(leg => {
              time.push(leg.duration.value / 60)
            });
          });
          setTime(time)
        } else {
          console.error('Directions request failed:', res);
        }
      } catch (error) {
        console.error('Error calculating directions:', error);
      }
    } else {
      console.log("steps less then 2")
    }
  };

  useEffect(() => {
    calculateRoute();
  }, [start]);

  const handleStepLocation = async (location) => {
    let city, country;
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`);
      if (!response.ok) {
        throw new Error('Failed to fetch place information');
      }
      const data = await response.json();
      if (data.status === 'OK') {
        // Extract place name, country, etc. from the response
        const addressComponents = data.results[0].address_components;
        city = addressComponents.find(
          component => component.types.includes('locality')
        ).long_name;
        country = addressComponents.find(
          component => component.types.includes('country')
        ).long_name;
      } else {
        throw new Error('No results found');
      }
      let docRef;
      if (tourtype === 'pub') {
        docRef = doc(db, "tour_item", id)
      } else {
        docRef = doc(db, "draft_tour", id)
      }
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.data();
      // If steps array already exists, push the new location
      if (existingData && Array.isArray(existingData.steps) && existingData.steps.length > 0) {
        existingData.steps.push({ latitude: location.lat, longitude: location.lng });
        // Update the document with the modified steps array
        await updateDoc(docRef, {
          steps: existingData.steps
        });
      } else {
        await updateDoc(docRef, {
          ...docSnap.data(),
          city: city,
          country: country,
          latitude: location.lat,
          longitude: location.lng,
          steps: [{ latitude: location.lat, longitude: location.lng }]
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      getDraft()
    }
  };

  const deleteStep = async () => {
    try {
      let docRef
      if (tourtype === 'pub') {
        docRef = doc(db, "tour_item", id)
      } else {
        docRef = doc(db, "draft_tour", id)
      }
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.data();

      // If steps array already exists and the index is valid
      if (existingData && Array.isArray(existingData.steps) && index >= 0 && index < existingData.steps.length) {
        existingData.steps.splice(index, 1); // Remove the element at the specified index
        // Update the document with the modified steps array
        await updateDoc(docRef, {
          steps: existingData.steps
        });
      } else {
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

    if (imgloading) {
      toast.warn("Image or Audio Uploading Wait..")
      return
    }

    try {
      let docRef
      if (tourtype === 'pub') {
        docRef = doc(db, "tour_item", id)
      } else {
        docRef = doc(db, "draft_tour", id)
      }
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.data();
      existingData.steps[index].caption = step.caption || ""
      existingData.steps[index].image_url = step.image_url || ""
      existingData.steps[index].audio_url = step.audio_url || ""
      existingData.steps[index].audio_duration = step.audio_duration || ""

      await updateDoc(docRef, existingData);
    } catch (error) {
      console.log(error);
    } finally {
      setUpdateStep(false)
      getDraft()
    }
  };


  const handleDeleteStep = (i) => {
    setIndex(i)
    setDeleteStep(true)
  }
  const handleUpdateStep = async (i) => {
    setIndex(i)
    let audio = draft?.steps[i]?.audio_url
    let image = draft?.steps[i]?.image_url
    let caption = draft?.steps[i]?.caption
    let duration = draft?.steps[i]?.audio_duration
    setStep((prev) => ({ audio_url: audio, image_url: image, caption: caption, audio_duration: duration }))
    setUpdateStep(true)
  }

  useEffect(() => {
    getDraft()
  }, [])


  const handleUpload = (e) => {

    if (imgloading) {
      toast.warn("Image Already Uploading")
      return
    }
    setImgLoading(true)
    const fileName = `${draft?.steps?.[index]?.latitude}`;
    let uploadRef
    try {
      if (e.target.id === "imgUrl") {
        uploadRef = ref(fbStorage, 'tours/images/' + fileName)
        uploadBytes(uploadRef, e.target.files[0]).then(data =>
          getDownloadURL(data.ref).then(url => {
            setStep(prev => ({ ...prev, image_url: url }))
            toast.success("Image Uploaded")
          })
        )
      }
      if (e.target.id === "audio_url") {
        uploadRef = ref(fbStorage, 'tours/audio/' + fileName)
        uploadBytes(uploadRef, e.target.files[0]).then(data =>
          getDownloadURL(data.ref).then(url => {
            setStep(prev => ({ ...prev, audio_url: url }))
            const objectUrl = URL.createObjectURL(e.target.files[0]) //file[0
            const audio = document.createElement("audio")
            audio.src = objectUrl

            audio.addEventListener("loadedmetadata", () => {
              setStep(prev => ({ ...prev, audio_duration: audio.duration }))
            })
            toast.success("Audio Uploaded")
          })
        )
      }
    } catch (error) {
      console.log(error)
    } finally {
      setImgLoading(false)
    }
  };


  const handleCancelUpdate = () => {
    setUpdateStep(false)
  }

  const handlePublish = async () => {
    try {
      const updateRef = doc(db, "draft_tour", id);
      await updateDoc(updateRef, { tour_visibility: "PUBLIC" });
      const docSnap = await getDoc(updateRef)
      if (docSnap.exists()) {
        const docRef = await addDoc(collection(db, "tour_item"), docSnap.data());
        await deleteDoc(doc(db, "draft_tour", id))
      }
      toast.success("Tour Published! Visit the App to listen")
      setTimeout(() => {
        navigate('/admin/tours')
      }, 500)

    } catch (error) {
      console.error("Error adding document:", error);
    } finally {
      getDraft()
    }
  };

  const handleUnPublish = async () => {
    try {
      const updateRef = doc(db, "tour_item", id);
      const docSnap = await getDoc(updateRef)
      if (docSnap.exists()) {
        const docRef = await addDoc(collection(db, "draft_tour"), docSnap.data());
        await deleteDoc(doc(db, "tour_item", id))
      }
      toast.error("Tour UnPublished!")
      setTimeout(() => {
        navigate('/admin/tours')
      }, 500)
    } catch (error) {
      console.error("Error adding document:", error);
    } finally {
      getDraft()
    }
  };

  const handleTitle = async () => {
    if (loading) return
    setLoading(true)

    try {
      let docRef
      if (tourtype === 'pub') {
        docRef = doc(db, "tour_item", id)
      } else {
        docRef = doc(db, "draft_tour", id)
      }
      await updateDoc(docRef, { title: titledata, title_lower: titledata.toLowerCase() });
      toast.success("Title Updated!")
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return isLoaded ? (
    <>
      <div className=" px-5 pb-5  bg-gray-200 h-[91.5%]">
        <div className="text-black font-bold text-xl pt-3">Draft Tour</div>
        <div className=" bg-white border shadow-lg rounded-2xl h-[94%] w-full overflow-y-auto p-3">
          <div className='flex gap-2 justify-between items-center h-12'>
            <Link to={'/admin/tours'}><img className='h-10 w-10' src={backbutton} alt='' /></Link>
            <div className='flex flex-wrap text-xl font-medium'>
              <input autoComplete='none' disabled={!title} value={titledata} onChange={e => setTitleData(e.target.value)} type="text" name='name' className={`py-1 text-center w-auto ${title ? "bg-blue-100" : "bg-transparent"} rounded border-2 border-[#04A2D3] focus:outline-none focus:border-blue-700`} placeholder="Title" />
              <button onClick={() => { title && handleTitle(); setTitle(!title) }} className='text-sm text-blue-700 font-medium ml-3'>{title ? "Apply" : "Edit"}</button>
            </div>
          </div>
          <div className='grid md:grid-cols-3 grid-cols-1 mt-2 gap-3 relative'>
            <button onClick={() => setShowStep(!showStep)} className='md:hidden block right-2 top-16 p-2 z-40 absolute bg-white border shadow-lg'><GoSidebarExpand className='text-2xl' /></button>
            <div className='md:col-span-2 '>
              <GoogleMap
                onClick={mapaction === "marker" ? ev => handleStepLocation({
                  lat: ev.latLng.lat(),
                  lng: ev.latLng.lng(),
                  data: ev,
                }) : {}}
                mapContainerStyle={containerStyle}
                center={start}

                zoom={15}
                onLoad={(map) => { setMap(map) }}
                options={{
                  draggableCursor: mapaction === "marker" ? `url(${markerlogo}) 25 50, crosshair` : "",
                  streetViewControl: false,
                  mapTypeControl: false
                }}
              >
                <div className='flex relative w-[90px]  top-0 right-0 justify-end py-1'>
                  <div className='flex  border-2 border-blue-700 mt-1.5 bg-white'>
                    <button onClick={() => setMapAction("hand")} className=''>
                      {
                        mapaction === "hand" ?
                          <img className='h-9 w-9 bg-blue-700 p-1 ' src={whitehand} alt='' />
                          :
                          <img className='h-9 w-9 p-1' src={bluehand} alt='' />
                      }
                    </button>
                    <button onClick={() => setMapAction("marker")}>
                      {
                        mapaction === "marker" ?
                          <img className='h-9 w-9 bg-blue-700 p-1' src={whitemarker} alt='' />
                          :
                          <img className='h-9 w-9 p-1' src={bluemarker} alt='' />
                      }
                    </button>
                  </div>
                </div>
                {
                  draft?.steps?.length === 1 ?
                    <>
                      <MarkerF position={{ lat: draft?.steps[0]?.latitude, lng: draft?.steps[0]?.longitude }}></MarkerF>
                    </>
                    :
                    draft?.steps?.length > 1 ?
                      (directionRes && (
                        <>
                          <DirectionsRenderer directions={directionRes} />
                        </>
                      ))
                      : <></>
                }

              </GoogleMap>
            </div>
            <div className={`${showStep ? "block" : "hidden"} md:block z-50 md:relative absolute right-0 bg-white px-2  col-span-1 p-1 md:h-[60vh] h-[480px] overflow-y-scroll no-scrollbar space-y-2`}>
              <div className='flex md:justify-end justify-between gap-3'>
                <button onClick={() => setShowStep(!showStep)}><IoIosCloseCircleOutline className='md:hidden block text-2xl text-blue-500' /></button>
                {
                  (tourtype !== 'pub') ?
                    <button onClick={handlePublish} className='px-3 py-1 rounded bg-blue-700 text-sm text-white font-medium hover:bg-blue-800'>Publish</button>
                    :
                    <button onClick={handleUnPublish} className='px-3 py-1 rounded bg-red-700 text-sm text-white font-medium hover:bg-red-800'>UnPublish</button>
                }
              </div>
              {
                (draft?.steps?.length === 0 || draft?.steps === undefined) ?
                  <div>
                    <div className='text-gray-700 text-2xl flex justify-center items-center text-center'>+Add Steps</div>
                    <div className='text-sm text-center mt-3 font-medium'>click on the location icon on the Map</div>
                  </div>

                  : <>
                    {
                      draft && draft?.steps?.map((currentstep, i) => (
                        <div key={i}>
                          <div className='flex justify-between shadow-lg border-2 border-b-gray-300 p-2'>
                            <div className='flex h-20 w-20'>
                              <img className='w-full h-full ' src={currentstep?.image_url} alt='' />
                            </div>
                            <div className='w-[100%]'>
                              <div className='flex md:flex-row flex-col text-sm text-gray-500'>
                                <div className='flex justify-start items-center'>
                                  <img className=' h-8 w-8' src={darkbluemarker} alt='' />
                                  <div className=' relative  text-white -top-1 -left-[19px] text-xs flex text-center'>{i + 1}</div>
                                </div>
                                <p className='font-normal md:pl-0 pl-3'>{currentstep?.caption || "No Caption"}</p>
                              </div>
                            </div>
                            <div className='flex  justify-end items-end w-[20%]'>
                              <div className='w-full flex justify-end'>
                                <button onClick={() => handleDeleteStep(i)} className='px-1 w-[40px] py-0.5 flex justify-center hover:bg-gray-200'><img className='h-5 w-5' src={deletelogo} alt='' /></button>
                              </div>
                              <button onClick={() => handleUpdateStep(i)} className='px-3 text-xs font-medium rounded bg-blue-600 hover:bg-blue-500 py-1 text-white'>Update</button>
                            </div>
                          </div>
                          {
                            i !== draft.steps.length - 1 ?
                              <div className='flex w-full justify-center items-center bg-blue-600 text-white font-medium'>
                                <img className='h-5 w-8 ' src={updown} alt='' />
                                <div className='flex whitespace-nowrap max-w-[30px] overflow-hidden'>{time[i] || 0} </div>
                                <div> min</div>
                              </div>
                              : <></>
                          }
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
                <button onClick={() => setDeleteStep(false)} className='text-gray-500 border border-gray-300 px-3 py-0.5 rounded hover:bg-gray-200' >Cancel</button>
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
              <div className='grid justify-center items-center bg-white md:h-[300px] md:w-[500px] p-5 rounded-lg'>
                <div className='text-center text-gray-600'>
                  You are updating <br></br> step <span className='text-lg text-black font-medium'>"{index + 1}"</span>
                </div>
                <div className=''>
                  <div className='flex flex-wrap'>
                    <input required value={step?.caption || ""} onChange={PostData} type="text" name='caption' className='md:w-[230px] w-full rounded py-1 px-3 border-2 border-[#04A2D3] focus:outline-none focus:border-blue-700 text-sm' placeholder='caption e.g Eiffel Tower' />
                    <div className='flex px-3 py-2 justify-between md:w-[130px]'>
                      <label htmlFor="imgUrl" className=" flex justify-center w-10 h-10 hover:bg-gray-200">
                        <div className="flex justify-center items-center h-8 w-8">
                          <img className="w-full h-full" alt="" src={imagelogo} />
                        </div>
                        <input
                          onChange={(e) => handleUpload(e)}
                          id="imgUrl" type="file" accept='image/jpeg, image/png, image/jfif' className="hidden " />
                      </label>
                      <label htmlFor="audio_url" className=" flex justify-center w-10 h-10 hover:bg-gray-200">
                        <div className="flex justify-center items-center h-8 w-8">
                          <img className="h-full w-full" alt="" src={headphonelogo} />
                        </div>
                        <input
                          onChange={(e) => handleUpload(e)}
                          id="audio_url" type="file" accept='audio/mp3' className="hidden " />
                      </label>
                      {/* <button className='px-1 py-0.5 hover:bg-gray-200'><img className='h-8 w-8' src={microphonelogo} alt=''/></button> */}
                    </div>

                  </div>
                </div>
                <div className='md:h-20 md:w-20 h-16 w-16'>
                  <img className='w-full h-full' src={step?.image_url || draft?.steps[index]?.image_url} alt='' />
                </div>
                <div className='flex justify-center gap-4 py-2'>
                  <button onClick={handleCancelUpdate} className='text-gray-500 border border-gray-300 px-3 py-0.5 rounded hover:bg-gray-200' >Cancel</button>
                  {
                    imgloading ?
                      <div className='text-white border border-gray-300 px-3 py-0.5 rounded bg-blue-400 hover:bg-blue-500'>loading..</div>
                      :
                      <button type='submit' className='text-white border border-gray-300 px-3 py-0.5 rounded bg-blue-600 hover:bg-blue-700'>Update</button>
                  }
                </div>
              </div>
            </form>
          </div>
        )

      }
      <ToastContainer />
    </>
  ) : <></>
}

export default DraftTour