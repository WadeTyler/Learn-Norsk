'use client';
import {motion} from 'framer-motion';
import React from 'react';
import Link from "next/link";

const CTA1 = () => {
  return (
    <motion.div
      initial={{opacity: 0, y: '65%'}}
      whileInView={{ opacity: 1, y: '50%' }}
      viewport={{ once: true, amount: .5 }}
      transition={{duration: .5}}
      className="sm:w-[40rem] xl:w-[75rem] p-4 xl:h-72 flex flex-col items-center justify-center gap-8 bg-white shadow-xl relative xl:absolute z-20 rounded-xl bottom-0 translate-y-1/2 mx-4 lg:mx-0"
    >
      <h3 className="font-bold md:text-4xl text-2xl text-center">Start Your Norwegian Learning Journey Today!</h3>
      <p>Join our interactive platform and unlock the beauty of the Norwegian language.</p>
      <Link href="/signup" className="submit-btn2">Start Learning Now</Link>
    </motion.div>
  );
};

export default CTA1;