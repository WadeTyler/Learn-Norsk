'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {IconCheck} from "@tabler/icons-react";
import Image from "next/image";
import CTA2 from "@/components/home/CTA2";

const VisionAndMission = () => {
  return (
    <div className="w-full lg:min-h-[49rem] bg-white p-8 lg:p-16 flex flex-col items-center justify-center lg:pb-36 relative">

      <div className="max-w-[75rem] flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">

        <div

          className="flex flex-col gap-8 w-full"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: .5 }}
            viewport={{ once: true, amount: .5 }}
            className="font-bold text-lg text-accent text-center lg:text-start"
          >
            Our Vision and Mission
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: .5 }}
            viewport={{ once: true, amount: .5 }}
            className="text-3xl font-bold lg:text-start text-center"
          >
            Empowering Language Learners Worldwide Through Norwegian Mastery
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: .5 }}
            viewport={{ once: true, amount: .5 }}
            className="flex flex-col lg:flex-row w-full justify-between gap-8 lg:gap-16"
          >

            <div className="flex flex-col gap-2">
              <IconCheck />
              <p className="font-bold text-xl">Our Vision</p>
              <h4>To Become the leading platform for Norwegian language learning, inspiring global curiosity and appreciation for Norway&#39;s rich culture.</h4>
            </div>
            <div className="flex flex-col gap-2">
              <IconCheck />
              <p className="font-bold text-xl">Our Mission</p>
              <p>To break down language barriers and foster cultural connections through effective and enjoyable Norwegian language education.</p>
            </div>
          </motion.div>

        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: .5 }}
          viewport={{ once: true, amount: .5 }}
          className="w-full h-[30rem] relative"
        >
          <Image src={"/town.jpeg"} alt={"Norway Town"} fill={true} quality={80} className={"rounded-2xl object-cover"} />
        </motion.div>

      </div>
        <CTA2 />
    </div>
  );
};

export default VisionAndMission;