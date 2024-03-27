import React, { useEffect, useState } from 'react'
import { FaMapSigns } from "react-icons/fa";
import Loading from '../components/Loading'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import stepsAtom from '../atoms/stepsAtom';
import { GoogleMapView } from '../components';
// File,images 
import SidebarDetails from './../components/SingleTour/SidebarDetails';
import SidebarDetailsResponsive from './../components/SingleTour/SidebarDetailsResponsive';

const SingleTour = () => {

    const [steps, setSteps] = useRecoilState(stepsAtom);
    const [tour, setTour] = useState("");
    const [loading, setLoading] = useState(false);
    const [address,setAddress] = useState(null);
    const [distance,setDistance] = useState(0);
    const [duration,setDuration] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const { id } = useParams()
    const durationFixed = duration.toFixed(2);
    const getTour = async () => {
        if (loading) return
        setLoading(true)
        try {
            const docRef = doc(db, "tour_item", id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setTour(docSnap.data())
                setSteps(docSnap.data().steps)
            }
        } catch (error) {
            console.log("Error ::: " + error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getTour()
    }, [])

    return (
        <>
            {
                loading ?
                    <Loading />
                    :
                    <>
                        <div className='h-[9vh] bg-sky-500 w-full'></div>
                        <div className='h-[91vh] w-full flex md:justify-end justify-center font-sans md:px-[15px] px-0 overflow-hidden relative'>
                            <SidebarDetails tour={tour} id={id} address={address} distance={distance} durationFixed={durationFixed} />
                            <SidebarDetailsResponsive showDetails={showDetails} tour={tour} id={id} address={address} distance={distance} durationFixed={durationFixed}/>
                            <GoogleMapView showDetails={showDetails} setAddress={setAddress} setDistance={setDistance} setDuration={setDuration}/>
                            <button onClick={() => setShowDetails(!showDetails)} className='md:hidden absolute right-5 top-20 h-12 w-12 rounded-full bg-white border-4 border-gray-400 shadow-xl flex justify-center items-center' type="button"><FaMapSigns /></button>
                        </div>
                    </>
            }
        </>
    )
}

export default SingleTour