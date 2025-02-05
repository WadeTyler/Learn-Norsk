'use client';
import React, {useState} from 'react';
import {useSectionStore} from "@/stores/sectionStore";
import {LoadingSM} from "@/components/util/Loading";

const CreateSection = () => {

  const { createSection, isCreatingSection, createSectionError, newSection } = useSectionStore();

  const [title, setTitle] = useState<string>("");
  const [sectionNumber, setSectionNumber] = useState<number>(0);
  const [experienceReward, setExperienceReward] = useState<number>(0);
  const [lessonIdsStr, setLessonIdsStr] = useState<string>("");


  const handleCreateSection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isCreatingSection || !title || sectionNumber === 0 || experienceReward === 0 || !lessonIdsStr) return;

    const lessonIds = lessonIdsStr.trim().split(",").map((id) => parseInt(id));
    createSection(title, sectionNumber, experienceReward, lessonIds);
  }

  return (
    <div className="bg-white w-96 flex flex-col items-center p-4 rounded shadow-xl gap-4 overflow-scroll max-h-[60rem]">
      <h1 className="text-lg font-semibold">Create Section</h1>

      <form className="w-full flex flex-col gap-2" onSubmit={(e) => handleCreateSection(e)}>
        <div>
          <label className="input-label">TITLE:</label>
          <input
            type="text"
            className="input-bar"
            value={title}
            placeholder="Enter Title Here"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={"flex gap-2 items-center"}>
          <div>
            <label className="input-label">SECTION NUMBER:</label>
            <input
              type="number"
              className="input-bar"
              value={sectionNumber}
              placeholder="Enter Section Number Here"
              onChange={(e) => setSectionNumber(e.target.valueAsNumber)}
            />
          </div>
          <div>
            <label className="input-label">EXPERIENCE REWARD:</label>
            <input
              type="number"
              className="input-bar"
              value={experienceReward}
              placeholder="Enter Experience Reward Here"
              onChange={(e) => setExperienceReward(e.target.valueAsNumber)}
            />
          </div>
        </div>
        <div>
          <label className="input-label">LESSON IDS:</label>
          <input
            type="text"
            className="input-bar"
            value={lessonIdsStr}
            placeholder="Separate Ids by a comma."
            onChange={(e) => setLessonIdsStr(e.target.value)}
          />
        </div>

        <button className={`submit-btn ${isCreatingSection && 'disabled'}`} disabled={isCreatingSection}>{isCreatingSection ? <LoadingSM /> : "Create Section"}</button>
      </form>

      {createSectionError &&
        <>
          <hr className={"border w-full"}/>
          <p className={"text-red-500 font-semibold text-lg"}>{createSectionError}</p>
        </>
      }

      {newSection &&
          <div className={"w-full border rounded text-sm"}>
              <p>SID: {newSection.id}</p>
              <p>Title: {newSection.title}</p>
              <p>#: {newSection.sectionNumber}</p>
              <p>Exp: {newSection.experienceReward}</p>
              <p>Lessons: {newSection.lessons.length}</p>
          </div>
      }


    </div>
  );
};

export default CreateSection;