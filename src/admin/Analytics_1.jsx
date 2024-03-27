import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

const Analytics = () => {

  const auth = getAuth()
  const [tours, setTours] = useState("")
  const [publish, setPublish] = useState("")

  const getTours=async()=>{
    try {
      const q = query(collection(db, "draft_tour"), where("owner_id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      let total = querySnapshot.docs.length
      setTours(total)
    } catch (error) {
      console.log(error)
    }
  }

  const getPublished=async()=>{
    try {
      const q = query(collection(db, "tour_item"), where("owner_id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      let total = querySnapshot.docs.length
      setPublish(total)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getTours()
    getPublished()
  },[])

  return (
    <>
        <div className=" px-5 pb-5  bg-gray-200 h-[91.5%]">
        <div className="text-black font-bold text-xl pb-3">Analytics</div>
            <div className=" bg-white border shadow-lg rounded-2xl h-[94%] w-full overflow-y-auto p-3">
                <div className="flex justify-between w-full px-20 py-10 text-white font-medium">
                  <div className="grid text-center items-center px-20 py-14 bg-sky-700 rounded-2xl hover:bg-sky-900 hover:duration-700">
                    <div>Drafted Tours</div>
                    <div>{tours}</div>
                  </div>
                  <div className="grid text-center items-center px-20 py-14 bg-sky-700 rounded-2xl hover:bg-sky-900 hover:duration-700">
                    <div>Published Tours</div>
                    <div>{publish}</div>
                  </div>
                  <div className="px-20 py-14 bg-sky-700 rounded-2xl hover:bg-sky-900 hover:duration-700">Total Likes</div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Analytics