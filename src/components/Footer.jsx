import React from "react";
import googleplay from "../assets/googleplay.png"
import appstore from "../assets/appstore.png"
import fb from "../assets/facebook.png"
import insta from "../assets/instagram.png"
import linkdin from "../assets/linkedin.png"
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <>
    <div className="bg-[#04A2D3] text-white px-[30px] mt-1 py-6">
            <h1 className=" text-4xl font-semibold">VOCALTY</h1>
      <div className="py-4">      
        <div className="grid md:grid-cols-3 tablet:grid-cols-2 grid-cols-1 items-center justify-center">
          <div >
            <h1 className="text-3xl font-semibold">Inspiration</h1>
            <p className="flex justify-center text-sm pt-5">
            Voice tourism apps act as personalized guides, igniting inspiration in travelers through their immersive 
            capabilities. By harnessing voice recognition tech, these apps offer hands-free access to destination 
            insights, local tips, and historical narratives, fostering a sense of wanderlust. Seamlessly delivering 
            information, they become virtual companions, sparking ideas and encouraging adventurers to explore beyond 
            their limits. With their ability to curate unique experiences, these apps inspire travelers to dream big 
            and embark on memorable journeys full of discovery and excitement.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 text-sm">  
            <h2 className="md:text-3xl text-xl font-semibold">Download the App</h2>
            <div className=" flex gap-5">
              <a rel="noreferrer" target='_blank' href='https://play.google.com/store/apps/details?id=com.vocalty.app'><img className="rounded-xl md:h-14 h-10" src={googleplay} alt=""/></a>
              <a rel="noreferrer" target='_blank' href='https://apps.apple.com/us/app/vocalty/id1615463984?platform=iphone'><img className="rounded-xl md:h-14 h-10" src={appstore} alt=""/></a>
            </div>
          </div>
          <div className="flex flex-col items-center gap-5">
            <h2 className="md:text-3xl text-xl font-semibold">Follow US</h2>
            <div className="flex gap-3">
              <a className="md:text-4xl text-2xl" rel="noreferrer" target='_blank' href='https://www.linkedin.com'><FaLinkedin/></a>
              <a className="md:text-4xl text-2xl" rel="noreferrer" target='_blank' href='https://www.facebook.com'><FaFacebook/></a>
              <a className="md:text-4xl text-2xl" rel="noreferrer" target='_blank' href='https://www.instagram.com'><FaInstagram/></a>
            </div>
        </div>
        </div>
      </div>
      <p className="py-3 border-t-2 text-white text-center backdrop-brightness-100 backdrop-blur-[12px]">
          All rights reserved © 2024 Vocalty.
      </p>
      </div>
    </>
    
  );
}

export default Footer;
