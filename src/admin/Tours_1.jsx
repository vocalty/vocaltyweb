import { getAuth, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import editlogo from "../assets/edit.png"
import deletelogo from "../assets/delete.png"
import {useNavigate} from "react-router-dom"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import useGeoLocation from '../components/UserLocation';
import {
  setDefaults,
  geocode,
  RequestType,
} from "react-geocode";

setDefaults({
  key: process.env.REACT_APP_GOOGLE_API_KEY, // Your API key here.
  language: "en", 
});


const Tours = () => {

  const location = useGeoLocation()

  const navigate = useNavigate()
  const auth = getAuth()
  const[loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(false)
  const [current, setCurrent]= useState(null)
  const[createtour, setCreateTour] = useState(false)
  const[deletetour, setDeleteTour] = useState(false)
  const[confirmdelete, setConfirmDelete] = useState("")
  const[tours, setTours] = useState(null)
  const[tourId, setTourId] = useState(null)

  useEffect(() => {
    if (location.error) {
      toast.warning("Please Allow Location to Create Tours");
    } else if (location?.coordinates) {
      const lat = parseFloat(location.coordinates.lat);
      const lng = parseFloat(location.coordinates.lng);
    
      if (!isNaN(lat) && !isNaN(lng)) {
        setCurrent({ lat, lng });
      } else {
        console.log("Please Allow Loaction ");
      }
    } else {
      toast.warning("Error in Location");
    }
  }, [location]);

  const [userdata, setUserData] = useState({
    name: auth?.currentUser?.displayName || "",
    email: auth?.currentUser?.email || "",
    url_picture: auth?.currentUser?.photoURL || "",
  });

  let name, value;
  const postData =(e)=>{
    name = e.target.name;
    value = e.target.value;

    setUserData({...userdata, [name]:value})
  }


  const [drafttour, setDraftTour] = useState({
    title: "",
    description: "",
    tour_type: "WALK",
    tour_visibility:"Draft",
    country: "",
    city: "",
    country_code: "",
    latitude: "",
    longitude: "",
    owner_id: auth?.currentUser?.uid,
    creation_date: serverTimestamp(),
  });

  let Name, Value;
  const PostData =(e)=>{
    Name = e.target.name;
    Value = e.target.value;

    setDraftTour({...drafttour, [Name]:Value})
  }

const getAddress = async()=>{
  try {
    geocode(RequestType.LATLNG, `${current.lat},${current.lng}`, {
      location_type: "ROOFTOP", // Override location type filter for this request.
      enable_address_descriptor: true, // Include address descriptor in response.
    })
      .then(({ results }) => {
        const address = results[0].formatted_address;
        const { city, state, country } = results[0].address_components.reduce(
          (acc, component) => {
            if (component.types.includes("locality"))
              acc.city = component.long_name;
            else if (component.types.includes("administrative_area_level_1"))
              acc.state = component.long_name;
            else if (component.types.includes("country"))
              acc.country = component.long_name;
            return acc;
          },
          {}
        );
        drafttour.city = city;
        drafttour.country = country;
        drafttour.latitude = parseFloat(current.lat);
        drafttour.longitude = parseFloat(current.lng);

      })
      .catch(console.error);

  } catch (error) {
    console.log(error)
  }
}

useEffect(()=>{
  if(current){
    getAddress()
  }
},[current])



  const handleProfile= async()=>{
    if(loading) return
    setLoading(true)
    const {name} = userdata
    try {
      if(auth.currentUser.displayName !== name){
          await updateProfile(auth.currentUser, {
            displayName: name
          })
          const docRef = doc(db, "users", auth.currentUser.uid)
          await updateDoc(docRef, {
            name: name
          })
      }
      toast.success("Profile Updated!")
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  const getTours=async()=>{
    try {
      const q = query(collection(db, "draft_tour"), where("owner_id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      let tours = []
      querySnapshot.forEach((doc)=>{
        return tours.push({
          id:doc.id,
          data:doc.data(),
      })
      })
      setTours(tours)
    } catch (error) {
      console.log(error)
    }
  }


  const createTour = async(e) =>{
    e.preventDefault()
    let { title, description, tour_type, owner_id } = drafttour;
    if(title ==="" || description === "" || tour_type ==="" || (owner_id === null || owner_id === undefined || owner_id === "")){
      toast.error("Fill All fields")
      return
    }
    try {
      const res = await addDoc(collection(db, "draft_tour"), drafttour)
      toast.success("Tour Created Successfully!")
      navigate(`/admin/drafttour/${res.id}`)
    } catch (error) {
     console.log(error) 
    }finally{
      setCreateTour(false)
      getTours()
      drafttour.description = ""
      drafttour.title = ""
    }
  }


  const handleCancelTour=()=>{
    setCreateTour(false)
    drafttour.description = ""
    drafttour.title = ""
  }
  const handleDelete=(id)=>{
    setTourId(id)
    setDeleteTour(true)
  }

  const deleteTour=async()=>{
    if(confirmdelete !== "delete"){
      toast.info("Type delete to confirm")
      return
    }
    try {
      const docRef = doc(db, "draft_tour", tourId)
      const docSnap = await getDoc(docRef)
      if(docSnap.data().published_id.length > 2){
        console.log("Id existes")
        await deleteDoc(doc(db, "tour_item", docSnap.data().published_id))
        await deleteDoc(doc(db, "draft_tour", tourId))
      }else{
        console.log("No ID")
        await deleteDoc(doc(db, "draft_tour", tourId))
      }
      toast.success("Deleted")
    } catch (error) {
      console.log(error)
    }finally{
      setDeleteTour(false)
      setConfirmDelete("")
      getTours()
    }
  }

  const handleEdit =(id)=>{
    navigate(`/admin/drafttour/${id}`)
  }


  useEffect(()=>{
    getTours()
  },[])


  const handleCreateTour =()=>{
      if(current){
        setCreateTour(true)
      }else{
        toast.info("Enable locaion to create Tours")
      }
  }

  return (
    <>
      <div className=" px-5 pb-5  bg-gray-200 h-[91.5%]">
        <div className="text-black font-bold text-xl pb-3">Tours</div>
          <div className=" bg-white border shadow-lg rounded-2xl h-[94%] w-full overflow-y-auto p-3">
            <div className=' flex gap-8 '>       
                <div className='flex justify-center items-center h-24 w-28  rounded border overflow-hidden border-[#04A2D3]'>
                  <img className='h-24 w-28 rounded' src={userdata.url_picture} alt=''/>
                </div>
                <div className="grid w-full items-center">
                  <input autoComplete='none' disabled={!edit} value={userdata.name} onChange={postData} type="text" name='name' className={`py-1  pl-6 w-[400px] ${edit ? "bg-sky-100" : "bg-transparent"} rounded border border-[#04A2D3] focus:outline-none focus:border-sky-700`} placeholder="Edit Username"/>
                  <div className='flex'>
                    <div className='text-xs'>Do you want to change your username?</div>
                    <button onClick={()=>{edit && handleProfile(); setEdit(!edit)}} className='text-sm text-sky-700 font-medium ml-3'>{edit ? "Apply changes" : "Edit"}</button>
                  </div>
                </div>
                
            </div>
            <div className='w-full flex justify-center my-6'>
              <button onClick={handleCreateTour} className='py-2 px-3 bg-sky-600 text-white font-medium rounded hover:bg-sky-700 hover:duration-700'>Create Tour</button>
            </div>
            <div className='flex justify-between text-sm font-medium text-gray-800 px-10'>
              <div>Title</div>
              <div className='mr-44'>Status</div>
            </div>
            <div className=' bg-gray-50 h-[270px] w-full overflow-y-scroll'>
              {
                tours && tours.map((tour,i)=>(
                  <div key={i} className='text-sm py-2 px-5 text-gray-700 mx-5 border-b flex justify-between items-center'>
                    <div>{tour.data.title}</div>
                    <div className='flex gap-3 items-center'>
                      <div className='mr-10 px-3 py-1 hover:bg-gray-300'>{tour.data.tour_visibility}</div>
                      <button onClick={()=>handleEdit(tour.id)} className='py-1 px-3 hover:bg-gray-200'><img className='h-5 w-5' src={editlogo} alt='' /></button>
                      <button onClick={()=>handleDelete(tour.id)} className='py-1 px-3 hover:bg-gray-200'><img className='h-5 w-5' src={deletelogo} alt='' /></button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        {
          createtour &&(
          <div className='bg-black bg-opacity-50 flex justify-center items-center fixed right-0 top-0 bottom-0 left-0 z-50'>
            <div className='grid justify-center items-center bg-white h-[300px] w-[700px] py-5 rounded-lg'>
              <form onSubmit={createTour} >
              <input required autoComplete='none' value={drafttour.title} onChange={PostData} type="text" name='title' className={`py-2  pl-6 w-[550px] rounded border-2 border-[#04A2D3] focus:outline-none focus:border-sky-700`} placeholder="Tour Title"/>
              <textarea required name='description' value={drafttour.description} onChange={PostData} rows="2" className="mt-3 block p-2.5 w-full text-sm text-gray-900  rounded-lg border-2 border-[#04A2D3] focus:outline-none focus:border-sky-700" placeholder="Write short description about your tour..."></textarea>
              <div className='flex justify-end mt-3 mb-8 gap-3'>
                <div className="flex items-center">
                  <input checked type="radio" name="tour_type" onChange={PostData} value={"WALK"} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Walking</label>
                </div>
                <div className="flex items-center">
                    <input type="radio" value="DRIVE" name="tour_type" onChange={PostData} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Driving</label>
                </div>
              </div>
              <div className='flex justify-end gap-4'>
                <button onClick={handleCancelTour} className='text-gray-500 border border-gray-300 px-3 py-0.5 rounded hover:bg-gray-200' >Cancel</button>
                <button type='submit' className='text-white border border-gray-300 px-3 py-0.5 rounded bg-sky-700 hover:bg-sky-600'>Create</button>
              </div>
              </form>
            </div>
          </div>
          )   
        }
        {
          deletetour &&(
          <div className='bg-black bg-opacity-50 flex justify-center items-center fixed right-0 top-0 bottom-0 left-0 z-50'>
            <div className='grid justify-center items-center bg-white h-[200px] w-[400px] py-5 rounded-lg'>
              <div className='text-center text-gray-600'>
                Your Tour will be completely deleted! <br></br>type "delete" to confirm
              </div>
              <input required autoComplete='none' value={confirmdelete} onChange={(e)=>setConfirmDelete(e.target.value)} type="text" name='title' className={`py-2  pl-6 w-[250px] text-sm rounded border border-gray-300 focus:outline-none focus:border-gray-400`} placeholder="type Delete to confirm"/>
              <div className='flex justify-center gap-4'>
                <button onClick={()=>setDeleteTour(false)} className='text-gray-500 border border-gray-300 px-3 py-0.5 rounded hover:bg-gray-200' >Cancel</button>
                <button onClick={deleteTour} className='text-white border border-gray-300 px-3 py-0.5 rounded bg-red-600 hover:bg-red-700'>Delete</button>
              </div>
            </div>
          </div>
          )
          
        }
        <ToastContainer />
    </>
  )
}

export default Tours