import Header from './Header.jsx';
import SideBar from './SideBar.jsx';
import Analytics from './Analytics.jsx';
import Tours from './Tours.jsx';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute.jsx';
import { getAuth } from 'firebase/auth';
import Login from '../pages/Login.jsx';
import DraftTour from './DraftTour.jsx';

function Admin() {

  const auth = getAuth()
  const navigate = useNavigate()
  const[toggle, setToggle] = useState(true)

  const ToggleSideBar = () =>{
    setToggle(!toggle)
  }

  useEffect(()=>{
    if(auth.currentUser === null){
      navigate("/")
    }
  },[auth])

  return (
   <>
    <div className='flex h-screen'>
    {
      toggle && (
        <><SideBar /></>
      )
    } 
      <div className='h-full overflow-y-auto w-full'>
        <Header ToggleSideBar={ToggleSideBar} />
        <Routes>
          <Route element={<PrivateRoute />}>
              <Route index path="/analytics" element={auth.currentUser ? <Analytics /> : <Login />} />
              <Route path="/tours" element={auth.currentUser ? <Tours /> : <Login />} />
              <Route path="/drafttour/:id" element={auth.currentUser ? <DraftTour /> : <Login />} />
          </Route>
        </Routes>
      </div>
    </div>
   </>
  );
}

export default Admin;
