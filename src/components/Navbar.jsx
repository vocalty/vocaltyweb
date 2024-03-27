import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const Navbar = () => {

  // const [toggle, setToggle] = useState(false);
  const auth = getAuth()
  const {loggedIn, status} = useAuthStatus()
  const location = useLocation()
  const [pagestate, setPageState] = useState("Login")

  const pathMatch = (route)=>{
    if(route === location.pathname){
        return true
    }
  }
  useEffect(()=>{
      onAuthStateChanged(auth, (user)=>{
        if(user){
          setPageState("Profile")
        }else{
          setPageState("Login")
        }
      })
  },[auth])

  return (
    <>
      <div className='w-full flex justify-center items-center'>
        <div className='w-[90%] fixed top-2 mx-10 bg-white/20 backdrop-filter backdrop-blur-xl flex z-40 text-white rounded-[30px] py-2 items-center justify-center'>
          <div className="flex-shrink-0 w-[50%] flex pl-20">
            <div className="flex items-center sm:ml-10 text-xl md:text-2xl font-bold ">
              <Link to={"/"} className="text-white">VOCALTY</Link>
            </div>
          </div>
          <div className="hidden md:flex w-[50%] justify-around items-center" >
              <div className='flex '>
                <Link to={"/tours"}><span className={`${pathMatch("/tours") ? " border-b-2 text-sky-800 border-sky-700" : ""}  px-3 lg:px-4 py-1  font-medium`}>Country Tour</span></Link>
                <Link className='mx-3' to={"/becomecreator"}><span className={`${pathMatch("/becomecreator") ? " border-b-2 text-sky-800 border-sky-700" : " "} px-1 lg:px-2  py-1   font-medium`}>Become Creator</span></Link>
              </div>
              {
                pagestate === "Profile" ? 
                <Link to={"/profile"}><span className={`${pathMatch("/profile") ? " border-b-2 text-sky-800" : ""}  px-3 lg:px-4 py-1  font-medium`}>Profile</span></Link>
                :
                // <Link to={"/login"} className=' px-3 py-1 font-bold bg-white text-[#04A2D3] rounded hover:bg-[#04A2D3] border hover:border-white hover:text-white'>Login</Link>
                <></>
              }
          </div>
              {/* <span onClick={() => setToggle(!toggle)} className="md:hidden">
                {toggle ? (
                  <img className="h-8 w-8" alt="" src={menu}/>
                ) : (
                  <img className="h-8 w-8" src={menu} alt="" />
                )}
              </span> */}
        {/* {
          toggle && (
          <div className="z-20  absolute md:hidden top-[60px] left-[10px] rounded-lg bg-green-700">
              <div className=" items-center sm:px-3">
              <Link to={'/'}><span className="text-white hover:text-black block px-3 py-2 rounded-md  text-sm sm:text-base font-medium">Home</span></Link>
              <Link to={'/ground'}><span className="text-white hover:text-black block px-3 py-2 rounded-md text-sm sm:text-base font-medium">Grounds</span></Link>
              <Link to={'/teams'}><span className="text-white hover:text-black block px-3 py-2 rounded-md text-sm sm:text-base font-medium">Teams</span></Link>
              <Link to={'/player'}><span className="text-white hover:text-black block px-3 py-2 rounded-md text-sm sm:text-base font-medium">Players</span></Link>
            </div>
            <div className="px-4 py-3 border-t border-gray-700">
            { user
              ?
              <button onClick={handleLogout} className="flex justify-center gap-2 text-white font-semibold bg-yellow-500 px-3 py-2 rounded text-sm">Logout<img className="h-3 w-3 mt-1" src={logout} alt=""/></button>
              :
              <Link to={'/Login'}><span className="text-white bg-yellow-500 hover:bg-indigo-600 block px-4 py-2 rounded-md text-sm sm:text-base font-medium contact-button">Login</span></Link>
            }
            </div>
          </div>
          )
        } */}
        </div>
      </div>
      
    </>
  )
}

export default Navbar