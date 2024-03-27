import { Outlet, useNavigate} from "react-router-dom"
import {useAuthStatus} from "../hooks/useAuthStatus"
import Loading from "./Loading"
import { useContext } from "react";
import { SearchPlaceContext } from "../context/SearchPlaceProvider";
 

export default function PrivateRoute(){
    const navigate = useNavigate();
    const {setIsLoggedIn} = useContext(SearchPlaceContext)
    const {loggedIn, status} = useAuthStatus();

    if(status){
        return <Loading />
    }
    if (loggedIn) {
        setIsLoggedIn(true)
    }else{
        setIsLoggedIn(false)
    }
    return loggedIn ? <Outlet /> : navigate("/login", {replace: true});
}