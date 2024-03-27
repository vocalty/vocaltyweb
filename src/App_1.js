import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  BecomeCreator,
  Explore,
  ForgetPassword,
  Home,
  Login,
  Profile,
  SignUp,
  SingleTour,
  TourPlayer,
  TourType,
  Tours,
} from "./pages";
import { Footer, ShowNavbar } from "./components";
import PrivateRoute from "./components/PrivateRoute";
import Admin from "./admin/Admin";
import { getAuth } from "firebase/auth";
import Navbar from "./components/Commons/Navbar";
function App() {
  const auth = getAuth();
  return (
    <>
      <BrowserRouter>
        {/* <ShowNavbar>
      <Navbar />
    </ShowNavbar> */}
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forget" element={<ForgetPassword />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/admin/*" element={auth ? <Admin /> : <Login />} />
          </Route>
          <Route path="/tourcountry/:country" element={<TourType />} />
          <Route path="/singletour/:id" element={<SingleTour />} />
          <Route path="/tourplayer/:id" element={<TourPlayer />} />
          <Route path="/becomecreator" element={<BecomeCreator />} />
        </Routes>
        {/* <ShowNavbar>
          <Footer />
        </ShowNavbar> */}
      </BrowserRouter>
    </>
  );
}

export default App;
