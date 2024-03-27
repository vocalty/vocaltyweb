import { getAuth, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dummyUser from "../assets/dummy-user.png"
import {useNavigate} from "react-router-dom"
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import useGeoLocation from '../components/UserLocation';
import {
  setDefaults,
  geocode,
  RequestType,
} from "react-geocode";
import { useRecoilState } from 'recoil';
import useridAtom from '../atoms/useridAtom';
import tourtypeAtom from '../atoms/tourtypeAtom';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';

setDefaults({
  key: process.env.REACT_APP_GOOGLE_API_KEY, // Your API key here.
  language: "en", 
});


const Tours = () => {

  const location = useGeoLocation()

  const navigate = useNavigate()
  const auth = getAuth()
  const [userId, setUserId] = useRecoilState(useridAtom)
  const[loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(false)
  const [current, setCurrent]= useState(null)
  const[createtour, setCreateTour] = useState(false)
  const[deletetour, setDeleteTour] = useState(false)
  const[confirmdelete, setConfirmDelete] = useState("")
  const[tourtype, setTourType] = useRecoilState(tourtypeAtom)
  const[tourId, setTourId] = useState(null)
  const [pub, setPublic] = useState(null)
  const [pri, setPrivate] = useState(null)
  const [drf, setDraft] = useState(null)
  const[visibility, setVisibility] = useState(false)
  const[index, setIndex] = useState(null)


  useEffect(() => {
    if (location.error) {
      toast.warning("Please Allow Location to Create Tours");
    } else if (location?.coordinates) {
      const lat = parseFloat(location.coordinates.lat);
      const lng = parseFloat(location.coordinates.lng);
    
      if (!isNaN(lat) && !isNaN(lng)) {
        setCurrent({ lat, lng });
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
    title_lower: "",
    description: "",
    description_lower: "",
    tour_type: "WALK",
    tour_visibility:"PUBLIC",
    country: "",
    city: "",
    country_code: "",
    latitude: "",
    longitude: "",
    owner_id: "",
    creation_date: serverTimestamp(),
  });

  let Name, Value;
  const PostData =(e)=>{
    Name = e.target.name;
    Value = e.target.value;

    setDraftTour({...drafttour, [Name]:Value})
  }

  const getAddress = async () => {
    try {
      const { results } = await geocode(RequestType.LATLNG, `${current.lat}, ${current.lng}`, {
        // location_type: "ROOFTOP",
        enable_address_descriptor: true,
      });
  
      if (results.length > 0) {
        const address = results[0].formatted_address;
        const { city, state, country } = results[0].address_components.reduce(
          (acc, component) => {
            if (component.types.includes("locality")) acc.city = component.long_name;
            else if (component.types.includes("administrative_area_level_1"))
              acc.state = component.long_name;
            else if (component.types.includes("country")) acc.country = component.long_name;
            return acc;
          },

        );
        drafttour.city = city;
        drafttour.country = country;
        drafttour.latitude = parseFloat(current.lat);
        drafttour.longitude = parseFloat(current.lng);
      } else {
        console.error("Geocoding failed: No results");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };
  

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
      const usersRef = collection(db, 'users');
      const idQuery = query(usersRef, where('id','==', auth?.currentUser?.uid));
      const userSnapshot = await getDocs(idQuery);
      let cid;
      if (!userSnapshot.empty) { // Check if there's at least one matching document
        const doc = userSnapshot.docs[0]; // Get the first (and only) document
        cid = doc.id; // Assuming the document ID is the user ID
        setUserId(cid); // Set the user ID state
      }
      const draftquery = query(collection(db, "draft_tour"), where("owner_id", "==", cid));
      const querySnapshot = await getDocs(draftquery);
      let drafttours = [];
      querySnapshot.forEach((doc) => {
          drafttours.push({
              id: doc.id,
              data: doc.data()
          });
      });
      setDraft(drafttours);

      const publicquery = query(
        collection(db, "tour_item"),
        where("owner_id", "==", cid),
        where("tour_visibility", "==", "PUBLIC")
      ); 
      const pubSnapshot = await getDocs(publicquery);
      let publictours = []
      pubSnapshot.forEach((doc)=>{
        return publictours.push({
          id:doc.id,
          data:doc.data(),
      })
      })
      setPublic(publictours)

      const privatequery = query(
        collection(db, "tour_item"),
        where("owner_id", "==", cid),
        where("tour_visibility", "==", "PRIVATE")
      ); 
      const priSnapshot = await getDocs(privatequery);
      let privatetours = []
      priSnapshot.forEach((doc)=>{
        return privatetours.push({
          id:doc.id,
          data:doc.data(),
      })
      })
      setPrivate(privatetours)

    } catch (error) {
      console.log(error)
    }
  }

  const createTour = async(e) =>{
    e.preventDefault()
    let { title, description, tour_type, latitude, longitude, city, country } = drafttour;
    if(latitude ==="" || longitude === "" || city ==="" || country === ""){
      toast.error("Please Allow Location")
      return
    }
    if(title ==="" || description === "" || tour_type ==="" ){
      toast.error("Fill All fields")
      return
    }
    drafttour.title_lower = title.toLowerCase()
    drafttour.description_lower = description.toLowerCase()
    drafttour.owner_id = userId
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
      if(tourtype === 'pub'){
        await deleteDoc(doc(db, "tour_item", tourId))
      }else{
        await deleteDoc(doc(db, "draft_tour", tourId))
      }
      toast.success("Deleted")
    } catch (error) {
      console.log(error)
    }finally{
      setDeleteTour(false)
      setConfirmDelete("")
      setTourType("")
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

  const handleVisibility =async(id, type, draft)=>{
    try {
      let updateRef
      if(draft === 'Draft'){
        updateRef = doc(db, "draft_tour", id);
      }else{
        updateRef = doc(db, "tour_item", id);
      }
      
      await updateDoc(updateRef, { tour_visibility:type});
      toast.info("Visibility Updated")
    } catch (error) {
      console.log(error)
    }finally{
      getTours()
    }
  }
  return (
    <>
      <div className=" px-5 pb-5  bg-gray-200 h-[91.5%]">
        <div className="text-light-blue-600 font-normal md:py-3 py-6 text-3xl text-center">Vocal Tour Dashboard</div>
          <div className=" bg-white border shadow-lg rounded-2xl h-[94%] w-full overflow-y-auto p-3">
            <div className=' flex md:flex-nowrap flex-wrap gap-8 md:justify-around justify-center'>       
                <div className='flex md:flex-row flex-col gap-3'>
                  <div className='relative md:h-24 md:w-24 h-14 w-14  rounded border overflow-hidden border-[#04A2D3]'>
                    <img className='h-full w-full object-cover rounded' src={userdata.url_picture ? userdata.url_picture : dummyUser} alt='user'/>
                  </div>
                  <div className="grid items-center">
                    <input autoComplete='none' disabled={!edit} value={userdata.name} onChange={postData} type="text" name='name' className={`py-1 px-5 ${edit ? "bg-blue-100" : "bg-transparent"} rounded border border-[#04A2D3] focus:outline-none focus:border-blue-700`} placeholder="Edit Username"/>
                    <div className='flex'>
                      <div className='text-xs'>Do you want to change your username?</div>
                      <button onClick={()=>{edit && handleProfile(); setEdit(!edit)}} className='text-sm text-blue-700 font-medium ml-3'>{edit ? "Apply changes" : "Edit"}</button>
                    </div>
                  </div>
                </div>
                <div className='flex flex-wrap justify-center md:gap-3 gap-1 text-white font-medium'>
                  <button className=' cursor-default md:h-20 h-12 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg md:text-sm text-[.6rem] md:px-5 px-0 md:w-[100%] w-[100px] md:py-2 py-0 text-center'>
                    <h2 className=''>Drafted Tours</h2>
                    <p className='text-white'>{drf?.length ? drf?.length : 0}</p>
                  </button>
                  <button className=' cursor-default md:h-20 h-12 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l  focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg  md:text-sm text-[.6rem] md:px-5 px-0 md:w-[100%] w-[100px] md:py-2 py-0 text-center'>
                    <h2 className=''>Published Public</h2>
                    <p className='text-white'>{pub?.length ? pub?.length : 0}</p>
                  </button>
                  <button className=' cursor-default md:h-20 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg  md:text-sm text-[.6rem] md:px-5 px-0 md:w-[100%] w-[100px] md:py-2 py-0 text-center'>
                    <h2 className=''>Published Private</h2>
                    <p className='text-white'>{pri?.length ? pri?.length : 0}</p>
                  </button>
                </div>
                <div className=' flex  '>
                  <button onClick={handleCreateTour} className='md:h-20 md:w-36 h-16 w-28 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg font-bold md:text-xl text-sm text-gray-600 rounded '>Create Tour</button>
                </div>
            </div>
            {/* Draft Table  */}
            <div className='flex justify-center mt-10'>
              <h1 className='text-white bg-gradient-to-r from-blue-500 via-blue-500 to-blue-700 hover:bg-gradient-to-br font-semibold md:text-2xl text-base px-5 py-3 rounded mb-3 text-center'>Draft Tours</h1>
            </div>
            <div className='min-h-[250px] p-2 bg-gray-300 flex flex-col justify-start overflow-y-scroll overflow-x-scroll w-full'>
                <table className='custom-scroll-css-apply w-screen text-sm font-medium text-gray-800'>
                  <thead className=' bg-gray-400 text-black'>
                    <tr>
                      <th className=''></th>
                      <th className=' text-center min-w-[8rem]'>Title</th>
                      <th className=' text-center min-w-[8rem]'>Location</th>
                      <th className=' text-center min-w-[8rem]'>Created at</th>
                      <th className=' text-center min-w-[8rem]'>Visibility</th>
                      <th className=' text-center min-w-[8rem]'>Type</th>
                      <th className=' text-center min-w-[8rem]'>Edit</th>
                    </tr>
                  </thead>
                  <tbody className='p-2 bg-gray-300 min-h-[250px] overflow-auto relative'>
                    {drf && drf.length > 0 ? (
                      drf.map((tour, i) => (
                        <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#f2f2f2]'}`}>
                          <td className='text-center'>{i + 1}</td>
                          <td className='text-center'>{tour.data.title}</td>
                          <td className='text-center'>
                            {tour?.data?.city ? tour.data.city : 'N/A'}, {tour?.data?.country ? tour?.data?.country : 'N/A'}
                          </td>
                          <td className='text-center'>
                            {new Date(tour.data.creation_date.seconds * 1000).toLocaleDateString("en-US")}
                          </td>
                          <td className='text-center'>
                            <button onClick={()=>{setVisibility(!visibility); setIndex(i)}} className=' py-1  px-3 text-center hover:bg-gray-300'>{tour.data.tour_visibility}</button>
                            {
                              visibility && index===i ?
                              <span className='grid justify-center space-y-1 z-20 '>
                                {
                                  tour.data.tour_visibility === 'PUBLIC' ?
                                  <button onClick={()=>{handleVisibility(tour.id, "PRIVATE", "Draft")}} className='hover:bg-gray-400 px-8 py-1'>Private</button>
                                  :
                                  <button onClick={()=>{handleVisibility(tour.id, "PUBLIC", "Draft")}} className='hover:bg-gray-400  px-8 py-1'>Public</button>
                                }  
                              </span>
                              :<></>
                            }
                          </td>
                          <td className='text-center'>{tour?.data?.tour_type}</td>
                          <td className='flex justify-center'>
                            <button onClick={() => {handleEdit(tour.id); setTourType('')}} className='py-1 px-3 hover:bg-gray-200'><FaEdit className=' text-blue-400'/></button>
                            <button onClick={() => {handleDelete(tour.id); setTourType('')}} className='py-1 px-3 hover:bg-gray-200'><FaTrash className=' text-red-400'/></button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className='py-5 text-sm font-bold text-gray-400 text-center'>No Published Public Data Available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>
            {/* Public Table  */}
            <div className='flex justify-center mt-10'>
              <h1 className='text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-700 hover:bg-gradient-to-br font-semibold md:text-2xl text-base px-5 py-3 rounded mb-3 text-center'>Published Public</h1>
            </div>
            <div className='min-h-[250px] p-2 bg-gray-300 flex flex-col justify-start overflow-y-scroll overflow-x-scroll w-full'>
                <table className='custom-scroll-css-apply w-screen text-sm font-medium text-gray-800'>
                  <thead className='bg-gray-400 text-black'>
                    <tr>
                      <th className=''></th>
                      <th className=' text-center min-w-[8rem]'>Title</th>
                      <th className=' text-center min-w-[8rem]'>Location</th>
                      <th className=' text-center min-w-[8rem]'>Created at</th>
                      <th className=' text-center min-w-[8rem]'>Visibility</th>
                      <th className=' text-center min-w-[8rem]'>Type</th>
                      <th className=' text-center min-w-[8rem]'>Edit</th>
                    </tr>
                  </thead>
                  <tbody className='p-2 bg-gray-300 min-h-[250px] overflow-auto relative'>
                    {pub && pub.length > 0 ? (
                      pub.map((tour, i) => (
                        <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#f2f2f2]'}`}>
                          <td className='text-center'>{i + 1}</td>
                          <td className='text-center'>{tour.data.title}</td>
                          <td className='text-center'>
                            {tour?.data?.city ? tour.data.city : 'N/A'}, {tour?.data?.country ? tour?.data?.country : 'N/A'}
                          </td>
                          <td className='text-center'>
                            {new Date(tour.data.creation_date.seconds * 1000).toLocaleDateString("en-US")}
                          </td>
                          <td className='text-center'>
                            <button onClick={() => {setVisibility(!visibility); setIndex(tour.id)}} className='py-1 px-3 hover:bg-gray-300'>{tour.data.tour_visibility}</button>
                            {visibility && index === tour.id && (
                              <span className='flex flex-col items-center'>
                                {tour.data.tour_visibility === 'PUBLIC' ? (
                                  <button onClick={() => {handleVisibility(tour.id, "PRIVATE")}} className='hover:bg-gray-400 bg-gray-500 px-4 py-1'>Private</button>
                                ) : (
                                  <button onClick={() => {handleVisibility(tour.id, "PUBLIC")}} className='hover:bg-gray-400 bg-gray-500 px-4 py-1'>Public</button>
                                )}
                              </span>
                            )}
                          </td>
                          <td className='text-center'>{tour.data.tour_type}</td>
                          <td className='flex justify-center'>
                            <button onClick={() => {handleEdit(tour.id); setTourType('pub')}} className='py-1 px-3 hover:bg-gray-200'><FaEdit className=' text-blue-400'/></button>
                            <button onClick={() => {handleDelete(tour.id); setTourType('pub')}} className='py-1 px-3 hover:bg-gray-200'><FaTrash className=' text-red-400'/></button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className='py-5 text-sm font-bold text-gray-400 text-center'>No Published Public Data Available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>
            {/* Private table  */}
            <div className='flex justify-center mt-10'>
              <h1 className='text-white bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 hover:bg-gradient-to-br font-semibold md:text-2xl text-base px-5 py-3 rounded mb-3 text-center'>Published Private</h1>
            </div>
            <div className='min-h-[250px] p-2 bg-gray-300 flex flex-col justify-start overflow-y-scroll overflow-x-scroll w-full'>
                <table className='custom-scroll-css-apply w-screen text-sm font-medium text-gray-800'>
                  <thead className=' bg-gray-400 text-black'>
                    <tr>
                      <th className=''></th>
                      <th className=' text-center min-w-[8rem]'>Title</th>
                      <th className=' text-center min-w-[8rem]'>Location</th>
                      <th className=' text-center min-w-[8rem]'>Created at</th>
                      <th className=' text-center min-w-[8rem]'>Visibility</th>
                      <th className=' text-center min-w-[8rem]'>Type</th>
                      <th className=' text-center min-w-[8rem]'>Edit</th>
                    </tr>
                  </thead>
                  <tbody className='p-2 bg-gray-300 min-h-[250px] overflow-auto relative'>
                    {pri && pri.length > 0 ? (
                      pri.map((tour, i) => (
                        <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#f2f2f2]'}`}>
                          <td className='text-center'>{i + 1}</td>
                          <td className='text-center'>{tour.data.title}</td>
                          <td className='text-center'>
                            {tour?.data?.city ? tour.data.city : 'N/A'}, {tour?.data?.country ? tour?.data?.country : 'N/A'}
                          </td>
                          <td className='text-center'>
                            {new Date(tour.data.creation_date.seconds * 1000).toLocaleDateString("en-US")}
                          </td>
                          <td className='text-center'>
                            <button onClick={() => {setVisibility(!visibility); setIndex(tour.id)}} className='py-1 px-3 hover:bg-gray-300'>{tour.data.tour_visibility}</button>
                            {visibility && index === tour.id && (
                              <span className='flex flex-col items-center'>
                                {tour.data.tour_visibility === 'PUBLIC' ? (
                                  <button onClick={() => {handleVisibility(tour.id, "PRIVATE")}} className='hover:bg-gray-400 bg-gray-500 px-4 py-1'>Private</button>
                                ) : (
                                  <button onClick={() => {handleVisibility(tour.id, "PUBLIC")}} className='hover:bg-gray-400 bg-gray-500 px-4 py-1'>Public</button>
                                )}
                              </span>
                            )}
                          </td>
                          <td className='text-center'>{tour.data.tour_type}</td>
                          <td className='flex justify-center'>
                            <button onClick={() => {handleEdit(tour.id); setTourType('pub')}} className='py-1 px-3 hover:bg-gray-200'><FaEdit className=' text-blue-400'/></button>
                            <button onClick={() => {handleDelete(tour.id); setTourType('pub')}} className='py-1 px-3 hover:bg-gray-200'><FaTrash className=' text-red-400'/></button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className='py-5 text-sm font-bold text-gray-400 text-center'>No Published Public Data Available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>
          </div>
        </div>
        {
          createtour &&(
          <div className='bg-black bg-opacity-50 flex justify-center items-center fixed right-0 top-0 bottom-0 left-0 z-50'>
            <div className='grid justify-center items-center bg-white  md:p-10 p-5 rounded-lg w-[80%] md:w-[40%]'>
              <form onSubmit={createTour} className='md:w-[400px]  w-full' >
              <input required autoComplete='none' value={drafttour.title} onChange={PostData} type="text" name='title' className={`py-2 px-5 w-full rounded border-2 border-[#04A2D3] focus:outline-none focus:border-blue-700`} placeholder="Tour Title"/>
              <textarea required name='description' value={drafttour.description} onChange={PostData} rows="2" className="mt-3 block p-2.5 w-full text-sm text-gray-900  rounded-lg border-2 border-[#04A2D3] focus:outline-none focus:border-blue-700" placeholder="Write short description about your tour..."></textarea>
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
                <button type='submit' className='text-white border border-Blue-700 px-3 py-0.5 rounded bg-blue-700 hover:bg-blue-600'>Create</button>
              </div>
              </form>
            </div>
          </div>
          )   
        }
        {
          deletetour &&(
          <div className='bg-black bg-opacity-50 flex justify-center items-center fixed right-0 top-0 bottom-0 left-0 z-50'>
            <div className='grid justify-center items-center bg-white md:h-[200px] h-[150px] md:w-[400px] w-[350px] py-5 rounded-lg'>
              <div className='text-center text-gray-600'>
                Your Tour will be completely deleted! <br></br>type "delete" to confirm
              </div>
              <input required autoComplete='none' value={confirmdelete} onChange={(e)=>setConfirmDelete(e.target.value)} type="text" name='title' className={`py-2  pl-6 w-[250px] text-sm rounded border border-gray-300 focus:outline-none focus:border-gray-400`} placeholder="type Delete to confirm"/>
              <div className='flex justify-center gap-4 py-2'>
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