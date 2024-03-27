import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { Link } from 'react-router-dom'

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
    <div className=' flex flex-col justify-center h-[100vh] px-[30px] md:py-8 py-4  text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl  font-medium rounded-lg text-sm text-center'>
    <div className='h-16 bg-sky-500 w-full'></div>
      <h1 className='md:text-4xl text-xl text-center font-light text-white'>
        Find inspiration for your next trip
      </h1>
      {
        (!loading && tours?.length > 0) && (
          <div>
            <ul className='flex flex-wrap justify-center gap-4 py-4'>
              {
                country.map((tour, i)=>(
                
                    <Link key={i} to={`/tourcountry/${tour}`} className='text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-[200px]'>
                      {tour}
                    </Link>
                
                ))
              }
            </ul>
          </div>
        )
      }
      
    </div>
    </>
  )
}

export default Tours