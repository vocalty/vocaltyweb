import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import { SearchPlaceContext } from './../../context/SearchPlaceProvider';


const BannerMap = () => {
  const { tourPlaces } = useContext(SearchPlaceContext);
  const [query, setQuery] = useState("");
  // const scriptIsLoaded = useRef(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const checkSearchField = (e) => {
    setSearchInput(e.target.value);
  }

  const keyEventCheck = (e) => {
    if (e.key === "Enter") {
      if (searchInput.length === 0) {
        return toast.warning("Please enter a place!", { position: "top-right", autoClose: 3000 });
      }
      if (searchInput.length !== 0) {
        return toast.warning("Please select a place from suggestions!", { position: "top-right", autoClose: 3000 });
      }
    }
  }
  // search result filter 
  const handleSearch = (e) => {
    const value = e.target.value;
    // setSearchText(value); // Update searchText state

    if (value !== "") {
      // Check if the search value is not empty
      const filter = tourPlaces?.filter(
        (place) =>
          place?.data?.city?.toLowerCase().includes(value.toLowerCase()) || // Use toLowerCase() instead of toLowercase()
          place?.data?.country?.toLowerCase().includes(value.toLowerCase()) ||
          place?.data?.title?.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResult(filter); // Update search results
    } else {
      setSearchResult([]); // If search value is empty, reset search results
    }
  };


  return (
    <>
      <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white">
        <div className="grid place-items-center h-full w-12 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          name="search_field"
          id="search"
          className="search_control peer h-full w-full outline-none text-sm text-gray-700 pr-2 rounded"
          onChange={(e) => { setQuery(e.target.value); checkSearchField(e); handleSearch(e) }}
          placeholder="Search By city, place or trail name"
          onKeyDown={(e) => e.key === "Enter" && keyEventCheck(e)}
          value={query}
        />
        <div className={`flex flex-col absolute -bottom-full top-full w-full min-h-[10rem] overflow-auto scrollbar-thin left-0 bg-white border rounded-b text text-black shadow-lg ${searchResult?.length === 0 ? 'py-0 hidden' : 'py-1 block'}`}>
          {
            searchResult && searchResult.length > 0 &&
            searchResult.map((place) => (
              <Link key={place?.id} to={`/singletour/${place?.id}`} className="border-b border-gray-500 text-gray-600 p-2 hover:bg-gray-50">{place?.data?.city + ', '} <span className=" font-medium text-gray-900">{place?.data?.country}</span></Link>
            ))
          }
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default BannerMap;

