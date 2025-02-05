'use client';
import React from 'react';
import Image from "next/image";
import {motion} from "framer-motion";

const Hero = () => {

  return (
    <div
      className="w-full h-screen md:h-[40rem] bg-accent relative"
    >
      <div className="relative w-full h-full z-10">
        <Image src={"/book.jpeg"} alt={"hero image"} fill={true} quality={100} className="object-cover"/>
      </div>

      <div
        className="absolute z-20 top-0 left-0 w-full h-full flex items-center justify-center  bg-[rgba(0,20,30,.5)] text-white">

        <div
          className="sm:w-full lg:max-w-[75rem] z-30 flex flex-col gap-4 items-center justify-center text-center p-4 lg:p-2"
        >

          <motion.p
            initial={{opacity: 0, y: -20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, amount: .5}}
            transition={{duration: .5, delay: .5}}
          >
            Discover your Norwegian Adventure
          </motion.p>
          <motion.h2
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            viewport={{once: true, amount: .5}}
            transition={{duration: .5}}
            className="text-3xl md:text-6xl md:font-semibold font-bold"
          >
            Why Learn Norsk?
          </motion.h2>
          <motion.h1
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, amount: .5}}
            transition={{duration: .5, delay: .5}}
            className="max-w-[55rem]"
          >
            Our platform is your gateway to mastering the norwegian language, offering personalized and interactive
            lessons for every learner&#39;s unique journey.
          </motion.h1>

          <button className="submit-btn3"
                  onClick={() => {
                    const aboutsubhero = document.getElementById("about-subhero");
                    if (!aboutsubhero) return;
                    aboutsubhero.scrollIntoView({behavior: "smooth"});
                  }}
          >Read more
          </button>
        </div>

      </div>

    </div>
  );
};

export default Hero;