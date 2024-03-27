import { initializeApp, getApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore'
import { getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_Firebase_API_KEY,
  authDomain: process.env.REACT_APP_Auth_Domain,
  projectId: process.env.REACT_APP_Project_Id,
  storageBucket: process.env.REACT_APP_Storage_Bucket,
  messagingSenderId: process.env.REACT_APP_Messaging_Sender_Id,
  appId: process.env.REACT_APP_App_Id,
  measurementId: process.env.REACT_APP_Measurement_Id
};

// Initialize Firebase
// if(getApps().length === 0){
//   initializeApp(firebaseConfig);
// }

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const fbApp = getApp();
const fbStorage = getStorage(app)
export {
    fbApp,
    fbStorage,
    db
}
