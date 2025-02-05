'use client';
import React, {useState} from 'react';
import {IconBubbleTextFilled} from "@tabler/icons-react";
import AnnaAiChat from './AnnaAIChat';
import {useUserStore} from "@/stores/userStore";
import {motion, AnimatePresence} from "framer-motion";

const AnnaAi = () => {

  const [chatOpen, setChatOpen] = useState(false);

  const {user, isLoadingUser} = useUserStore();


  if (!user || isLoadingUser) {
    return;
  }

  return (
    <div className="fixed z-50 bottom-5 right-5">

      {!chatOpen &&
        <motion.div
          initial={{opacity: 0, scale: 0}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: .3}}
          className="w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center cursor-pointer duration-300 hover:bg-background3 hover:text-primary hover:shadow-2xl"
          onClick={() => setChatOpen(true)}
        >
          <IconBubbleTextFilled/>
        </motion.div>
      }

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{opacity: 0, scale: 0, x: '50%', y: '50%'}}
            animate={{opacity: 1, scale: 1, x: 0, y: 0}}
            exit={{ opacity: 0, scale: 0, x: '50%', y: '50%' }}
            transition={{duration: .3}}
            className={"fixed w-96 h-[30rem] bottom-5 right-5 flex items-center justify-center"}
          >
            <AnnaAiChat setChatOpen={setChatOpen}/>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default AnnaAi;