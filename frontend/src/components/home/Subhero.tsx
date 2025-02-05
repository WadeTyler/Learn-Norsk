'use client';
import React from 'react';
import Image from "next/image";
import {motion} from "framer-motion";

const Subhero = () => {
  return (
    <div className="w-full lg:h-[50rem] relative flex flex-col gap-8 items-center justify-center p-8 lg:p-2 shadow-xl z-10">

      <motion.p
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{ once: true, amount: .5 }}
        transition={{duration: .5}}
        className="text-accent font-bold text-lg"
      >
        Explore Our Offerings
      </motion.p>
      <motion.p
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{ once: true, amount: .5 }}
        transition={{duration: .5}}
        className="text-4xl font-semibold"
      >
        Our Key Services
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-2">

        {/* Image 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .2, delay: .5 }}
          className="flex flex-col gap-4 items-center justify-center xl:w-96 text-center"
        >
          <div className="w-full h-72 relative">
            <Image
              src="/mountains.jpeg"
              alt={"Norwegian Mountains"}
              quality="80"
              loading={"lazy"}
              fill={true}
              className="rounded-2xl object-cover"
            />
          </div>
          <p className="font-semibold text-2xl">Interactive Lessons</p>
          <p>Engaging lessons designed to cater to all learning styles, ensuring an effective grasp of Norwegian
            language fundamentals.</p>
        </motion.div>

        {/* Image 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true}}
          transition={{ duration: .2, delay: .7 }}
          className="flex flex-col gap-4 items-center justify-center xl:w-96 text-center"
        >
          <div className="w-full h-72 relative">
            <Image
              src="/learn.jpeg"
              alt={"Learning Blocks"}
              quality="80"
              loading={"lazy"}
              fill={true}
              className="rounded-2xl object-cover"
            />
          </div>
          <p className="font-semibold text-2xl">Engaging Quizzes</p>
          <p>Fun and challenging quizzes that reinforce your knowledge and track your progress as you learn
            Norwegian.</p>
        </motion.div>


        {/* Image 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .2, delay: .9 }}
          className="flex flex-col gap-4 items-center justify-center xl:w-96 relative text-center"
        >
          <div className="w-full h-72 relative">
            <Image
              src="/town.jpeg"
              alt={"Norwegian Town"}
              quality="80"
              loading={"lazy"}
              fill={true}
              className="rounded-2xl object-cover"
            />
          </div>
          <p className="font-semibold text-2xl">Cultural Insights</p>
          <p>Advanced tracking features to monitor your learning journey and celebrate milestones as you advance in your
            Norwegian skills.</p>
        </motion.div>

      </div>

    </div>
  );
};

export default Subhero;