'use client';
import React, {useState} from 'react';
import {Word} from "@/types/Types";
import {useWordStore} from "@/stores/wordStore";

const UpdateWord = () => {

  const [id, setId] = useState<number>(0);
  const [formData, setFormData] = useState<Word>({
    norsk: "",
    eng: "",
    image: ""
  });

  const { updateWord, isUpdatingWord, updatedWord, updateWordError } = useWordStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isUpdatingWord) return;
    e.preventDefault();
    updateWord(id, formData);
  }

  return (
    <div className={"w-[40rem] bg-white p-4 rounded shadow-xl text-zinc-800 flex flex-col items-center gap-4"}>
      <h1 className="font-semibold text-xl">Update Word</h1>
      <hr className="w-full border"/>

      <form onSubmit={(e) => handleSubmit(e)} className="w-full flex flex-col items-center gap-2">

        <div className="w-full flex items-center gap-2">
          <input
            type="number"
            className="input-bar"
            placeholder="Id"
            value={id}
            onChange={(e) => setId(e.target.valueAsNumber)}
          />
          <input
            type="text"
            className="input-bar"
            placeholder="Norsk"
            value={formData.norsk}
            onChange={(e) => setFormData({...formData, norsk: e.target.value})}
          />
          <input
            type="text"
            className="input-bar"
            placeholder="Eng"
            value={formData.eng}
            onChange={(e) => setFormData({...formData, eng: e.target.value})}
          />
          <input
            type="text"
            className="input-bar"
            placeholder="Image"
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
          />
        </div>

        <button className={`submit-btn ${isUpdatingWord && 'disabled'}`} disabled={isUpdatingWord}>Submit Change</button>

      </form>

      <hr className="w-full border"/>

      {updatedWord && (
        <div className="w-full flex items-center gap-2">
          <p className="w-full">Id: {updatedWord.id}</p>
          <p className="w-full">Norsk: {updatedWord.norsk}</p>
          <p className="w-full">Eng: {updatedWord.eng}</p>
          {updatedWord.image && <img src={updatedWord.image} alt={"New Word Image"} className={"w-full max-w-36 max-h-36"} />}
        </div>
      )}

      {updateWordError && (
        <p className="text-red-600 font-semibold text-lg">{updateWordError}</p>
      )}

    </div>
  );
};

export default UpdateWord;
