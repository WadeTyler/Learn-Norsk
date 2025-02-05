'use client';
import React, {useState} from 'react';
import {Question, Word} from "@/types/Types";
import WordButton from "@/components/WordButton";
import {motion} from 'framer-motion';
import TitleWord from '@/components/TitleWord';

const SentenceFormingQuestion = ({question, nextQuestion}: {
  question: Question;
  nextQuestion: (isCorrect: boolean, answer: Word[]) => void;
}) => {

  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isIncorrect, setIsIncorrect] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<Word[]>([]);

  const correctAnswer = question.answer.map((word) => word.norsk).join(" ");

  const handleWordClick = (word: Word) => {
    // If already submit just return
    if (isIncorrect || isCorrect) return;

    if (selectedAnswer.includes(word)) {
      setSelectedAnswer(prev => prev.filter((option) => option.id !== word.id));
    } else {
      setSelectedAnswer(prev => [...prev, word]);
    }
  }

  // Check order of selectedAnswer vs question.answer
  const handleCheckAnswer = () => {
    // Simply check length matching
    if (selectedAnswer.length !== question.answer.length) {
      setIsIncorrect(true);
      return;
    }

    // Check order
    for (let i = 0; i < selectedAnswer.length; i++) {
      if (selectedAnswer[i].id !== question.answer[i].id) {
        setIsIncorrect(true);
        return;
      }
    }

    setIsCorrect(true);
  }

  const handleGoNext = () => {
    if (isCorrect && !isIncorrect) {
      nextQuestion(true, selectedAnswer);
    } else if (!isCorrect && isIncorrect) {
      nextQuestion(false, selectedAnswer);
    }

    setIsIncorrect(false);
    setIsCorrect(false);
    setSelectedAnswer([]);
    setSelectedAnswer([]);
  }

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: .5, ease: "easeInOut"}}
      className="w-full h-full flex flex-col items-center gap-4 relative ">
      <h1 className="text-primary text-xl sm:text-2xl font-semibold inline-flex flex-col items-center relative">
        <span>Form the Sentence: </span>

        <span className="inline-flex items-center gap-1 text-background3 font-bold text-xl">
          {question.titleWords?.map((word: Word | null, index: number) => (
            <TitleWord word={word} key={index} index={index} titleString={question.title}/>
          ))}
        </span>
      </h1>

      <hr className={"w-full border"}/>

      {/* Selected Answer */}
      <div className="min-h-16 flex items-center justify-center gap-2">
        {selectedAnswer.map((word) => (
          <WordButton key={word.id} word={word} handleClick={handleWordClick}/>
        ))}
      </div>

      {/* Options */}
      <hr className={"w-full border"}/>
      <div className="w-full flex items-center gap-2 flex-wrap justify-center">
        {question.options?.map((option) => {
          if (!selectedAnswer.includes(option)) return <WordButton key={option.id} word={option}
                                                                   handleClick={handleWordClick}/>
        })}
      </div>

      <hr className={"w-full border"}/>
      {(!isIncorrect && !isCorrect) &&
        <button className={"submit-btn"} onClick={handleCheckAnswer}>Check Answer</button>
      }

      {isIncorrect && (
        <div className="flex items-center justify-between w-full bg-red-400 p-2 rounded text-xs sm:text-base">
          <div>
            <p className="font-semibold">Sorry, that was wrong!</p>
            <p className=""><strong>Correct Answer:</strong> {correctAnswer}</p>
          </div>

          <button className={"submit-btn"} onClick={() => handleGoNext()}>Next Question</button>
        </div>
      )}

      {isCorrect && (
        <div className="flex items-center justify-between w-full bg-green-400 p-2 rounded text-xs sm:text-base">

          <div>
            <p className="font-semibold">That&#39;s right!</p>
            <p className=""><strong>Correct Answer:</strong> {correctAnswer}</p>
          </div>

          <button className={"submit-btn"} onClick={() => handleGoNext()}>Next Question</button>
        </div>
      )}


    </motion.div>
  );
};

export default SentenceFormingQuestion;
