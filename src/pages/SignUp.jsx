import React, { useState } from 'react'
import signup from "../assets/signup.jpg"
import showpass from "../assets/show-password.png"
import hidepass from "../assets/hide-password.png"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom'
import { OAuth } from '../components'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db } from '../firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';


const SignUp = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const[show, setShow] = useState(false)
  const [userdata, setUserData] = useState({
    name:"",
    email:"",
    password:"",
  });

  let name, value;
  const postData =(e)=>{
    name = e.target.name;
    value = e.target.value;

    setUserData({...userdata, [name]:value})
  }

  const handleSignUp = async(e)=>{
    e.preventDefault()
    if(loading) return
    setLoading(true)
    const {name, email, password} = userdata;
    try {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(auth.currentUser, {
        displayName: name
      })
      const user = userCredential.user;
      const formData = {...userdata}
      delete formData.password
      formData.timestamp =serverTimestamp()
      try {
        await setDoc(doc(db, "users", user.uid), {
          ...formData,
          id: user?.uid,
        })
      } catch (error) {
        console.log(error)
      }
      toast.success("Account Registered!")
      setTimeout(()=>{
        navigate("/")
      },500)
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong!")
    }finally{
      setLoading(false)
    }
  }

  const handleShowPassword =(e)=>{
    e.preventDefault()
    setShow(!show)
  }

  return (
    <>
      <div className='h-screen flex md:justify-around justify-center items-center bg-white px-20'>
        <div className='h-[450px] w-[450px] bg-white md:flex hidden justify-center items-center rounded-2xl border-2 border-[#04A2D3]'>
          <img className='w-full h-full' src={signup} alt=''/>
        </div>
        <div>
          <div className=' text-[#04A2D3] text-2xl text-center'>Create an Account!</div>
          <form onSubmit={handleSignUp}>
          <div className="grid gap-4 w-full mt-10">
            
            <input required autoComplete='none' value={userdata.name} onChange={postData} type="text" name='name' className="py-3  px-5 w-full bg-transparent rounded border-2 border-[#04A2D3] focus:outline-none focus:border-blue-700 md:w-[400px]" placeholder="Enter Username"/>
            <input required autoComplete='none' value={userdata.email} onChange={postData} type="email" name='email' className="py-3  px-5 w-full bg-transparent rounded border-2 border-[#04A2D3] focus:outline-none focus:border-blue-700 md:w-[400px]" placeholder="Enter your email"/>
            <div className="flex ">
              <div className='flex items-center w-ful bg-transparent rounded border-2 border-[#04A2D3]'>
                <input value={userdata.password} onChange={postData} type={show ? "text" : "password"} name='password' className="py-3 w-full px-5  focus:outline-none focus:border-blue-700 md:w-[380px]" placeholder="Password"/>
                <button onClick={handleShowPassword}>
                  {
                    show ?
                    <img className='h-5 w-5' src={showpass} alt=''/>
                    :
                    <img className='h-5 w-5' src={hidepass} alt=''/>
                  }
                  
                </button>
              </div>
            </div>
            
          </div>
          <div className='flex justify-between mt-2'>
            <div className='flex'>
              <div className='text-sm text-gray-600'>Already have an account? </div>
              <Link to="/login" className='text-sm font-medium text-[#04A2D3] ml-2'>Login</Link>
            </div>
            
          </div>
          <div className="mt-10">
            <button type='submit' className="py-2 w-full text-white font-medium rounded bg-[#04A2D3] hover:bg-white hover:text-[#04A2D3] border-2 border-[#04A2D3]" >{loading ? "loading...": "SignUp"}</button>
          </div>
          </form>
          <div className='my-5 text-black text-center font-bold'>
            <p>OR</p>
          </div>
          <OAuth />
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default SignUp