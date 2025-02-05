'use client';
import React, {useState} from 'react';
import {useSectionStore} from "@/stores/sectionStore";

const DeleteSection = () => {

  const { deleteSection, deleteSectionError, deleteSectionSuccess, isDeletingSection } = useSectionStore();

  const [userInput, setUserInput] = useState<number>(0);

  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDeletingSection || userInput === 0) return;
    deleteSection(userInput);
  }

  return (
    <div
      className={"w-96  h-64 bg-white p-4 rounded shadow-xl text-zinc-800 flex flex-col items-center gap-4 "}>
      <h1 className="font-semibold text-xl">Delete Section</h1>
      <hr className="w-full border"/>

      <form className="input-bar flex items-center" onSubmit={(e) => handleDelete(e)}>
        <input
          type="number"
          className="w-full focus:outline-none"
          placeholder="Question Id"
          disabled={isDeletingSection}
          value={userInput}
          onChange={(e) => setUserInput(e.target.valueAsNumber)}
        />
        <button
          disabled={isDeletingSection || userInput === 0}
          className={`submit-btn ${(isDeletingSection || userInput === 0) && 'disabled'}`}
        >
          Delete
        </button>
      </form>

      {deleteSectionSuccess && (
        <>
          <hr className="w-full border"/>
          <p className="font-semibold text-lg text-green-600">{deleteSectionSuccess}</p>
        </>
      )}

      {deleteSectionError && (
        <>
          <hr className="w-full border"/>
          <p className="font-semibold text-lg text-red-500">{deleteSectionError}</p>
        </>
      )}

    </div>
  );
};

export default DeleteSection;