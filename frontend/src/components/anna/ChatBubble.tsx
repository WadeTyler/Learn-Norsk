'use client';
import { motion } from 'framer-motion';
import React from 'react';
import {useUserStore} from "@/stores/userStore";

const ChatBubble = ({content, isAi}: {
  content: string;
  isAi: boolean;
}) => {


  const { user } = useUserStore();


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`w-3/4 flex flex-col gap-1 text-sm ${isAi ? "justify-self-start" : "justify-self-end"}`}
    >
      <p className={`${isAi ? 'text-start' : 'text-end'}`}>{isAi ? 'Anna' : user?.firstName }</p>
      <div className={`w-full flex rounded-lg shadow-xl p-2 ${isAi ? "bg-primary text-white" : "bg-white text-background3"} `}>
        <p className="text-sm">{content}</p>
      </div>
    </motion.div>
  );
};

export default ChatBubble;