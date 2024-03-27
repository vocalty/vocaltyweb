import { createContext, useState } from "react";

export const SearchPlaceContext = createContext(null);

export default function SearchPlaceProvider({ children }) {

    const [selectedPlace, setSelectedPlace] = useState({ lat: 34.052235, lng: -118.243683 });
    const [dependencyUp, setDependencyUp] = useState(false);
    const [matchedPlaces, setMatchedPlaces] = useState([]);
    const [selectUserLocation, setSelectUserLocation] = useState({ lat: 34.052235, lng: -118.243683 });
    const [userNearbyPlace, setUserNearbyPlace] = useState([]);
    const [localPlaceName, setLocalPlaceName] = useState("");
    const [parkLocations, setParkLocations] = useState([]); // Store park coordinates
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tourPlaces, setTourPlaces] = useState([]);

    const info = {
        selectedPlace,
        setSelectedPlace,
        parkLocations,
        setParkLocations,
        selectUserLocation,
        setSelectUserLocation,
        userNearbyPlace,
        setUserNearbyPlace,
        localPlaceName,
        setLocalPlaceName,
        dependencyUp,
        setDependencyUp,
        matchedPlaces,
        setMatchedPlaces,
        isLoggedIn,
        setIsLoggedIn,
        tourPlaces,
        setTourPlaces
    }
    return (
        <SearchPlaceContext.Provider value={info}>
            {children}
        </SearchPlaceContext.Provider>
    );
}