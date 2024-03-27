import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Tour = ({tour, id}) => {

  return (
    <>
      <Link to={`/singletour/${id}`} className='h-[170px] w-[250px] bg-[#04A2D]  group border overflow-hidden  opacity-100 transition ease-in-out delay-150 hover:-translate-y-2 hover:scale-110  duration-700 hover:opacity-100'>
        <img className='absolute h-[170px] w-[250px] ' src={tour.steps[0].image_url} alt=''/>
        <div className="relative -top-6  flex text-center justify-center items-center hover:duration-500 group-hover:bg-black/50 bg-black/30 h-[170px] w-[250px]">
          <h1 className="text-white font-semibold text-2xl"> {tour.title} </h1>
        </div>
      </Link>
    </>
  )
}

export default Tour