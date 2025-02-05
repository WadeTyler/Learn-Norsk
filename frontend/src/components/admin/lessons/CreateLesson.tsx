'use client';
import React, {useState} from 'react';
import toast from "react-hot-toast";
import {useLessonStore} from "@/stores/lessonStore";
import {LoadingLG, LoadingSM} from "@/components/util/Loading";
import {useAdminProtected} from "@/hooks/useAdminProtected";

const CreateLesson = () => {

  const {createLesson, newLesson, isCreatingLesson, createLessonError} = useLessonStore();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [lessonNumber, setLessonNumber] = useState<number>(0);
  const [experienceReward, setExperienceReward] = useState<number>(0);
  const [questionIdsStr, setQuestionIdsStr] = useState<string>("");

  const handleCreateLesson = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convert questionId str to questionIds array of int
    const questionIds = questionIdsStr.trim().split(",").map(id => parseInt(id));

    // Check if any field is empty
    if (!title || !description || lessonNumber === 0 || experienceReward === 0 || questionIds.length === 0) {
      return toast.error("Please fill out all fields.");
    }
    createLesson(title, description, lessonNumber, experienceReward, questionIds);
  }

  const {isCheckingAdmin} = useAdminProtected();
  if (isCheckingAdmin) return <LoadingLG/>;

  return (
    <div className="bg-white w-96 flex flex-col items-center p-4 rounded shadow-xl gap-4 overflow-scroll max-h-[60rem]">
      <h1 className="text-lg font-semibold">Create Lesson</h1>

      <form className="w-full flex flex-col gap-2" onSubmit={(e) => handleCreateLesson(e)}>


        <div>
          <label className="input-label">TITLE:</label>
          <input
            type="text"
            className="input-bar"
            value={title}
            placeholder={"Enter Lesson Title"}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>


        <div>
          <label className="input-label">DESCRIPTION:</label>
          <textarea
            className="input-bar resize-none h-32"
            value={description}
            placeholder={"Enter Lesson Description"}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="w-full flex gap-2">
          <div>
            <label className="input-label">LESSON NUMBER:</label>
            <input
              type="number"
              className="input-bar"
              value={lessonNumber}
              placeholder={"Enter Lesson Number"}
              onChange={(e) => setLessonNumber(e.target.valueAsNumber)}
            />
          </div>
          <div>
            <label className="input-label">EXPERIENCE REWARD:</label>
            <input
              type="number"
              className="input-bar"
              value={experienceReward}
              placeholder={"Enter Experience Reward"}
              onChange={(e) => setExperienceReward(e.target.valueAsNumber)}
            />
          </div>
        </div>

        <div>
          <label className="input-label">QUESTION IDS:</label>
          <input
            type="text"
            className="input-bar"
            value={questionIdsStr}
            placeholder={"Separate Ids with a comma."}
            onChange={(e) => setQuestionIdsStr(e.target.value)}
          />
        </div>

        <button className={`submit-btn ${isCreatingLesson && 'disabled'}`}
                disabled={isCreatingLesson}>{isCreatingLesson ? <LoadingSM/> : 'Create Lesson'}</button>
      </form>

      {createLessonError &&
          <>
              <hr className="w-full border"/>
              <p className="text-red-500 font-semibold">{createLessonError}</p>
          </>
      }

      {newLesson &&
          <div className={"overflow-scroll text-sm"}>
              <hr className="w-full border"/>
              <p className="text-green-500 font-semibold">Lesson created successfully!</p>
              <p>Lesson Id: {newLesson.id}</p>
              <p>Title: {newLesson.title}</p>
              <p>Desc: {newLesson.description}</p>
              <p>Lesson Number: {newLesson.lessonNumber}</p>
              <p>Experience Reward: {newLesson.experienceReward}</p>
            {newLesson.questions?.map((question) => (
              <div key={question.id} className="w-full border rounded flex gap-2 items-center text-sm p-2">
                <p>QID: {question.id}</p>
                <p>Title: {question.title}</p>
                <p>Type: {question.type}</p>
                <p>Options: {question.options?.map((option) => option.norsk).join(", ")}</p>
                <p>Answers: {question.answer.map((answer) => answer.norsk).join(", ")}</p>
              </div>
            ))}
          </div>
      }


    </div>
  );
};

export default CreateLesson;