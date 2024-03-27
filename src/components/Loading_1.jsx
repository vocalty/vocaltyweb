import React from 'react'
import loading from "../assets/svg/loading-image.svg"

const Loading = () => {
  return (
    <>
    <div className='bg-black bg-opacity-50 flex justify-center items-center fixed right-0 top-0 bottom-0 left-0 z-50'>
        <div>
            <img className='h-24' src={loading} alt='Loading...'/>
        </div>
    </div>
    </>
  )
}

export default Loading