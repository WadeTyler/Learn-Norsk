'use client';
import React, {useState} from 'react';
import {useLessonStore} from "@/stores/lessonStore";

const DeleteLesson = () => {

  const { deleteLessonSuccess, deleteLessonError, deleteLesson, isDeletingLesson } = useLessonStore();

  const [lessonId, setLessonId] = useState<number>(0);

  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDeletingLesson) return;

    deleteLesson(lessonId);
  }

  return (
    <div
      className={"w-96  h-64 bg-white p-4 rounded shadow-xl text-zinc-800 flex flex-col items-center gap-4 "}>
      <h1 className="font-semibold text-xl">Delete Lesson</h1>
      <hr className="w-full border"/>

      <form className="input-bar flex items-center" onSubmit={(e) => handleDelete(e)}>
        <input
          type="number"
          className="w-full focus:outline-none"
          placeholder="Question Id"
          disabled={isDeletingLesson}
          value={lessonId}
          onChange={(e) => setLessonId(e.target.valueAsNumber)}
        />
        <button
          disabled={isDeletingLesson || lessonId === 0}
          className={`submit-btn ${(isDeletingLesson || lessonId === 0) && 'disabled'}`}
        >
          Delete
        </button>
      </form>

      {deleteLessonError && (
        <>
          <hr className="w-full border"/>
          <p className="font-semibold text-lg text-red-500">{deleteLessonError}</p>
        </>
      )}

      {deleteLessonSuccess && (
        <>
          <hr className="w-full border"/>
          <p className="font-semibold text-lg text-green-600">{deleteLessonSuccess}</p>
        </>
      )}


    </div>
  );
};

export default DeleteLesson;