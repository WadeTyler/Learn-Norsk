
'use client';
import React, {useState} from 'react';
import {useWordStore} from "@/stores/wordStore";

const DeleteWord = () => {

  const [id, setId] = useState<number>(0);

  const { deleteWord, isDeletingWord, deleteWordError, deleteWordSuccess } = useWordStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    if (isDeletingWord) {
      return;
    }
    e.preventDefault();
    deleteWord(id);
  }

  return (
    <div className={"w-[40rem] bg-white p-4 rounded shadow-xl text-zinc-800 flex flex-col items-center gap-4"}>
      <h1 className="font-semibold text-xl">Delete Word</h1>
      <hr className="w-full border"/>

      <form className="flex items-center gap-2 w-full" onSubmit={(e) => handleSubmit(e)}>
        <input type="number" className="input-bar h-full" value={id}
          onChange={(e) => setId(e.target.valueAsNumber)}
        />
        <button className={`submit-btn text-sm ${isDeletingWord && 'disabled'}`}>Submit Delete</button>
      </form>

      <hr className="w-full border"/>

      {deleteWordError && <p className="text-red-600 text-lg font-semibold">{deleteWordError}</p>}
      {deleteWordSuccess && <p className="text-green-600 text-lg font-semibold">{deleteWordSuccess}</p> }

    </div>
  );
};

export default DeleteWord;