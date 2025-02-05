'use client';
import React, {useEffect, useState} from 'react';

import {useParams, useRouter} from "next/navigation";
import {useProtected} from "@/hooks/useProtected";
import {useSectionStore} from "@/stores/sectionStore";
import LoadingScreen from "@/components/util/LoadingScreen";
import {AnimatePresence, motion} from 'framer-motion';
import SentenceFormingQuestion from "@/components/SentenceFormingQuestion";
import  {Word} from "@/types/Types";
import {useLessonStore} from "@/stores/lessonStore";
import toast from "react-hot-toast";
import {IconArrowNarrowLeftDashed} from "@tabler/icons-react";
import ImageChoiceQuestion from "@/components/ImageChoiceQuestion";
import SentenceTypeQuestion from "@/components/SentenceTypeQuestion";
import {getRandomAffirmation, getRandomMistakeAffirmation} from "@/constants/messages";
import {useUserStore} from "@/stores/userStore";

const Page = () => {

  // Protection
  const { isCheckingProtection } = useProtected();

  // States
  const { sectionId, lessonId } = useParams();
  const [sectionIdNum] = useState<number | null>(typeof sectionId === "string" ? parseInt(sectionId) : null);
  const [lessonIdNum] = useState<number | null>(typeof lessonId === "string" ? parseInt(lessonId) : null);
  const [countCorrect, setCountCorrect] = useState<number>(0);
  // const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [questionsSinceAffirmation, setQuestionsSinceAffirmation] = useState<number>(0);
  const [questionsSinceCorrect, setQuestionsSinceCorrect] = useState<number>(0);

  // Nav
  const router = useRouter();

  // Stores
  const { currentQuestion, questionsLength, questions, isLoadingQuestions, fetchQuestions, fetchQuestionsError, setFetchQuestionsError, handleIncorrectQuestion, handleNextQuestion } = useSectionStore();
  const { isCheckingAnswers, checkAnswers, resetUserAnswers, addToUserAnswers } = useLessonStore();
  const { user } = useUserStore();

  // Fetch questions on load
  useEffect(() => {
    const handleLoadQuestions = () => {
      if (lessonIdNum && sectionIdNum) {
        fetchQuestions(sectionIdNum, lessonIdNum);
        resetUserAnswers();
      } else {
        setFetchQuestionsError("Invalid URL. sectionId or lessonId invalid.");
      }
    }

    if (user) handleLoadQuestions();

  }, [fetchQuestions, sectionId, lessonId, user, lessonIdNum, resetUserAnswers, sectionIdNum, setFetchQuestionsError]);


  const nextQuestion = async (isCorrect: boolean, answer: Word[]) => {

    if (!currentQuestion) return;

    // This condition check is important, because if the question is incorrect we just want to move it to the end of the stack
    // If we do that, the index will stay the same, so we don't have to increment the currentQuestion.
    if (!isCorrect) {
      handleIncorrectQuestion(currentQuestion);
      handleNextQuestion();
      setQuestionsSinceCorrect(prev => prev += 1);
      setQuestionsSinceAffirmation(prev => prev + 1);
      return;
    }

    // Question is correct!
    setQuestionsSinceCorrect(0);

    // add answer to the userAnswers array
    const newUserAnswer = { questionId: currentQuestion.id, answer: answer };
    await addToUserAnswers(newUserAnswer);

    // Check if at last question
    if (questions.length === 0) {
      if (lessonIdNum && sectionIdNum) {
        // Check answers
        const answersValid = await checkAnswers(sectionIdNum, lessonIdNum);

        // Correct answers,
        if (answersValid) {
          toast.success("Lesson Complete! Good Job! 👍");
          router.push(`/learn?sectionId=${sectionIdNum}`);
          return;
        }
      } else {
        // Should only reach this step if a true bug happens or the user is experimenting outside UI
        toast.error("Something went wrong");
        return;
      }
    }
    // Increment if not the last question
    else {
      handleNextQuestion();
    }
    setCountCorrect(prev => prev += 1);
    setQuestionsSinceAffirmation(prev => prev += 1);
  }

  const goBackToLearnPage = () => {
    if (sectionIdNum) {
      router.push(`/learn?sectionId=${sectionIdNum}`);
    } else {
      router.push("/learn");
    }
  }

  // Show an affirmation every 3 questions correct, or every 3 questions wrong in a row
  useEffect(() => {
    const handleAffirmations = () => {
      // If it's been 3+ questions since aff
      if (questionsSinceAffirmation >= 3) {

        // If we haven't gotten a question correct in 3+ tries
        if (questionsSinceCorrect >= 3) {
          toast(getRandomMistakeAffirmation(), {
            removeDelay: 4000,
          });
        }
        // Show regular aff instead
        else {
          toast(getRandomAffirmation(), {
            removeDelay: 4000,
          });
        }
        // Reset aff counter
        setQuestionsSinceAffirmation(0);
      }
    }

    if (user) handleAffirmations();

  }, [questionsSinceAffirmation, questionsSinceCorrect, user]);

  // Conditional Returns
  if (isCheckingProtection || isLoadingQuestions || isCheckingAnswers) return <LoadingScreen />
  if (fetchQuestionsError) return <DisplayError errorMessage={fetchQuestionsError} />
  if (!questions) return <DisplayError errorMessage={"Questions not found"} />

  return (
    <div className="w-full h-screen md:pt-16 md:p-0 p-4 flex items-center justify-center flex-col">

      <div className="w-full sm:w-[30rem] md:w-[40rem]">
        <button
          onClick={goBackToLearnPage}
          className="inline-flex items-center gap-1 text-lg text-accentLight hover:text-white hover:bg-accent p-1 duration-300 rounded hover:shadow-xl select-none"
        >
          <IconArrowNarrowLeftDashed/> Go Back
        </button>
      </div>
      {/* Progress Bar */}
      <div className="w-full sm:w-[30rem] md:w-[40rem] rounded-full bg-white h-6 my-4 shadow-xl overflow-hidden">
        <div
          className={`h-full bg-accent duration-700`}
          style={{
            width: `${(countCorrect / questionsLength) * 100}%`
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .5 }}
        className="w-full sm:w-[30rem] md:w-[40rem] bg-white shadow-xl rounded h-[40rem] p-4"
      >
        {currentQuestion &&
            <AnimatePresence initial={false}>
            {/* Sentence Forming Type */}
            {currentQuestion.type === "sentence-forming" &&
                <SentenceFormingQuestion question={currentQuestion} nextQuestion={nextQuestion} />
            }

            {currentQuestion.type === "image-choice" &&
              <ImageChoiceQuestion question={currentQuestion} nextQuestion={nextQuestion} />
            }

            {currentQuestion.type === "sentence-typing" &&
              <SentenceTypeQuestion question={currentQuestion} nextQuestion={nextQuestion} />
            }

          </AnimatePresence>
        }
      </motion.div>

    </div>
  );
};

export default Page;

const DisplayError = ({errorMessage}: {
  errorMessage: string;
}) => {

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <h2 className="text-primary text-lg font-semibold">Something went wrong</h2>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  )
}