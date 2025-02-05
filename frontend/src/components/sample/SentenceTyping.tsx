'use client';
import React, {useState} from 'react';
import {norskLetters} from "@/constants/sample-data";
import {Question} from "@/types/Types";

const SentenceTyping = ({question, nextQuestion}: {
  question: Question;
  nextQuestion: () => void;
}) => {

  const [userInput, setUserInput] = useState("");

  const checkAnswer = () => {
    const answer = question.answer;
    const selectedChoices = userInput.split(" ");

    console.log("Answer: ", answer);
    console.log("Selected Choices: ", selectedChoices);

    if (selectedChoices.length !== answer.length) {
      console.log("Incorrect");
      return;
    }

    for (let i = 0; i < selectedChoices.length; i++) {
      if (selectedChoices[i].toLowerCase() !== answer[i].norsk.toLowerCase()) {
        console.log("Incorrect");
        return;
      }
    }

    console.log("Correct");
    nextQuestion();
  }



  return (
    <div className="flex flex-col gap-8 w-full items-center">
      <h1 className="text-green-500 font-semibold text-xl">Translate the following sentence:</h1>
      <p className="text-xl font-semibold text-zinc-800">{question.title}</p>

      <hr className="border-zinc-800 border w-full"/>

      <textarea
        className="test-zinc-800 bg-zinc-400 placeholder:text-zinc-600 resize-none w-full h-32 p-2 rounded" placeholder={"Type answer here"}
        value={userInput}
        onChange={(e) => {
          setUserInput(e.target.value);
        }}
      />

      {/* Norsk Letters */}
      <div className="flex gap-1">
        {norskLetters.map(letter => (
          <p
            key={letter}
            className={"bg-zinc-400 rounded p-1 cursor-pointer hover:bg-zinc-300 hover:text-green-500 duration-300"}
            onClick={() => {
              setUserInput(userInput + letter);
            }}
          >
            {letter}
          </p>
        ))}
      </div>


      {/* Submit Button */}
      <button
        onClick={checkAnswer}
        className="bg-green-500 px-4 py-2 rounded-lg text-lg text-white font-bold shadow-xl">Check Answer</button>
    </div>
  );
};

export default SentenceTyping;