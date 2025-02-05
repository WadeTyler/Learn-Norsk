'use client';
import React from 'react';
import Image from "next/image";
import { motion } from "framer-motion";

const Subhero = () => {


  return (
    <motion.div
      id={"about-subhero"}
      className={"w-full min-h-[40rem] flex items-center flex-col justify-center gap-8 relative p-8 lg:p-16 bg-white"}
    >
     <div className="max-w-[75rem] flex items-center flex-col justify-center gap-8">
       <motion.p
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: .5 }}
         viewport={{ once: true, amount: .5 }}
         className="text-accent font-bold text-lg"
       >
         Our Journey Begins
       </motion.p>
       <motion.h5
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         transition={{ duration: .5 }}
         viewport={{ once: true, amount: .5 }}
         className="text-3xl font-bold text-center lg:text-start"
       >
         The Inspiring Story Behind Learn Norsk
       </motion.h5>

       <motion.div
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: .5 }}
         viewport={{ once: true, amount: .5 }}
         className="w-full lg:gap-16 gap-8 flex lg:flex-row flex-col items-center justify-between"
       >
         <p>Learn Norsk was founded by language enthusiasts with a passion for Norwegian culture, aiming to make learning accessible and enjoyable for everyone.</p>
         <p>With innovative teaching methods and a user-centric approach, we empower learners to confidently explore the Norwegian language at their own pace.</p>
       </motion.div>

       <motion.div
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: .5 }}
         viewport={{ once: true, amount: .5 }}
         className="w-full h-96 relative rounded-2xl"
       >
         <Image src={"/mountains.jpeg"} alt={"Norwegian Mounts"} fill={true} quality={80} className="object-cover rounded-2xl" />
       </motion.div>
     </div>
    </motion.div>
  );
};

export default Subhero;