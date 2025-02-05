'use client';
import React, {useEffect, useState} from 'react';
import {useLessonStore} from "@/stores/lessonStore";

const SearchLessons = () => {

  const { isSearchingLessons, lessons, searchLessons, searchLessonsById, total, fetchTotal } = useLessonStore();

  const [userInput, setUserInput] = useState<string>("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSearchingLessons) return;

    if (!userInput) {
      searchLessons();
    } else {
      searchLessonsById(parseInt(userInput));
    }
  }

  useEffect(() => {
    fetchTotal();
  }, [fetchTotal]);

  return (
    <div
      className={"w-[35rem] max-h-[60rem] bg-white p-4 rounded shadow-xl text-zinc-800 flex flex-col items-center gap-4"}>
      <h1 className="font-semibold text-xl">Search for Lesson</h1>
      <hr className="w-full border"/>

      <form className="input-bar flex items-center" onSubmit={(e) => handleSearch(e)}>
        <input
          type="text"
          className="w-full focus:outline-none"
          placeholder="Search by Id"
          disabled={isSearchingLessons}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          disabled={isSearchingLessons}
          className={`submit-btn`}
        >
          Search
        </button>
      </form>

      <hr className="w-full border"/>

      {total &&
          <>
              <p className="font-semibold text-lg">Total Lessons: {total}</p>
              <hr className="w-full border"/>

          </>
      }

      {lessons &&
        <div className="flex flex-col gap-2 overflow-scroll">
          {lessons.map((lesson) => (
              <div key={lesson.id} className={"w-full rounded flex flex-col gap-1 text-sm"}>
                <div className="flex gap-4 font-semibold text-primary">
                  <p>LID: {lesson.id},</p>
                  <p>#: {lesson.lessonNumber},</p>
                  <p>EXP: {lesson.experienceReward}</p>
                </div>
                <p>Title: {lesson.title}</p>
                <p>Desc: {lesson.description}</p>
                <div className="flex flex-col gap-1">
                  {lesson.questions?.map((question) => (
                    <div key={question.id} className={"w-full border flex gap-1 items-center p-2 rounded"}>
                      <p>QID: {question.id}</p>
                      <p>Type: {question.type}</p>
                      <p>Title: {question.title}</p>
                      <p>Options: {question.options?.map((option) => option.norsk).join(", ")}</p>
                      <p>Answer: {question.answer.map((answer) => answer.norsk).join(", ")}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          }
        </div>
      }

    </div>
  );
};

export default SearchLessons;