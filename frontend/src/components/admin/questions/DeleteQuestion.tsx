'use client';
import React, { useState } from 'react';
import {useQuestionStore} from "@/stores/questionStore";

const DeleteQuestion = () => {

  const { deleteQuestion, isDeletingQuestion, deleteQuestionSuccess, deleteQuestionError } = useQuestionStore();

  const [userInput, setUserInput] = useState<number>(0);

  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDeletingQuestion || userInput === 0) return;
    deleteQuestion(userInput);
  }

  return (
    <div
      className={"w-96  h-64 bg-white p-4 rounded shadow-xl text-zinc-800 flex flex-col items-center gap-4 "}>
      <h1 className="font-semibold text-xl">Delete Question</h1>
      <hr className="w-full border"/>

      <form className="input-bar flex items-center" onSubmit={(e) => handleDelete(e)}>
        <input
          type="number"
          className="w-full focus:outline-none"
          placeholder="Question Id"
          disabled={isDeletingQuestion}
          value={userInput}
          onChange={(e) => setUserInput(e.target.valueAsNumber)}
        />
        <button
          disabled={isDeletingQuestion || userInput === 0}
          className={`submit-btn ${(isDeletingQuestion || userInput === 0) && 'disabled'}`}
        >
          Delete
        </button>
      </form>

      {deleteQuestionSuccess && (
        <>
          <hr className="w-full border"/>
          <p className="font-semibold text-lg text-green-600">{deleteQuestionSuccess}</p>
        </>
      )}

      {deleteQuestionError && (
        <>
          <hr className="w-full border"/>
          <p className="font-semibold text-lg text-red-500">{deleteQuestionError}</p>
        </>
      )}


    </div>
  );
};

export default DeleteQuestion;