import { getAuth, updateProfile } from 'firebase/auth';
import React, { useContext, useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logout from "../assets/sign-out.png"
import userDummyImg from "../assets/dummy-user.png"
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SearchPlaceContext } from '../context/SearchPlaceProvider';

const Profile = () => {
  const {setIsLoggedIn} = useContext(SearchPlaceContext)
  const auth = getAuth()
  const navigate = useNavigate()
  const[loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(false)
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

  const Logout =()=>{
    auth.signOut()
    toast.info("Logged Out!");
    setIsLoggedIn(false);
    navigate("/login");
  }

  const onSubmit= async()=>{
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

  return (
    <>
      <div className='h-16 w-full'></div>
      <div className='h-[80vh] flex items-center justify-center  w-full md:px-30 px-20'>
        <div className='border p-4 bg-gray-50 rounded-md shadow-lg'>
          <div className='md:text-4xl text-2xl font-medium text-blue-700'>Profile</div>
          <div>
            <div className='flex justify-center items-center md:h-32 h-20 w-20 md:w-32 mt-10 rounded-full border-2   overflow-hidden border-[#04A2D3]'>
              <img className='h-full w-full rounded-full' src={userdata.url_picture ? userdata.url_picture : userDummyImg} alt='user'/>
            </div>
            <div className="grid w-full mt-5">
              <input autoComplete='none' disabled={!edit} value={userdata.name} onChange={postData} type="text" name='name' className={`py-3 w-full px-5 ${edit ? "bg-blue-100" : "bg-transparent"} rounded border-2 border-[#04A2D3] focus:outline-none focus:border-blue-700`} placeholder="Edit Username"/>
            </div>
            <div className="grid w-full mt-5">
              <input autoComplete='none' value={userdata.email} onChange={postData} type="email" name='email' className="py-3 px-5 bg-transparent rounded border-2 border-[#04A2D3] focus:outline-none focus:border-blue-700" placeholder="Change Email"/>
            </div>
          </div>
          <div className='flex flex-wrap justify-center gap-4 mt-5'>
            <div className='flex'>
              <h3 className='text-xs'>Do you want to change your username?</h3>
              <button onClick={()=>{edit && onSubmit(); setEdit(!edit)}} className='text-sm text-blue-700 font-medium ml-3'>{edit ? "Apply changes" : "Edit"}</button>
            </div>
              <button className='flex p-2 font-medium text-sm justify-center items-center border-2 border-black rounded py-1 gap-2' onClick={Logout}>
              <img className='h-4 w-4' src={logout} alt=''/>
              Log Out</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default Profile