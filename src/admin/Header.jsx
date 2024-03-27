import React, { useEffect } from 'react'
import menu from "../assets/menu.png"
import { getAuth } from 'firebase/auth'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Header = ({ToggleSideBar}) => {

  const auth = getAuth()
  const navigate = useNavigate()

  const Logout = async()=>{
    try {
      await auth.signOut()
      toast.info("Logged Out!")
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    if(auth.currentUser === null){
      navigate("/")
    }
  },[auth])


  return (
    <>
      <div className='h-[8.5%] flex justify-between items-center bg-white w-full px-10 py-2'>
        <div>
          <button className='h-8 w-8' onClick={ToggleSideBar}><img className='h-7 w-7' src={menu} alt="" /></button>
          
        </div>
          {/* <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
              </div>
              <input type="search"  className="block w-[400px] px-4 py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none" placeholder="Search..." required />
              <button type="submit" className="text-gray-800 text-xs font-medium absolute end-2.5 bottom-1.5 px-3 py-1 rounded border border-gray-700 hover:text-white hover:bg-gray-800">Search</button>
          </div> */}
        <div className="flex gap-6">
          <button onClick={Logout} className="text-gray-500 font-medium px-4 py-1 rounded border-2 border-gray-500 hover:text-gray-700 hover:bg-white">Logout</button>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default Header