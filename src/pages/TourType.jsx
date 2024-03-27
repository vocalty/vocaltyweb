import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tour } from '../components';
import Loading from '../components/Loading';
import { db } from '../firebase';

const TourType = () => {
  const { country } = useParams();
  const [loading, setLoading] = useState(false);
  const [tours, setTours] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const toursPerPage = 8;
  const lastIndex = currentPage * toursPerPage;
  const firstIndex = lastIndex - toursPerPage;
  const tour = tours.slice(firstIndex, lastIndex)
  const npage = Math.ceil(tours.length / toursPerPage)
  const numbers = [...Array(npage + 1).keys()].slice(1)


  const getTours = async () => {
    if (loading) return;
    setLoading(true);
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
      const countryTours = fetchedTours.filter((tour) => tour.data.country === country);
      setTours(countryTours);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTours();
  }, [country]);

  const previousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1)
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1)
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 1500)
    }
  }

  const changeCPage = (id) => {
    setCurrentPage(id)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }

  if (loading) {
    return <Loading />
  }
  return (
    <>
      <div className='md:h-screen grid justify-center text-center w-full bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br'>
        <h1 className='mt-40 text-4xl text-white md:font-bold font-normal font-sans'>{country} Vocal Tours</h1>
        {/* <div className=' my-20 grid grid-cols-4 gap-5'> */}
        <div className=' my-20 flex justify-center flex-wrap gap-5 px-[30px]'>
          {!loading && tour.map((d, i) => (
            <div key={i} className='transition ease-in-out hover:-translate-y-2 hover:scale-110  duration-200'>
              <Tour id={d.id} tour={d.data} />
            </div>
          ))
          }
        </div>
        <nav className='flex justify-center pb-20'>
          <ul className='flex items-center gap-0.5'>
            <li className='mr-3'>
              <button className='px-3 py-3 text-sm bg-blue-600 hover:bg-blue-800 hover:duration-700 rounded text-white font-medium' href='#' onClick={previousPage}>Prev</button>
            </li>
            {
              numbers.map((n, i) => (
                <li className={`${currentPage === n ? "bg-blue-600 text-white" : ""} text-gray-700  rounded font-medium  border-2 border-blue-500`} key={i}>
                  <button className='px-3 hover:bg-blue-200' onClick={() => changeCPage(n)}>{n}</button>
                </li>
              ))
            }
            <li className='ml-3'>
              <button className='px-3 py-3 text-sm bg-blue-600 hover:bg-blue-800 hover:duration-700 rounded text-white font-medium' href='#' onClick={nextPage}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default TourType;
