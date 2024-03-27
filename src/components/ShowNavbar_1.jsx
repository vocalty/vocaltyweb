import React, { useEffect, useState } from 'react'
import {useLocation} from "react-router-dom"

const ShowNavbar = ({children}) => {

    const location = useLocation()
    const[navbar, setNavbar] = useState(false)

    useEffect(()=>{
        if( location.pathname.split("/")[1] === "admin" || location.pathname.split("/")[1] === "tourplayer"){
            setNavbar(false)
        }else{
            setNavbar(true)
        }

    },[location])

  return (
    <>
        { navbar && children}
    </>
  )
}

export default ShowNavbar