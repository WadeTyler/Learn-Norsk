'use client';
import React from 'react';
import {motion} from 'framer-motion';
import Link from "next/link";

const CTA2 = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: '65%' }}
      whileInView={{ opacity: 1, y: '50%' }}
      viewport={{ once: true, amount: .5 }}
      exit={{opacity: 1}}
      transition={{ duration: 0.5 }}
      className="sm:w-[40rem] md:w-[45rem] xl:w-[75rem] p-4 lg:h-72 flex flex-col items-center justify-center gap-8 bg-white shadow-xl relative lg:absolute z-20 rounded-xl bottom-0 translate-y-1/2 xl:mx-0"
    >
      <h3 className="font-bold md:text-4xl text-2xl text-center">Ready to Learn Norwegian? Join Us!</h3>
      <p>Sign up today and start your journey towards mastering the Norwegian language and culture.</p>
      <Link href="/signup" className="submit-btn2">Start Learning Now</Link>
    </motion.div>
  );
};

export default CTA2;