import React from 'react'
import analytics from "../assets/analytics.png"
import location from "../assets/start-location.png"
import { Link } from 'react-router-dom'

const SideBar = () => {
  return (
    <>
    <div className="bg-white text-black font-medium  h-full py-10">
        <div className="flex pl-6 pr-10">
            <div className="flex text-3xl text-sky-700 font-bold gap-4">
                Vocalty
            </div>
        </div>
        <div className="py-16">
            <ul className="space-y-4 text-gray-800">
                <li>
                   <Link to={"/admin/analytics"} className='flex gap-4 hover:bg-sky-100 px-6 py-2 rounded'><img className="h-6 w-6" alt="" src={analytics}/> Analytics</Link>
                </li>
                <li>
                   <Link to={"/admin/tours"} className='flex gap-4 hover:bg-sky-100 px-6 py-2 rounded'><img className="h-6 w-6" src={location} alt=''/> Tours</Link>
                </li>
            </ul>
        </div>
        </div>
    </>
  )
}

export default SideBar