'use client';
import React, { useState } from 'react';
import {Word} from "@/types/Types";

const TitleWord = ({word, titleString, index}: {
  word: Word | null;
  titleString: string;
  index: number;
}) => {

  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <span className="relative">
      {word && (
        <span className={`relative underline cursor-pointer ${hovering && 'text-accent'}`} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
        >
          {word.eng}
        </span>
      )}
      {word && hovering && (
        <WordTooltip word={word} />
      )}
      {!word && (
        titleString.split(" ")[index]
      )}
    </span>
  );
};

export default TitleWord;


const WordTooltip = ({ word }: {
  word: Word | null;
}) => {

  if (!word) return;

  return (
    <div className="absolute left-1/2 top-full -translate-x-1/2 flex flex-col items-center p-2 bg-[rgba(0,0,0,.5)] text-white font-bold w-48 text-lg rounded">
      {word.norsk}
    </div>
  )
}