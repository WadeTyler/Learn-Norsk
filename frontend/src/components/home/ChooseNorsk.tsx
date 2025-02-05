'use client';
import React from 'react';
import {IconCheck} from "@tabler/icons-react";
import Image from "next/image";
import CTA1 from "@/components/home/CTA1";
import {motion} from "framer-motion";
import Link from "next/link";

const ChooseNorsk = () => {
  return (
    <div className="w-full xl:h-[49rem] bg-background2 flex flex-col items-center justify-center relative xl:pb-36">
      <div className="xl:max-w-[75rem] xl:h-96 flex  flex-col lg:flex-row items-center justify-evenly lg:gap-16 gap-8 xl:gap-24 xl:p-0 p-8">
        {/* Left Side */}
        <motion.div
          initial={{opacity: 0, x: -100}}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: .5 }}
          exit={{opacity: 0}}
          transition={{duration: .5}}
          className="xl:w-[40rem] relative xl:h-[30rem] flex flex-col  lg:items-start items-center gap-8"
        >
          <p className="text-accent font-bold text-lg lg:text-start text-center">Why Choose Learn Norsk</p>
          <h2 className="font-bold lg:text-4xl text-xl md:text-2xl lg:text-start text-center">Experience unparalleled language learning with our unique approach,
            tailored for every type of learner.</h2>

          <ul className="gap-2 font-bold flex flex-col">
            <p className="inline-flex items-center gap-2"><IconCheck/> User-Friendly Interface</p>
            <p className="inline-flex items-center gap-2"><IconCheck/> Comprehensive Content Library</p>
            <p className="inline-flex items-center gap-2"><IconCheck/> Culturally Immersive Learning</p>
            <p className="inline-flex items-center gap-2"><IconCheck/> Dedicated Learner Support</p>
          </ul>

          <Link href={"/about"} className="submit-btn2">Read More</Link>

        </motion.div>

        {/* Right Side*/}
        <motion.div
          initial={{opacity: 0, x: 100}}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: .5 }}
          exit={{opacity: 0}}
          transition={{duration: .5}}
          className="xl:w-[40rem] w-full h-96 relative z-20"
        >
          <Image src={"/book.jpeg"} alt={"Dictionary"} fill={true} className="object-cover rounded-2xl"
                 loading="lazy"/>
        </motion.div>
      </div>

      <CTA1/>
    </div>
  );
};

export default ChooseNorsk;