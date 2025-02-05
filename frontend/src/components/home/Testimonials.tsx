'use client';
import Stars from '@/components/util/Stars';
import React from 'react';
import Image from "next/image";
import CTA2 from "@/components/home/CTA2";
import { motion } from "framer-motion";

const Testimonials = () => {
  return (
    <div className="w-full lg:h-[49rem] flex flex-col items-center justify-center lg:pb-36 bg-background2 gap-8 relative p-8">

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: .5 }}
        transition={{duration: .5}}
        className="text-lg text-accent font-bold"
      >
        What Our Learners Say
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: .5 }}
        transition={{duration: .5}}
        className="font-bold text-3xl"
      >
        Real Experiences
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
        {/* Testimony 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .5 }}
          transition={{duration: .2, delay: .5 }}
          exit={{ opacity: 0, transition: { duration: 0, delay: 0 }}}
          className="xl:w-96 flex flex-col items-center gap-4"
        >
          <Stars />
          <p className="text-lg font-bold text-center">Learn Norsk made mastering Norwegian enjoyable and engaging. I love the interactive lessons and quizzes that keep me motivated!</p>

          <div className="w-10 h-10 relative rounded-full">
            <Image src={"/testimonial-01.jpg"} alt={"Testimonial 1 Image"} fill={true} quality={50} loading="lazy" className="object-cover rounded-full" />
          </div>
          <p>Jonas Berg</p>
        </motion.div>
        {/* Testimony 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .5 }}
          transition={{duration: .2, delay: .7 }}
          exit={{ opacity: 0, transition: { duration: 0, delay: 0 }}}
          className="xl:w-96 flex flex-col items-center gap-4"
        >
          <Stars />
          <p className="text-lg font-bold text-center">The structured lessons and friendly interface made it easy for me to learn at my own pace. Highly recommend Learn Norsk!</p>

          <div className="w-10 h-10 relative rounded-full">
            <Image src={"/testimonial-02.jpg"} alt={"Testimonial 2 Image"} fill={true} quality={50} loading="lazy" className="object-cover rounded-full" />
          </div>
          <p>Anna Lunde</p>
        </motion.div>
        {/* Testimony 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .5 }}
          transition={{duration: .2, delay: .9 }}
          exit={{ opacity: 0, transition: { duration: 0, delay: 0 }}}
          className="xl:w-96 flex flex-col items-center gap-4"
        >
          <Stars />
          <p className="text-lg font-bold text-center">I never thought I could learn a language so quickly! Learn Norsk provides an amazing platform for anyone wanting to explore Norwegian culture.</p>

          <div className="w-10 h-10 relative rounded-full">
            <Image src={"/testimonial-03.jpg"} alt={"Testimonial 3 Image"} fill={true} quality={50} loading="lazy" className="object-cover rounded-full" />
          </div>
          <p>Sara Nilsen</p>
        </motion.div>

      </div>

      <CTA2 />
    </div>
  );
};

export default Testimonials;

