import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../firebase';
import {useNavigate} from "react-router-dom"

const OAuth = () => {

  const navigation = useNavigate()
  const [loading, setLoading] = useState(false)

  const googleSignUp = async () => {
    if (loading) return;
    setLoading(true);
  
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then(async(result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
              const docRef = doc(db, "users", user.uid);
              const docSnap = await getDoc(docRef);
          
              if (docSnap.exists()) {
                await setDoc(docRef, {
                  name: user.displayName,
                  email: user.email,
                  url_picture: user.photoURL,
                  timestamp: serverTimestamp(),
                });
                toast.success("Registration Successful!");
                setTimeout(()=>{
                  navigation("/")
                },500)
              } else {
                toast.success("Sign-in Successful!");
                setTimeout(()=>{
                  navigation("/")
                },500)
              }
  
        }).catch((error) => {
          console.log("Error ::: "+error)
        });

    } catch (error) {
      console.log(error);
      toast.error("Google Authrization Failed!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <button type='button' onClick={googleSignUp} className="py-2 w-[400px] text-white font-medium rounded bg-[#F2441D] hover:bg-white hover:text-[#F2441D] focus:outline-none focus:border-[#F2441D] border-2 border-[#F2441D]" >{loading ? "Registering with Google...": "Continue with Google"}</button>
      <ToastContainer />
    </>
  )
}

export default OAuth