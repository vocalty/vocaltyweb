import { collection, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useRef } from "react";
import { Toaster, toast } from 'react-hot-toast';
import { FaLocationDot } from 'react-icons/fa6';
import Banner from "../components/Home/Banner";
import { SearchPlaceContext } from "../context/SearchPlaceProvider";
import { db } from "../firebase";
import Favorite from './../components/Home/Favorite';

const Home = () => {
  const countRef = useRef(0);
  const { setTourPlaces } = useContext(SearchPlaceContext);
  const getTours = async () => {
    try {
      const tourRef = collection(db, 'tour_item');
      const tourSnapshot = await getDocs(tourRef);
      const fetchedTours = [];
      tourSnapshot.forEach((doc) => {
        fetchedTours.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setTourPlaces(fetchedTours);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
          },
          (error) => {
            console.log(error.message);

            if (countRef.current < 1) {
              toast.error('Please allow location access to see nearby trails!', {
                duration: 3000,

                // Styling
                style: {
                  minWidth: '250px',
                  minHeight: '100px',
                  fontSize: '1.5rem',
                  color: '#FFA500',
                },

                // Custom Icon
                icon: <FaLocationDot />,

                // Change colors of success/error/loading icon
                iconTheme: {
                  primary: '#000',
                  secondary: '#fff',
                },

                // Aria
                ariaProps: {
                  role: 'status',
                  'aria-live': 'polite',
                },
              });
              // alert("Please allow location access to use this feature.");
              countRef.current += 1;
            }
          }
        );
      } else {
        console.log("error");
      }
    };
    getLocation();
    getTours();
  }, []);
  return (
    <>
      <Banner />
      <Favorite />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'toast-location-enable',
        }} />
    </>
  );
};

export default Home;