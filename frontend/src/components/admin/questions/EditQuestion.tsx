'use client';
import React, {useState} from 'react';
import {Question} from "@/types/Types";
import {motion} from 'framer-motion';
import {useQuestionStore} from "@/stores/questionStore";
import ConfirmPanel from "@/components/util/ConfirmPanel";
import ChangeQuestionNumber from "@/components/admin/questions/ChangeQuestionNumber";

const EditQuestion = ({question, stopEditingQuestion, reloadSection}: {
  question: Question;
  stopEditingQuestion: () => void;
  reloadSection: () => void;
}) => {


  // Stores
  const {deleteQuestion, deleteQuestionError, isDeletingQuestion} = useQuestionStore();

  // States
  const [isConfirmingDeleteQuestion, setIsConfirmingDeleteQuestion] = useState<boolean>(false);
  const [isChangingQuestionNumber, setIsChangingQuestionNumber] = useState<boolean>(false);

  // Functions
  async function handleDeleteQuestion() {
    if (isDeletingQuestion) return;
    const isSuccess = await deleteQuestion(question.id);
    if (isSuccess) {
      reloadSection();
      stopEditingQuestion();
    }
  }


  return (
    <motion.div
      initial={{x: '-100%', opacity: 0}}
      animate={{x: 0, opacity: 1}}
      exit={{x: '-100%', opacity: 0}}
      transition={{duration: .2}}
      className={"fixed w-[25rem] h-full top-0 left-[35rem] flex flex-col gap-4 p-4 pt-32 overflow-y-scroll bg-white shadow-xl z-40"}
    >

      <p className="text-primary font-semibold text-2xl">Editing Question</p>

      <hr className="border w-full"/>

      <div className="flex flex-col">
        <p className="input-label">QUESTION ID</p>
        <p>{question.id}</p>
      </div>

      <div className="flex flex-col">
        <p className="input-label">QUESTION NUMBER</p>
        <p>{question.questionNumber}</p>
      </div>

      <div className="flex flex-col">
        <p className="input-label">TYPE</p>
        <p>{question.type}</p>
      </div>

      <div className="flex flex-col">
        <p className="input-label">TITLE</p>
        <p>{question.title}</p>
      </div>

      <div className="flex flex-col">
        <p className="input-label">OPTIONS</p>
        <p>{question.options?.map((option) => option.norsk).join((" "))}</p>
      </div>

      <div className="flex flex-col">
        <p className="input-label">ANSWER</p>
        <p>{question.answer.map((answer) => answer.norsk).join(" ")}</p>
      </div>

      <hr className="w-full border"/>

      <div className="flex items-center justify-center w-full gap-4">
        <button className="submit-btn text-sm" onClick={() => setIsChangingQuestionNumber(true)}>Change Question Number</button>
        <button className="delete-btn text-sm" onClick={() => setIsConfirmingDeleteQuestion(true)}>Delete Question</button>
        <button className="cancel-btn" onClick={stopEditingQuestion}>Cancel</button>
      </div>

      {deleteQuestionError && (
        <>
          <hr className="w-full border"/>
          <p className="text-red-500">{deleteQuestionError}</p>
        </>
      )}

      {isChangingQuestionNumber && (
        <ChangeQuestionNumber question={question} cancel={() => setIsChangingQuestionNumber(false)} reloadSection={reloadSection} />
      )}

      {isConfirmingDeleteQuestion && (
        <ConfirmPanel header={"You are about to delete a question!"}
                      body={"Are you sure you want to delete this question?"}
                      cancelFunc={() => setIsConfirmingDeleteQuestion(false)} confirmFunc={handleDeleteQuestion}/>
      )}


    </motion.div>
  );
};

export default EditQuestion;