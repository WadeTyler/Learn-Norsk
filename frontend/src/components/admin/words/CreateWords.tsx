'use client';
import React, {SetStateAction, useEffect, useState} from 'react';
import {Word} from "@/types/Types";
import {useWordStore} from "@/stores/wordStore";

const CreateWords = () => {

  const { addWords, existingWords, isAddingWords, addWordsError } = useWordStore();

  const [words, setWords] = useState<Word[]>([]);

  const handleAddWord = () => {
    const emptyWord: Word = {
      norsk: "",
      eng: "",
      image: ""
    }
    setWords([...words, emptyWord]);
  }

  useEffect(() => {
    console.log(words);
  }, [words]);

  const submitAddWords = () => {
    addWords(words);
  }


  return (
    <div className={"w-[40rem] max-h-[30rem] overflow-scroll bg-white p-4 rounded shadow-xl text-zinc-800 flex flex-col items-center gap-4"}>
      <h1 className="font-semibold text-xl">Add Words</h1>

      <hr className="w-full border" />
      
      <div className="gap-4 w-full h-full flex flex-col items-center overflow-scroll" id={"add-words-container"}>
        {words.map((word: Word, index) => (
          <AddWordInputBar key={index} index={index}  words={words} setWords={setWords}/>
        ))}
      </div>

      <hr className="w-full border" />

      <button
        className={"bg-zinc-400 px-2 py-1 rounded shadow-lg text-white duration-300 hover:bg-zinc-300"}
        onClick={handleAddWord}
      >
        Add Word
      </button>

      {!isAddingWords && <button
          className={`submit-btn ${words.length === 0 && "disabled"}`}
          onClick={submitAddWords}
          disabled={words.length === 0}
      >
          Submit Words
      </button>}

      {addWordsError && <p className="text-red-600 font-semibold text-lg">{addWordsError}</p> }

      {existingWords.length > 0 && (
        <>
          <hr className="w-full border"/>
          <ExistingWords existingWords={existingWords} />
        </>
      )}

    </div>
  );
};

export default CreateWords;

const AddWordInputBar= ({words, index, setWords}: {
  words: Word[];
  setWords: React.Dispatch<SetStateAction<Word[]>>;
  index: number;
}) => {


  const handleChange = (field: keyof Word, value: string) => {
    setWords((prev) => {
      const newWords = [...prev];
      newWords[index] = { ...newWords[index], [field]: value};
      return newWords
    });
  };

  const removeWord = () => {
    setWords(prev => prev.filter((w, i) => i !== index));
  }


  return (
    <div className={"flex gap-2 items-center w-full"}>
      <p>{index}</p>

      <input
        type="text"
        className="input-bar"
        placeholder="Norsk"
        value={words[index]?.norsk || ""}
        onChange={(e) => handleChange("norsk", e.target.value)}
      />
      <input
        type="text"
        className="input-bar"
        placeholder="English"
        value={words[index]?.eng || ""}
        onChange={(e) => handleChange("eng", e.target.value)}
      />
      <input
        type="text"
        className="input-bar"
        placeholder="Image URL"
        value={words[index]?.image || ""}
        onChange={(e) => handleChange("image", e.target.value)}
      />

      <button
        className={"text-xs text-white bg-red-600 hover:bg-red-500 px-2 py-1 duration-300 shadow rounded"}
        onClick={removeWord}
      >
        Remove
      </button>
    </div>
  );
};

const ExistingWords = ({existingWords}: {existingWords: Word[]}) => {

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <h2 className="font-semibold text-red-600 text-lg">The following words already exist:</h2>
      {existingWords.map((word: Word) => (
        <div key={word.id} className="w-full flex items-center gap-1 border rounded p-2">
          <p className="w-full">Id: {word.id}</p>
          <p className="w-full">Norsk: {word.norsk}</p>
          <p className="w-full">Eng: {word.eng}</p>
        </div>
      ))}
    </div>
  )
}