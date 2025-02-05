'use client';
import React, {useState} from 'react';
import {Question, Word} from "@/types/Types";
import {motion} from 'framer-motion';
import TitleWord from "@/components/TitleWord";

const ImageChoiceQuestion = ({question, nextQuestion}: {
  question: Question;
  nextQuestion: (isCorrect: boolean, answer: Word[]) => void;
}) => {

  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isIncorrect, setIsIncorrect] = useState<boolean>(false);
  const [answered, setAnswered] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<Word[]>([]);

  const correctAnswer = question.answer[0];

  const checkAnswer = (word: Word) => {
    if (answered) return;

    setSelectedAnswer([word]);
    if (word.id === correctAnswer.id) {
      setIsCorrect(true);
      setAnswered(true);
    } else {
      setIsIncorrect(true);
      setAnswered(true);
    }
  }

  const handleGoNext = () => {

    if (isCorrect && !isIncorrect) {
      nextQuestion(true, selectedAnswer);
    }
    else if (!isCorrect && isIncorrect) {
      nextQuestion(false, selectedAnswer);
    }

    setIsIncorrect(false);
    setIsCorrect(false);
    setAnswered(false);
    setSelectedAnswer([]);
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
        <span className="text-primary">Select the Word For: </span>
        <span className="inline-flex items-center gap-1 flex-row">
          {question.titleWords?.map((word: Word | null, index: number) => (
            <TitleWord word={word} key={index} index={index} titleString={question.title} />
          ))}
        </span>
      </h1>

      <hr className={"w-full border"}/>

      <div className="grid grid-cols-2 items-center justify-center gap-2 w-full h-full">
        {question.options?.map((option) => (
          <motion.button
            key={option.id}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: .3, ease: "easeInOut"}}
            whileHover={{scale: .9}}
            onClick={() => checkAnswer(option)}
            className="w-full max-h-48 rounded flex flex-col items-center overflow-hidden shadow-xl cursor-pointer"
          >
            <img src={option.image} alt={`${option.norsk} Image`}
                 className={"w-full h-32 object-cover object-center"}/>
            <p
              className={`w-full h-full p-4 flex items-center justify-center text-background font-semibold text-xl duration-300 ${
                answered ? (correctAnswer.id === option.id ? 'bg-accent' : 'bg-background text-primary') : 'bg-background3'
              }
              `}
            >
              {option.norsk}
            </p>
          </motion.button>
        ))}
      </div>

      <hr className={"w-full border"}/>
      <div className="w-full h-16">
        {isCorrect &&
          <div className="flex items-center justify-between w-full bg-green-400 p-2 rounded max-h-16 text-xs sm:text-base">

            <div>
              <p className="font-semibold">That&#39;s right!</p>
              <p className=""><strong>Correct Answer:</strong> {correctAnswer.norsk}</p>
            </div>

            <button className={"submit-btn"} onClick={() => handleGoNext()}>Next Question</button>
          </div>
        }
        {isIncorrect && (
          <div className="flex items-center justify-between w-full bg-red-400 p-2 rounded max-h-16 text-xs sm:text-base">
            <div>
              <p className="font-semibold">Sorry, that was wrong!</p>
              <p className=""><strong>Correct Answer:</strong> {correctAnswer.norsk}</p>
            </div>

            <button className={"submit-btn"} onClick={() => handleGoNext()}>Next Question</button>
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default ImageChoiceQuestion;