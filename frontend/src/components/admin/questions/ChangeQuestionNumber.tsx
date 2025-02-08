'use client';
import React, {useState} from 'react';
import {Question} from "@/types/Types";
import {useQuestionStore} from "@/stores/questionStore";

const ChangeQuestionNumber = ({question, cancel, reloadSection}: {
  question: Question;
  cancel: () => void;
  reloadSection: () => void;
}) => {

  // Store
  const { changeQuestionNumber, isChangingQuestionNumber, changeQuestionNumberError } = useQuestionStore();

  // States
  const [questionNumber, setQuestionNumber] = useState<number>(question.questionNumber);

  // Function
  async function saveChange() {
    if (isChangingQuestionNumber) return;

    const newQuestion = await changeQuestionNumber(question.id, questionNumber);
    if (newQuestion) {
      reloadSection();
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-[rgba(0,0,0,.8)] flex items-center justify-center z-40">
      <div className="w-96 flex flex-col bg-white gap-4 rounded">
        <p className="text-primary text-2xl font-semibold pt-4 px-4">Change Question Number</p>
        <div className="flex flex-col px-4">
          <p className="input-label">QUESTION NUMBER</p>
          <input
            type="number"
            className="input-bar"
            value={questionNumber}
            onChange={(e) => setQuestionNumber(e.target.valueAsNumber)}
          />
        </div>
        <div className="w-full p-4 bg-background3 flex items-center justify-end gap-2 rounded-b">
          {changeQuestionNumberError && <p className={"text-red-500 font-semibold"}>{changeQuestionNumberError}</p>}
          <button className="submit-btn" onClick={saveChange}>Save Changes</button>
          <button className="cancel-btn" onClick={cancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ChangeQuestionNumber;