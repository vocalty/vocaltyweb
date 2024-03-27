import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../firebase';


const OAuth = () => {

  const [loading, setLoading] = useState(false)

  const googleSignUp = async () => {
    if (loading) return;
    setLoading(true);
  
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      signInWithPopup(auth, provider)
        .then(async(result) => {
          const user = result.user;
              const docRef = doc(db, "users", user.uid);
              const docSnap = await getDoc(docRef);
          
              if (docSnap.exists()) {
                await setDoc(docRef, {
                  name: user.displayName,
                  email: user.email,
                  url_picture: user.photoURL,
                  id: user.uid,
                  timestamp: serverTimestamp(),
                }, { merge: true });
                toast.success("Sign in Successful!");
              } else {
                // If user document does not exist, create it
                await setDoc(docRef, {
                  name: user.displayName,
                  email: user.email,
                  url_picture: user.photoURL,
                  id: user.uid,
                  timestamp: serverTimestamp(),
                });
                toast.success("Registration Successful!");
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
      <button type='button' onClick={googleSignUp} className="py-2 w-full text-white font-medium rounded bg-[#F2441D] hover:bg-white hover:text-[#F2441D] focus:outline-none focus:border-[#F2441D] border-2 border-[#F2441D]" >{loading ? "Registering with Google...": "Continue with Google"}</button>
      <ToastContainer />
    </>
  )
}

export default OAuth