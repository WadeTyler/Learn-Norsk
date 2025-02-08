'use client';
import React from 'react';
import { motion } from 'framer-motion';

const ConfirmPanel = ({header, body, confirmText = "Confirm", cancelText = "Cancel", cancelFunc, confirmFunc}: {
  header: string;
  body: string;
  confirmText?: string;
  cancelText?: string;
  cancelFunc: () => void;
  confirmFunc: () => void;
}) => {
  return (
    <div className={"w-full h-screen fixed top-0 left-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,.8)]"}>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-96 flex flex-col gap-4 bg-white rounded"
      >
        <p className="text-2xl text-primary font-semibold pt-4 px-4">{header}</p>
        <p className={"text-background3 px-4"}>{body}</p>

        <div className="flex gap-4 items-center justify-end w-full p-4 bg-background3 rounded-b">
          <button className="submit-btn" onClick={confirmFunc}>{confirmText}</button>
          <button className="cancel-btn" onClick={cancelFunc}>{cancelText}</button>
        </div>
      </motion.div>

    </div>
  );
};

export default ConfirmPanel;