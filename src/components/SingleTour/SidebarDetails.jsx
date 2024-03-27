import { Link } from "react-router-dom";

import distacelogo from "../../assets/distance.png"
import durationlogo from "../../assets/time.png"
import startaddress from "../../assets/start-location.png"
import walking from "../../assets/walking.png"

export default function SidebarDetails({tour,id, address, distance, durationFixed}) {
    return (
        <>
        <div className='md:w-[25%] overflow-y-scroll md:flex flex-col justify-start px-[10px] pb-[10px] border-r-4 hidden'>
                                 {tour && tour.steps && tour.steps[0] && (
                                        <>
                                        <div className='w-full'>
                                            <img className='w-full rounded' src={tour.steps[0].image_url} alt='' />
                                        </div>
                                        <div>
                                            <div className='flex justify-center items-center p-1  border-2 border-black w-[100px] my-3 rounded-xl'>
                                                <div  className='px-2 flex justify-center items-center'>
                                                    <img className='h-6 w-6' src={walking} alt=''/>
                                                    <h2 className='font-bold'>{tour?.tour_type}</h2>
                                                </div> 
                                            </div>
                                            <div className='w-full grid grid-cols-3 items-start justify-center text-center pt-16'>
                                                <div className='flex flex-col items-start justify-start gap-3'>
                                                    <img className='h-12 w-12' src={startaddress} alt=''/>
                                                    <div className='text-start'>
                                                        <h2 className='text-sm text-gray-900 font-bold'>Start Point</h2>
                                                        <h2 className=' font-normal text-blue-gray-900'>{address}</h2>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col items-start justify-start gap-3'>
                                                <img className='h-12 w-12' src={distacelogo} alt='logo'/>
                                                <div className='text-start'>
                                                    <h2 className='text-sm text-gray-900 font-bold'>Distance</h2>
                                                    <h2 className=' font-normal text-blue-gray-900'>{distance} m</h2>
                                                </div>
                                                </div>
                                                <div className='flex flex-col items-start justify-start gap-3'>
                                                <img className='h-12 w-12' src={durationlogo} alt='logo'/>
                                                <div className='text-start'>
                                                        <h2 className='text-sm text-gray-900 font-bold'>Estimated Time</h2>
                                                        <h2 className=' font-normal text-blue-gray-900'>{durationFixed} <span className='text-sm text-gray-900 font-medium'>min</span></h2>
                                                </div>
                                                </div>
                                            </div>
                                            <div className=' pt-20'>
                                                    <h1 className='text-2xl font-medium'>{tour.city}</h1>
                                                    <h2 className='text-xl font-medium'>{tour.title}</h2>
                                                    <h2 className=' text-gray-900'><span className='text-sm text-gray-900 font-bold'>Description: </span>{tour.description}</h2>
                                                    <div className='flex'>
                                                        <div ><span className='text-sm text-gray-900 font-bold'>visibility: </span> {tour.tour_visibility}</div>
                                                        <div className=' pl-5'><span className='text-sm text-gray-900 font-bold'>type: </span> {tour.tour_type}</div>
                                                    </div>
                                                    <div className=' flex gap-3 pt-2'>
                                                        <Link to={`/tourplayer/${id}`} className='border-2 border-[#04A2D3] text-base text-sky-800 hover:bg-[#04A2D3] hover:text-white transition ease-in-out p-3 rounded text-center'>Stream in Browser</Link>
                                                        <a rel="noreferrer" target='_blank' href='https://play.google.com/store/apps/details?id=com.vocalty.app' className='border-2 border-[#04A2D3] bg-[#04A2D3] text-base text-sky-800 hover:bg-transparent hover:text-sky-800 transition ease-in-out p-3 rounded text-center'>Open in App</a>
                                                    </div>
                                            </div>
                                        </div>
                                        </>
                                  )}
                            </div>
        </>
    );
}