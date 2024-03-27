import { getAuth, updateProfile } from 'firebase/auth';
import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logout from "../assets/sign-out.png"
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Profile = () => {

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
    toast.info("Logged Out!")
    navigate("/")
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
      <div className='h-16 bg-sky-500 w-full'></div>
      <div className='h-screen grid justify-center mt-20 w-full'>
        <div className='w-[50%]'>
          <div className='text-4xl font-medium text-sky-700'>Profile</div>
          <div>
            <div className='flex justify-center items-center h-32 w-32 mt-10 rounded-full border-2   overflow-hidden border-[#04A2D3]'>
              <img className='h-32 w-32 rounded-full' src={userdata.url_picture} alt=''/>
            </div>
            <div className="grid w-full mt-5">
              <input autoComplete='none' disabled={!edit} value={userdata.name} onChange={postData} type="text" name='name' className={`py-3  pl-6 w-[400px] ${edit ? "bg-sky-100" : "bg-transparent"} rounded border-2 border-[#04A2D3] focus:outline-none focus:border-sky-700`} placeholder="Edit Username"/>
            </div>
            <div className="grid w-full mt-5">
              <input autoComplete='none' value={userdata.email} onChange={postData} type="email" name='email' className="py-3  pl-6 w-[400px] bg-transparent rounded border-2 border-[#04A2D3] focus:outline-none focus:border-sky-700" placeholder="Change Email"/>
            </div>
          </div>
          <div className='flex justify-between items-center w-[400px] mt-5'>
            <div className='flex'>
              <div className='text-xs'>Do you want to change your username?</div>
              <button onClick={()=>{edit && onSubmit(); setEdit(!edit)}} className='text-sm text-sky-700 font-medium ml-3'>{edit ? "Apply changes" : "Edit"}</button>
            </div>
            <button className='flex font-medium text-sm justify-center items-center border-2 border-black rounded py-1 px-2' onClick={Logout}>
              <img className='mr-1 h-4 w-4' src={logout} alt=''/>
              Log Out</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default Profile