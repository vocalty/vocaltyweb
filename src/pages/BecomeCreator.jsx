import React from 'react'
import becomecreator from "../assets/become-creator.jpg"
import { Link } from 'react-router-dom'

const BecomeCreator = () => {
  return (
    <>
    <div className='grid justify-center text-center w-full'>
      <div className=' grid grid-cols-3 justify-center items-center text-[#04A2D3]'>
        <img className='col-span-3' src={becomecreator} alt=''/>
        <div className='absolute z-10 bottom-0 right-[480px] -mb-32 text-4xl font-bold text-start border-b-4 w-[300px] leading-tight border-[#04A2D3]'>
          Publish your own
          Vocal Experiences
        </div>
        
      </div>
      <div className='max-w-6xl px-3 mx-auto h-screen grid justify-center items-center pb-40'>
        <div className='text-4xl font-medium text-[#04A2D3]'>
          Become a Creator to spread Inspiration
        </div>
        <div className='flex justify-center items-center'>
          <a href={`https://vocalty.com/admin/analytics`} rel="noreferrer" target='_blank' className='px-10 py-4 border-2 border-[#04A2D3] hover:bg-[#04A2D3] text-[#04A2D3] text-lg font-medium rounded hover:text-white hover:duration-700'>
            Become Creator
          </a>
        </div>
       
      </div>
    </div>
    </>
  )
}

export default BecomeCreator