'use client';
import React, {useState} from 'react';
import {Question, Word} from "@/types/Types";
import { motion } from 'framer-motion';
import {norskLetters} from "@/constants/norsk-data";
import TitleWord from "@/components/TitleWord";

const SentenceTypeQuestion = ({question, nextQuestion}: {
  question: Question;
  nextQuestion: (isCorrect: boolean, answer: Word[]) => void;
}) => {

  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isIncorrect, setIsIncorrect] = useState<boolean>(false);
  const [answered, setAnswered] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<Word[]>([]);
  const [userInput, setUserInput] = useState<string>("");


  const correctAnswer: Word[] = question.answer;

  const checkAnswer = () => {
    if (answered || !userInput) return;

    setAnswered(true);

    const userAnswerStrArr = userInput.trim().split(" ");

    // compare lengths
    if (userAnswerStrArr.length !== correctAnswer.length) {
      setSelectedAnswer([]);
      setIsIncorrect(true);
      return;
    }

    // Compare each word
    for (let i = 0; i < userAnswerStrArr.length; i++) {
      if (userAnswerStrArr[i].toLowerCase() !== correctAnswer[i].norsk.toLowerCase()) {
        setSelectedAnswer([]);
        setIsIncorrect(true);
        return;
      }
      setSelectedAnswer(prev => [...prev, correctAnswer[i]]);
    }

    // Answer is correct and selectedAnswer should be fully set
    setIsCorrect(true);
  }

  const handleGoNext = () => {

    if (isCorrect && !isIncorrect) {
      nextQuestion(true, selectedAnswer);
    }
    else if (!isCorrect && isIncorrect) {
      nextQuestion(false, selectedAnswer);
    }

    // Reset states
    setUserInput("");
    setIsIncorrect(false);
    setIsCorrect(false);
    setAnswered(false);
    setSelectedAnswer([]);
  }

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: .5, ease: "easeInOut"}}
      className="w-full h-full flex flex-col items-center gap-4 relative"
    >
      <h1 className="text-xl sm:text-2xl font-semibold inline-flex flex-col items-center">
        <span className="text-primary">How do you say: </span>
        <span className="inline-flex items-center gap-1 flex-row">
          {question.titleWords?.map((word: Word | null, index: number) => (
          <TitleWord word={word} key={index} index={index} titleString={question.title} />
        ))}
        </span>
      </h1>

      <hr className={"w-full border"}/>

      <form
        className="w-full flex items-center flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          checkAnswer();
        }}
      >
        <textarea
          className={"w-full input-bar rounded resize-none h-32 "}
          placeholder={"Type your answer here"}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={answered}
        />

        <div className="flex gap-2 items-center">
          {norskLetters.map((letter) => (
            <div
              key={letter}
              className={"bg-background3 text-white px-2 py-1 rounded text-lg cursor-pointer hover:bg-accent shadow-lg hover:shadow-xl hover:scale-95 duration-300 select-none"}
              onClick={() => setUserInput(prev => prev += letter)}
            >
              {letter}
            </div>
          ))}
        </div>

        <hr className={"w-full border"}/>
        <button className={`submit-btn ${answered && 'disabled'}`} disabled={answered}>Submit</button>
      </form>

      {answered && <hr className={"w-full border"}/>}

      {isCorrect &&
        <div className="flex items-center justify-between w-full bg-green-400 p-2 rounded min-h-16 text-xs sm:text-base">

          <div>
            <p className="font-semibold">That&#39;s right!</p>
            <p className=""><strong>Correct Answer:</strong> {correctAnswer.map((word) => word.norsk).join(" ")}</p>
          </div>

          <button className={"submit-btn"} onClick={() => handleGoNext()}>Next Question</button>
        </div>
      }
      {isIncorrect && (
        <div className="flex items-center justify-between w-full bg-red-400 p-2 rounded min-h-16 text-xs sm:text-base">
          <div>
            <p className="font-semibold">Sorry, that was wrong!</p>
            <p className=""><strong>Correct Answer:</strong> {correctAnswer.map((word) => word.norsk).join(" ")}</p>
          </div>

          <button className={"submit-btn"} onClick={() => handleGoNext()}>Next Question</button>
        </div>
      )}

    </motion.div>
  );
};

export default SentenceTypeQuestion;