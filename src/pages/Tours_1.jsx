import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { Link } from 'react-router-dom'
import countryimg from "../assets/country3.jpg"

const Tours = () => {

const[loading, setLoading] = useState(false)
const[tours, setTours] = useState(null)
const[country, setCountry] = useState(null)

  const getTours =async()=>{
    if(loading) return
    setLoading(true)
    try {
      const tourRef = collection(db, "tour_item")
      const q = query(tourRef, orderBy("tour_visibility", "asc"), orderBy("creation_date", "desc"), orderBy("__name__", "desc"))
      const tourSnapshot = await getDocs(q)
      let tours = []
      tourSnapshot.forEach((doc)=>{
        return tours.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setTours(tours)
      const country = Array.from(
        new Set(tours.map((tour) => tour.data.country))
      ).filter(Boolean); // This removes any undefined or falsy values
        setCountry(country)
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    getTours()
  },[])



  return (
    <>
    <div className='h-16 bg-sky-500 w-full'></div>
    <div className='grid justify-center text-center w-full'>
    <div className=' grid grid-cols-3 justify-center items-center text-[#04A2D3]'>
      <img className='col-span-2' src={countryimg} alt=''/>
      <div className='text-4xl font-medium text-start border-b-4 w-[300px] leading-tight border-[#04A2D3]'>
        Self-Guided Audio Tours
        Explore at your own pace, on your schedule.
      </div>
      
    </div>
    <div className='max-w-6xl px-3 mx-auto h-screen grid justify-center items-center pb-40'>
      <div className='text-4xl font-medium text-[#04A2D3]'>
        Find inspiration for your next trip
      </div>
      {
        (!loading && tours?.length > 0) && (
          <>
            <ul className='grid grid-cols-3  px-20 gap-5'>
              {
                country.map((tour, i)=>(
                
                    <Link key={i} to={`/tourcountry/${tour}`} className='bg-[#0787AE] hover:bg-white border-2 border-[#0787AE] text-white hover:text-[#0787AE] hover:duration-700  py-4 px-5 rounded'>
                      <div className=' font-medium'>{tour}</div>
                    </Link>
                
                ))
              }
            </ul>
          </>
        )
      }
    </div>
    </div>
    </>
  )
}

export default Tours