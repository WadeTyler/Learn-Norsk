import React from 'react';
import {Word} from "@/types/Types";

const WordButton = ({
                      word,
                      ver = "norsk",
                      handleWordClick
}: {
  word: Word;
  ver?: "eng" | "norsk";
  handleWordClick: (word: Word) => void;
}) => {


  return (
    <div
      onClick={() => handleWordClick(word)}
      className={"bg-zinc-400 rounded p-1 cursor-pointer hover:bg-zinc-300 hover:text-green-500 duration-300"}
    >
      {ver === "eng" ? word.eng : word.norsk}
    </div>
  );
};

export default WordButton;