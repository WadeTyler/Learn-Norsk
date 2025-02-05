'use client';
import React, {SetStateAction, useEffect, useState} from 'react';
import {useUserStore} from "@/stores/userStore";
import {IconX} from "@tabler/icons-react";
import ChatBubble from "@/components/anna/ChatBubble";
import {useAiStore} from "@/stores/aiStore";

const AnnaAiChat = ({setChatOpen}: {
  setChatOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {

  const {user} = useUserStore();
  const {currentMessages, sendMessage, isSendingMessage, resetMessages} = useAiStore();
  const [userInput, setUserInput] = useState<string>("");

  async function handleSendMessage() {
    if (isSendingMessage || userInput.length === 0) return;

    try {
      await sendMessage(userInput);
      setUserInput("");
    }
    catch {
      // do nothing
    }
  }

  useEffect(() => {
    setUserInput("");
    resetMessages();
  }, [resetMessages]);

  return (
    <div
      className="w-full h-full bg-background3 shadow-xl rounded-2xl text-white p-4 gap-2 flex flex-col items-center"
    >

      {/* Close Button*/}
      <div className="absolute top-4 right-4 w-full flex items-center justify-end">
        <IconX
          onClick={() => setChatOpen(false)}
          className={"hover:rotate-90 transform duration-300 cursor-pointer hover:text-primary"}
        />
      </div>

      {/* Header */}
      <h5 className="text-2xl text-white text-center font-bold inline-flex flex-col gap-1">
        Chat with Anna
        <br/>
        <span className="text-sm text-white italic">Your AI Norwegian Assistant</span>
      </h5>
      <hr className="border w-full"/>

      {/* Chat Messages */}
      <div className="h-full w-full overflow-y-scroll overflow-x-hidden">
        <ChatBubble content={`Hei ${user?.firstName || ""}! Hva kan jeg hjelpe deg med? (What can I help you with?)`} isAi={true}/>
        {currentMessages.map((message) => (
          <div key={message.id}>
            <ChatBubble content={message.userMessage} isAi={false} />
            <ChatBubble content={message.aiMessage} isAi={true} />
          </div>
        ))}
      </div>

      <hr className="border w-full"/>

      {/* User Input */}
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSendMessage();
      }} className="w-full"
      >
        <input
          type={"text"}
          className={`input-bar bg-white text-foreground w-full ${isSendingMessage ? "!bg-background2" : "!bg-white"}`}
          placeholder={"What can I help you with?"}
          value={userInput}
          disabled={isSendingMessage}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </form>

    </div>
  );
};

export default AnnaAiChat;