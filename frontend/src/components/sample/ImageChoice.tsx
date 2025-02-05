'use client';
import React from 'react';
import {Question, Word} from "@/types/Types";

const ImageChoice = ({ question, nextQuestion }: {
  question: Question;
  nextQuestion: () => void;
}) => {


  const checkAnswer = (selectedChoice: Word) => {
    if (selectedChoice === question.answer[0]) {
      console.log("Correct!")
      nextQuestion();
    } else {
      console.log("Incorrect");
    }
  }

  return (
    <div className="flex items-center flex-col gap-2">
      <h1 className="text-green-500 font-semibold text-xl">{question.title}</h1>
      <div className="grid grid-cols-2 gap-2">
        {question.options && question.options.map((option) => (
          <div
            key={option.id}
            onClick={() => checkAnswer(option)}
            className="max-h-48 rounded bg-zinc-800 text-white p-2 hover:scale-95 cursor-pointer duration-300"
          >
            <img src={option.image} alt="Option Image" className="w-full h-32 object-cover" />
            <p className="mt-2 font-semibold text-center">{option.norsk}</p>
          </div>
        ))}
      </div>
    </div>
  )

}

export default ImageChoice;