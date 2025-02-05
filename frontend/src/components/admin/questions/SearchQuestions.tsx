'use client';
import React, {useEffect, useState} from 'react';
import {useQuestionStore} from "@/stores/questionStore";
import toast from "react-hot-toast";

const SearchQuestions = () => {

  const [userInput, setUserInput] = useState<string>("");

  const { total, fetchTotal, isSearchingForQuestion, searchForQuestion, questions } = useQuestionStore();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSearchingForQuestion) return;
    searchForQuestion(userInput);
  }

  useEffect(() => {
    fetchTotal();
    searchForQuestion("");
  }, [fetchTotal, searchForQuestion]);

  return (
    <div
      className={"bg-white p-4 rounded shadow-xl text-zinc-800 flex flex-col items-center gap-4 max-h-[35rem]"}>
      <h1 className="font-semibold text-xl">Search for Question</h1>
      <hr className="w-full border"/>

      <form className="input-bar flex items-center" onSubmit={(e) => handleSearch(e)}>
        <input
          type="text"
          className="w-full focus:outline-none"
          placeholder="Search by Title or Id"
          disabled={isSearchingForQuestion}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          disabled={isSearchingForQuestion}
          className={`submit-btn`}
        >
          Search
        </button>
      </form>

      <hr className="w-full border"/>

      {total && (
        <>
          <p className="font-semibold text-lg">Total questions: {total}</p>
          <hr className="w-full border"/>
        </>
      )}


      {questions && (
        <div className="w-full flex flex-col gap-2 overflow-scroll">
          {questions.map(question => (
            <div
              className="cursor-pointer w-full border rounded p-2 hover:scale-95 duration-300"
              key={question.id}
              onClick={() => {
                console.log(`Question ${question.id}: `, question);
                toast.success("Full Question output to console.");
              }}
            >
              <p className="w-full"><strong>Id:</strong> {question.id}</p>
              <p className="w-full"><strong>Title:</strong> {question.title}</p>
              <p className="w-full"><strong>Type:</strong> {question.type}</p>
              <p className="w-full"><strong>Options:</strong> {question.options?.map(option => option.norsk).join(" ")}
              </p>
              <p className="w-full"><strong>Answer:</strong> {question.answer?.map(answer => answer.norsk).join(" ")}
              </p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default SearchQuestions;