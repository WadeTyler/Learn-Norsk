'use client';
import React, {useState} from 'react';

import { questions } from "@/constants/sample-data";
import ImageChoice from "@/components/sample/ImageChoice";
import SentenceForming from "@/components/sample/SentenceForming";
import SentenceTyping from "@/components/sample/SentenceTyping";
import {Question} from "@/types/Types";

const Page = () => {

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(questions[0]);

  const nextQuestion = () => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setCurrentQuestion(questions[nextIndex]);
  }

  console.log(currentQuestion)

  return (
    <div className="flex items-center justify-center flex-col h-screen text-zinc-800">
      <div className="w-[40rem] min-h-96 bg-white rounded shadow-xl p-4">
        {currentQuestion && currentQuestion.type === "image-choice" && (
          <ImageChoice question={currentQuestion} nextQuestion={nextQuestion} />
        )}
        {currentQuestion && currentQuestion.type === "sentence-forming" && (
          <SentenceForming question={currentQuestion} nextQuestion={nextQuestion} />
        )}
        {currentQuestion && currentQuestion.type === "sentence-typing" && (
          <SentenceTyping question={currentQuestion} nextQuestion={nextQuestion} />
        )}
      </div>
    </div>
  );
};

export default Page;