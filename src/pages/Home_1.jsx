import React, { useEffect, useState } from "react";
import bgsky from "../assets/bg-sky.png";
import explore from "../assets/explore.jpg";
import tourImg from "../assets/Tour.jpg";
import circle from "../assets/circle.png";
import donut from "../assets/donut.png";
import Loading from "../components/Loading";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  OverlayViewF,
  OverlayView,
} from "@react-google-maps/api";
import direction from "../assets/direction.png";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import useGeoLocation from "../components/UserLocation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import Banner from "../components/Home/Banner";
import Favourite from "../components/Home/Favourite";

const containerStyle = {
  width: "90%",
  height: "90vh",
};

const Home = () => {

return(
    <>
        {/* <Banner />
        <Favourite />
        <ToastContainer /> */}
    </>
  )
};

export default Home;
