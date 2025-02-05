'use client';
import React from 'react';
import Stars from "@/components/util/Stars";
import {testimonials} from "@/constants/testimonials";
import Image from "next/image";
import { motion } from "framer-motion";

const Testimonial = () => {

  const testimonial = testimonials[0];

  return (
    <div
      className="w-full min-h-[30rem] flex items-center justify-center p-16 text-white relative bg-background3"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: .5 }}
        viewport={{ once: true, amount: .5 }}
        className="max-w-[40rem] flex flex-col items-center justify-center gap-8"
      >
        <Stars />
        <p className="font-semibold text-xl text-center">{testimonial.review}</p>
        <div className="w-16 h-16 relative">
          <Image src={testimonial.image} alt={"Testimonial Image"} fill={true} quality={100} className="rounded-full object-cover" />
        </div>
        <p>{testimonial.name}</p>
      </motion.div>
    </div>
  );
};

export default Testimonial;