import React, { useState } from 'react';
import { Autocomplete, LoadScript } from '@react-google-maps/api';

const BannerMap = ({ handlePlaceChange }) => {
  const [selectedPlace, setSelectedPlace] = useState(null); // State to store selected place

  const handleAutocompleteChange = (newPlace) => {
    if (newPlace) {
      setSelectedPlace(newPlace); // Update state with selected place
      handlePlaceChange(newPlace); // Pass value to parent component
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY} libraries={['places']}>
      <Autocomplete
        apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
        libraries={['places']}
        options={{ types: ['geocode'] }}
        onChange={handleAutocompleteChange} // Utilize the custom handler
      >
        <input
          className="w-[100%] text-[19px] bg-white text-[#414141] ps-[50px] px-[30px] py-[16px] rounded-full outline-none border-0"
          placeholder="Search By city, place or trail name"
        />
      </Autocomplete>
    </LoadScript>
  );
};

export default BannerMap;
