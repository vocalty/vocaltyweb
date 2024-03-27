import {Navigate, Outlet} from "react-router-dom"
import {useAuthStatus} from "../hooks/useAuthStatus"
import Loading from "./Loading"
import { useEffect } from "react"
 

export default function PrivateRoute(){
    
    const {loggedIn, status} = useAuthStatus()

    if(status){
        return <Loading />
    }
    return loggedIn ? <Outlet /> : <Navigate to={"/login"} />
}