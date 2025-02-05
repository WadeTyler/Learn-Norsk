'use client';
import React, {useEffect, useState} from 'react';
import {useWordStore} from "@/stores/wordStore";

const SearchWords = () => {

  const {
    total,
    fetchTotal,
    isLoadingTotal,
    searchForWord,
    isSearchingForWord,
    words,
    searchForWordError
  } = useWordStore();
  const [userInput, setUserInput] = useState("");

  const handleSearch = () => {
    searchForWord(userInput);
  }

  useEffect(() => {
    fetchTotal();
  }, [fetchTotal]);

  return (
    <div
      className="w-[40rem] bg-white p-4 rounded shadow-xl max-h-[30rem] text-zinc-800 flex flex-col items-center gap-4 overflow-scroll">
      <h1 className="font-semibold text-xl">Search for words</h1>
      <hr className="w-full border"/>

      {total && (
        <>
          <p className="font-semibold text-lg">Total words: {total}</p>
          <hr className="w-full border"/>
        </>
      )}

      {isLoadingTotal && (
        <>
          <p className="font-semibold text-lg">Loading total...</p>
          <hr className="w-full border"/>
        </>
      )}

      <form className="input-bar flex items-center" onSubmit={handleSearch}>
        <input
          type="text"
          className=" bg-transparent w-full focus:outline-none"
          placeholder="Search by English or Norsk"
          disabled={isSearchingForWord}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className={`submit-btn`}
          disabled={isSearchingForWord}
        >
          Search
        </button>
      </form>

      <hr className="w-full border"/>

      {searchForWordError && <p className="text-red-600 font-semibold text-lg">{searchForWordError}</p>}

      {words && words.length > 0 && (
        <div className="w-full flex flex-col gap-2 items-center overflow-scroll">
          {words.map((word) => (
            <div className="flex w-full items-center border p-2" key={word.id}>
              <p className="w-1/3">Id: {word.id}</p>
              <p className="w-full">Norsk: {word.norsk}</p>
              <p className="w-full">Eng: {word.eng}</p>
              <p className="text-xs w-full">Img: {word.image ? <a href={word.image} target={"_blank"} className={"underline cursor-pointer text-accent"}>Link</a> : 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchWords;