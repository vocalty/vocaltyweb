import React, { useState } from 'react'
import forget from "../assets/forget-password.jpg"
import { Link } from 'react-router-dom'
import { OAuth } from '../components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';



const ForgetPassword = () => {

  const[loading, setLoading] = useState(false)
  const [userdata, setUserData] = useState({
    email:"",
  });

  let name, value;
  const postData =(e)=>{
    name = e.target.name;
    value = e.target.value;

    setUserData({...userdata, [name]:value})
  }

  const handleForget = async(e)=>{
    e.preventDefault()
    if(loading) return
    setLoading(true)
    const{email} = userdata
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email)
        toast.success("Email Sent!")
    } catch (error) {
      console.log(error)
      toast.error("Wrong Credential!")
    }finally{
      setLoading(false)
    }
  }

  return (
    <>
      <div className='h-screen flex justify-around items-center bg-white px-20'>
        <div className='h-[450px] w-[450px] bg-white flex justify-center items-center rounded-2xl border-2 border-[#04A2D3]'>
          <img className='h-[350px] w-[350px] rounded-lg' src={forget} alt=''/>
        </div>
        <div>
          <div className=' text-[#04A2D3] text-2xl text-center'>Forget Password</div>
          <form onSubmit={handleForget}>
            <div className="grid w-full mt-10">
              <input autoComplete='none' value={userdata.email} onChange={postData} type="text" name='email' className="py-3  pl-6 w-[400px] bg-transparent rounded border-2 border-[#04A2D3] focus:outline-none focus:border-sky-700" placeholder="Enter your email"/>
            </div>
            <div className='flex justify-between mt-2'>
              <div className='flex'>
                <div className='text-sm text-gray-600'>Don't have an account? </div>
                <Link to={"/signup"} className='text-sm font-medium text-[#04A2D3] ml-2'>Register</Link>
              </div>
              <Link to={"/login"} className='text-sm  text-[#04A2D3]'>Login instead</Link>
            </div>
            <div className="mt-10">
              <button type='submit' className="py-2 w-[400px] text-white font-medium rounded bg-[#04A2D3] hover:bg-white hover:text-[#04A2D3] border-2 border-[#04A2D3]" >{loading?"loading...":"Send Reset Password"}</button>
            </div>
          </form>
          <div className='my-5 text-[#04A2D3]'>
            ----------------------------- OR -----------------------------
          </div>
          <OAuth />
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default ForgetPassword