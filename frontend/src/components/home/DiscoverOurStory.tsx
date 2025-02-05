'use client';
import React from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const DiscoverOurStory = () => {
  return (
    <div className="w-full lg:h-[49rem] bg-white pt-36 flex items-center justify-center relative shadow-xl">

      <div className="lg:w-[75rem] flex lg:flex-row flex-col-reverse items-center justify-between lg:gap-16 gap-8 xl:gap-24 xl:p-0 p-8">
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: .5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .5 }}
          className="w-11/12 lg:w-1/2 h-96 relative z-20"
        >
          <Image src={"/book2.jpeg"} alt={"Dictionary"} fill={true}  className="object-cover rounded-2xl" loading="lazy" />
        </motion.div>
        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: .5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .5 }}
          className="lg:w-1/2 lg:h-96 flex flex-col justify-center gap-8 lg:items-start items-center"
        >
          <p className="font-bold text-accent text-xl lg:text-start text-center">Discover Our Story</p>
          <h2 className="font-bold text-2xl lg:text-4xl lg:text-start text-center">The Inspiration Behind Learn Norsk</h2>
          <p>Learn Norsk was founded to provide accessible and engaging Norwegian language education, helping individuals immerse themselves in the language and culture with effective online resources.</p>
          <Link href={"/about"} className="submit-btn2">Read More</Link>
        </motion.div>

      </div>

    </div>
  );
};

export default DiscoverOurStory;