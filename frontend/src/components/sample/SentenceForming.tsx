import React, {useState} from 'react';
import {Question, Word} from "@/types/Types";
import WordButton from "@/components/sample/WordButton";

const SentenceForming = ({question, nextQuestion}: {
  question: Question;
  nextQuestion: () => void;
}) => {

  const [selectedAnswer, setSelectedAnswer] = useState<Word[]>([]);

  const checkAnswer = () => {

    console.log("selectedAnswer: ", selectedAnswer);
    console.log("answer: ", question.answer);
    const answer = question.answer;

    if (selectedAnswer.length !== answer.length) {
      console.log("Incorrect");
      return;
    }
    for (let i = 0; i < selectedAnswer.length; i++) {
      if (selectedAnswer[i].id !== answer[i].id) {
        console.log("Incorrect");
        return;
      }
    }

    console.log("Correct");
    nextQuestion();
  }

  const handleWordClick = (word: Word) => {
    if (selectedAnswer.includes(word)) {
      setSelectedAnswer(selectedAnswer.filter((w) => w !== word));
    } else {
      setSelectedAnswer([...selectedAnswer, word]);
    }
  }


  return (
    <div className="flex flex-col gap-8 w-full items-center">
      <h1 className="text-green-500 font-semibold text-xl">Translate the following sentence:</h1>
      <p className="text-zinc-800 font-semibold text-xl">{question.title}</p>

      {/* Display Selected Answer */}
      <div className="w-full flex gap-1 justify-center">
        {selectedAnswer.map((word) => (
          <div
            key={word.id}
            className="bg-zinc-400 rounded p-1 cursor-pointer"
            onClick={() => handleWordClick(word)}
          >
            {word.norsk}
          </div>
        ))}
      </div>

      <hr className="border-zinc-800 border w-full"/>


      {/* Display Options */}
      <div className="w-full flex gap-1 justify-center">
        {question.options && question.options.filter((option) => {
          if (!selectedAnswer.includes(option)) {
            return option;
          }
        }).map((word) => (
          <WordButton key={word.id} word={word} handleWordClick={handleWordClick} />
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={checkAnswer}
        className="bg-green-500 px-4 py-2 rounded-lg text-lg text-white font-bold shadow-xl">Check Answer</button>
    </div>
  );
};

export default SentenceForming;