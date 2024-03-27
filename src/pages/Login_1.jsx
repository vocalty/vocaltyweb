import React, { useState } from 'react'
import login from "../assets/login.jpg"
import { Link, useNavigate } from 'react-router-dom'
import { OAuth } from '../components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import showpass from "../assets/show-password.png"
import hidepass from "../assets/hide-password.png"


const Login = () => {

  const navigate = useNavigate()
  const[loading, setLoading] = useState(false)
  const[show, setShow] = useState(false)
  const [userdata, setUserData] = useState({
    email:"",
    password:"",
  });

  let name, value;
  const postData =(e)=>{
    name = e.target.name;
    value = e.target.value;

    setUserData({...userdata, [name]:value})
  }

  const handleLogin = async(e)=>{
    e.preventDefault()
    if(loading) return
    setLoading(true)
    const{email, password} = userdata
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      if(userCredential.user){
        toast.success("Login Successful!")
      }
    } catch (error) {
      console.log(error)
      toast.error("Bad user credentials!")
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
      <div className='h-screen flex justify-around items-center bg-white px-20'>
        <div className='h-[450px] w-[450px] bg-white flex justify-center items-center rounded-2xl border-2 border-[#04A2D3]'>
          <img className='h-[430px] w-[430px]' src={login} alt=''/>
        </div>
        <div>
          <div className=' text-[#04A2D3] text-2xl text-center'>Login your Account!</div>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4 w-full mt-10">
              <input autoComplete='none' value={userdata.email} onChange={postData} type="text" name='email' className="py-3  pl-6 w-[400px] bg-transparent rounded border-2 border-[#04A2D3] focus:outline-none focus:border-sky-700" placeholder="Enter your email"/>
              <div className="flex ">
                <div className='flex items-center w-[400px] bg-transparent rounded border-2 border-[#04A2D3]'>
                  <input value={userdata.password} onChange={postData} type={show ? "text" : "password"} name='password' className="py-3 w-[360px] pl-6  focus:outline-none focus:border-sky-700" placeholder="Password"/>
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
                <div className='text-sm text-gray-600'>Don't have an account? </div>
                <Link to={"/signup"} className='text-sm font-medium text-[#04A2D3] ml-2'>Register</Link>
              </div>
              <Link to={"/forget"} className='text-sm  text-[#04A2D3]'>Forget password?</Link>
            </div>
            <div className="mt-10">
              <button type='submit' className="py-2 w-[400px] text-white font-medium rounded bg-[#04A2D3] hover:bg-white hover:text-[#04A2D3] border-2 border-[#04A2D3]" >{loading?"loading...":"Login"}</button>
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

export default Login