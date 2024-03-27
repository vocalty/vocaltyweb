import React from "react";
import googleplay from "../assets/googleplay.png"
import appstore from "../assets/appstore.png"
import fb from "../assets/facebook.png"
import insta from "../assets/instagram.png"
import linkdin from "../assets/linkedin.png"

function Footer() {
  return (
    <>
    <div className="bg-[#04A2D3] h-screen grid justify-between text-white">
      <div className=" grid justify-center gap-10 md:gap-6 lg:gap-2 grid-cols-1 sm: sm:grid-cols-2 lg:grid-cols-4  border-t-2 py-32">      
        <div className="flex justify-center text-4xl font-semibold gap-2">
            <span className="">VOCALTY</span>
        </div>
        <div className="px-5">
          <div className="text-3xl font-semibold">Inspiration</div>
          <div className="flex justify-center text-sm mt-10">
            Voice tourism apps act as personalized guides, igniting inspiration in travelers through their immersive 
            capabilities. By harnessing voice recognition tech, these apps offer hands-free access to destination 
            insights, local tips, and historical narratives, fostering a sense of wanderlust. Seamlessly delivering 
            information, they become virtual companions, sparking ideas and encouraging adventurers to explore beyond 
            their limits. With their ability to curate unique experiences, these apps inspire travelers to dream big 
            and embark on memorable journeys full of discovery and excitement.
          </div>
        </div>
       
        <div className="grid justify-center text-sm px-5">  
          <div className="text-3xl font-semibold">Download the App</div>
          <a rel="noreferrer" target='_blank' href='https://play.google.com/store/apps/details?id=com.vocalty.app'><img className="rounded-xl h-14" src={googleplay} alt=""/></a>
          <a rel="noreferrer" target='_blank' href='https://apps.apple.com/us/app/vocalty/id1615463984?platform=iphone'><img className="rounded-xl h-14" src={appstore} alt=""/></a>
        </div>
        <div className="grid justify-center px-5">
          <div className="text-3xl font-semibold">Follow US</div>
          <a rel="noreferrer" target='_blank' href='https://www.linkedin.com'> <img className="rounded-xl h-10 mt-5" src={linkdin} alt=""/></a>
          <a rel="noreferrer" target='_blank' href='https://www.facebook.com'> <img className="rounded-xl h-10" src={fb} alt=""/></a>
          <a rel="noreferrer" target='_blank' href='https://www.instagram.com'> <img className="rounded-xl h-10" src={insta} alt=""/></a>
        </div>
      </div>
      <div className="flex justify-around text-[8px] sm:text-[10px] py-3 border-t-2 text-black backdrop-brightness-100 backdrop-blur-[12px]">
            <div>© 2024 Vocalty.</div>
            <div>Design & Developed By Marhaba Codes</div>
      </div>
      </div>
    </>
    
  );
}

export default Footer;
