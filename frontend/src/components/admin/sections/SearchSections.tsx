'use client';
import React, {useEffect, useState} from 'react';
import {useSectionStore} from "@/stores/sectionStore";

const SearchSections = () => {

  const [userInput, setUserInput] = useState<number>(0);

  const { searchSectionsById, isSearchingSections, getAllSections, sections, total, fetchTotal } = useSectionStore();

  useEffect(() => {
    fetchTotal();
  }, [fetchTotal]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSearchingSections) return;

    if (userInput === 0 || !userInput) getAllSections();
    else searchSectionsById(userInput);
  }

  return (
    <div
      className={"w-[35rem] max-h-[60rem] bg-white p-4 rounded shadow-xl text-zinc-800 flex flex-col items-center gap-4"}>
      <h1 className="font-semibold text-xl">Search for Section</h1>
      <hr className="w-full border"/>

      <form className="input-bar flex items-center" onSubmit={(e) => handleSearch(e)}>
        <input
          type="number"
          className="w-full focus:outline-none"
          placeholder="Search by Id"
          disabled={isSearchingSections}
          value={userInput}
          onChange={(e) => setUserInput(e.target.valueAsNumber)}
        />
        <button
          disabled={isSearchingSections}
          className={`submit-btn`}
        >
          Search
        </button>
      </form>

      <hr className="w-full border"/>

      {total !== null &&
          <>
              <p className="font-semibold text-lg">Total Sections: {total}</p>
              <hr className="w-full border"/>
          </>
      }

      {sections &&
          <div className="w-full flex flex-col gap-2">
            {sections.map((section) => (
              <div key={section.id} className="w-full border rounded flex flex-col text-sm">
                <p>SID: {section.id}</p>
                <p>Title: {section.title}</p>
                <p>#: {section.sectionNumber}</p>
                <p>Exp: {section.experienceReward}</p>
                <p>Lessions: {section.lessons.length}</p>
                <p>Created: {section.createdAt}</p>
              </div>
            ))}
          </div>
      }
      
    </div>
  );
};

export default SearchSections;