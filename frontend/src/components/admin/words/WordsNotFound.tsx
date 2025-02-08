'use client';
import React, {useEffect, useState} from 'react';
import {useQuestionStore} from "@/stores/questionStore";
import {Word} from "@/types/Types";
import {useWordStore} from "@/stores/wordStore";
import {LoadingSM} from "@/components/util/Loading";

const WordsNotFound = () => {

  // Store
  const {notFoundWords, resetNotFoundWords} = useQuestionStore();
  const {addWords, isAddingWords, addWordsError} = useWordStore();

  // States
  const [words, setWords] = useState<Word[]>([]);

  // UseEffects
  useEffect(() => {
    // Add template words to words array
    notFoundWords.forEach((wordStr) => {
      setWords(prev => [...prev, {
        "norsk": wordStr,
        "eng": "",
        "image": "",
      }]);
    })
    return () => {
      setWords([]);
    }
  }, [notFoundWords]);


  // Functions
  function handleNorskChange(index: number, value: string) {
    setWords(prevWords => {
      const newWords = [...prevWords];
      newWords[index] = {...newWords[index], norsk: value};
      return newWords;
    })
  }

  function handleEngChange(index: number, value: string) {
    setWords(prevWords => {
      const newWords = [...prevWords];
      newWords[index] = {...newWords[index], eng: value};
      return newWords;
    })
  }

  function handleImageChange(index: number, value: string) {
    setWords(prevWords => {
      const newWords = [...prevWords];
      newWords[index] = {...newWords[index], image: value};
      return newWords;
    })
  }

  async function handleSubmit() {
    if (isAddingWords) return;
    const isSuccess = await addWords(words);
    if (isSuccess) {
      resetNotFoundWords();
    }
  }

  // Returns

  if (notFoundWords) return (
    <div className={"fixed top-0 left-0 w-full h-screen bg-[rgba(0,0,0,.8)] flex items-center justify-center z-50"}>

      <div className="w-[35rem] bg-white rounded flex flex-col gap-4">

        <p className={"text-primary font-semibold text-2xl px-4 pt-4"}>Some or all of the words were not found!</p>

        <form
          className={"max-h-96 flex flex-col gap-4 overflow-y-scroll"}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >

          {words.map((word, index) => (
            <div key={index} className={"w-full flex items-center justify-between gap-2 px-4"}>
              <div className="flex flex-col">
                <p className="input-label">NORSK</p>
                <input type="text" className={"input-bar"} value={word.norsk}
                       onChange={(e) => handleNorskChange(index, e.target.value)}/>
              </div>
              <div className="flex flex-col">
                <p className="input-label">ENG</p>
                <input type="text" className={"input-bar"} value={word.eng}
                       onChange={(e) => handleEngChange(index, e.target.value)}/>
              </div>
              <div className="flex flex-col">
                <p className="input-label">IMAGE</p>
                <input type="text" className={"input-bar"} value={word.image}
                       onChange={(e) => handleImageChange(index, e.target.value)}/>
              </div>
            </div>
          ))}

          <div className="p-4 bg-background3 flex items-center justify-end gap-4 rounded-b">

            {addWordsError && <p className="font-semibold text-red-500">{addWordsError}</p>}

            <button className="submit-btn">
              {!isAddingWords
                ? 'Add Words'
                : <LoadingSM/>
              }
            </button>
            <section className="cancel-btn" onClick={resetNotFoundWords}>Cancel</section>
          </div>

        </form>

      </div>

    </div>
  );
};

export default WordsNotFound;