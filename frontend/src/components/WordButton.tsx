import React from 'react';
import {Word} from "@/types/Types";

const WordButton = ({word, handleClick, version = "norsk", type = "text"}: {
  word: Word;
  handleClick: (word: Word) => void;
  version?: string;
  type?: "text" | "image";
}) => {

  if (type === "text") return (
    <div
      onClick={() => handleClick(word)}
      className="bg-background3 text-white px-2 py-1 rounded text-base sm:text-lg cursor-pointer hover:bg-accent shadow-lg hover:shadow-xl hover:scale-95 duration-300 select-none"
    >
      <p>{version === "norsk" ? word.norsk : word.eng}</p>
    </div>
  );
};

export default WordButton;