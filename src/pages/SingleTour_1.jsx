import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import stepsAtom from '../atoms/stepsAtom';
import { GoogleMapView } from '../components';


const SingleTour = () => {

    const [steps, setSteps] = useRecoilState(stepsAtom)
    const[tour, setTour] = useState("")
    const[loading, setLoading] = useState(false)
    const {id} = useParams()

    const getTour = async()=>{
        if(loading) return
        setLoading(true)
        try {
            const docRef = doc(db, "tour_item", id)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                setTour(docSnap.data())
                setSteps(docSnap.data().steps)
            }
        } catch (error) {
            console.log("Error ::: "+error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        getTour()
    },[])

  return (
    <>
    {
        loading? 
        <Loading />
        :
        <>
        <div className='h-16 bg-sky-500 w-full'></div>
        <div className='w-full px-20 py-10 grid grid-cols-5 font-sans'> 
            <div className='col-span-3 grid items-center'>
                <div className='w-full grid text-center items-center '>
                    {tour && tour.steps && tour.steps[0] && (
                        <div className='w-full flex justify-center items-center mt-5'>
                            <img className='h-[400px]' src={tour.steps[0].image_url} alt='' />
                        </div>     
                    )}
                    <div className=' grid items-center '>
                        <GoogleMapView />
                    </div> 
                </div>
            </div>     
            <div className='col-span-2 px-10 grid items-center sticky h-screen right-0 top-0'>
                <div className='h-[400px]'>
                    <div className=' font-medium'>{tour.city}</div>
                    <div className='mt-6 text-2xl font-medium'>{tour.title}</div>
                    <div className=' text-gray-800 font-medium mt-6'><span className='text-sm text-gray-600 font-normal'>Description: </span>{tour.description}</div>
                    <div className='flex gap-20 mt-6'>
                        <div className=''><span className='text-sm text-gray-600 '>visibility: </span> {tour.tour_visibility}</div>
                        <div className=''><span className='text-sm text-gray-600'>type: </span> {tour.tour_type}</div>
                    </div>
                    <div className=' flex mt-16 mb-40 gap-10'>
                        <a rel="noreferrer" href={`https://vocalty.com/tourplayer/${id}`} className='w-[200px] border-2 border-[#04A2D3] text-sky-800 hover:bg-gray-100 font-medium py-3 rounded text-center' target='_blank'>Stream in Browser</a>
                        <a rel="noreferrer" target='_blank' href='https://play.google.com/store/apps/details?id=com.vocalty.app' className='w-[200px] border-2 border-[#04A2D3] bg-[#04A2D3] text-white text-center hover:bg-sky-700 font-medium py-3 rounded'>Open in App</a>
                    </div>
                </div>
            </div>               
        </div>
        </>
    }
    </>
  )
}

export default SingleTour