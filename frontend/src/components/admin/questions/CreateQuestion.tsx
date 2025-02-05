'use client';
import React, {useEffect, useState} from 'react';
import {useQuestionStore} from "@/stores/questionStore";
import {Question} from "@/types/Types";

const CreateQuestion = () => {


  const { createQuestion, isCreatingQuestion, createQuestionError, newQuestion } = useQuestionStore();

  const [answerInput, setAnswerInput] = useState<string>("");
  const [optionsInput, setOptionsInput] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [type, setType] = useState<string>("sentence-forming");

  useEffect(() => {
    // Reset the options input when the type changes to sentence-typing.
    // We do this, because we don't want to send any options when the type is sentence-typing
    if (type === "sentence-typing") {
      setOptionsInput("");
    }
  }, [type]);

  // Handle submit create question
  const handleSubmit = () => {
    if (isCreatingQuestion) return;
    createQuestion(title, type, optionsInput, answerInput);
  }


  return (
    <div className={"bg-white p-4 rounded shadow-xl text-zinc-800 flex flex-col items-center gap-4"}>
      <h1 className="font-semibold text-xl">Create Question</h1>

      <hr className="w-full border"/>

      <div className="w-full flex flex-col gap-2">
        <p>Title</p>
        <input
          type="text"
          className="input-bar"
          placeholder="I like my dog"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <hr className="w-full border"/>


      <div className="w-full flex flex-col gap-2">
        <p>Type</p>
        <select
          className="input-bar"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="sentence-typing">Sentence Typing</option>
          <option value="sentence-forming">Sentence Forming</option>
          <option value="image-choice">Image Choice</option>
        </select>
      </div>

      <hr className="w-full border"/>

      {type !== "sentence-typing" && (
        <>
          <div className="w-full flex flex-col gap-2">
            <p>Options</p>
            <p className="text-sm"><em>Please type the options separated by spaces, all lowercase. Options must be in
              Norsk.</em></p>
            <input
              type="text"
              className="input-bar"
              placeholder="Ex: 'Jeg liker hunden min'"
              value={optionsInput}
              onChange={(e) => setOptionsInput(e.target.value)}
            />
          </div>

          <hr className="w-full border"/>
        </>
      )}

      <div className="w-full flex flex-col gap-2">
        <p>Answer</p>
        <p className="text-sm"><em>Please type the answer separated by spaces, all lowercase. Answer must be in
          Norsk.</em></p>
        <input
          type="text"
          className="input-bar"
          placeholder="Ex: 'Jeg liker hunden min'"
          value={answerInput}
          onChange={(e) => setAnswerInput(e.target.value)}
        />
      </div>

      <hr className="w-full border"/>

      <button
        className={`submit-btn ${isCreatingQuestion && 'disabled'}`}
        disabled={isCreatingQuestion}
        onClick={handleSubmit}
      >
        Create Question
      </button>

      {createQuestionError &&
          <>
              <hr className="w-full border"/>
              <p className="text-red-600 text-lg font-semibold">{createQuestionError}</p>
          </>
      }

      {newQuestion && <DisplayNewQuestion newQuestion={newQuestion} />}
      
    </div>
  );
};

export default CreateQuestion;

const DisplayNewQuestion = ({newQuestion}: {newQuestion: Question}) => {

  const optionsStr = newQuestion.options && newQuestion.options.map((option) => option.norsk).join(" ");
  const answerStr = newQuestion.answer && newQuestion.answer.map((answer) => answer.norsk).join(" ");
  
  return (
    <div className="w-full flex flex-col gap-2 items-center">
      <hr className="w-full border"/>
      <h3 className="font-semibold text-lg text-green-600">New Question Created</h3>

      <div className="flex items-center flex-col gap-1">
        <p className="text-sm">Id: {newQuestion.id}</p>
        <p className="text-sm">Title: {newQuestion.title}</p>
        <p className="text-sm">Type: {newQuestion.type}</p>
        <p className="text-sm">Options: {optionsStr}</p>
        <p className="text-sm">Answer: {answerStr}</p>
      </div>

    </div>
  )
}