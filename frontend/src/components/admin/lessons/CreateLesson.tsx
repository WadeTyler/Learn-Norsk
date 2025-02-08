'use client';
import React, {useState} from 'react';
import {useLessonStore} from "@/stores/lessonStore";
import {LoadingSM} from "@/components/util/Loading";
import {Section} from "@/types/Types";
import { motion } from 'framer-motion';

const CreateLesson = ({section, cancel, reloadSection}: {
  section: Section;
  cancel: () => void;
  reloadSection: () => void;
}) => {

  // States
  const [sectionId, setSectionId] = useState<number>(section.id);
  const [lessonNumber, setLessonNumber] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [experienceReward, setExperienceReward] = useState<number>(0);

  const {createLesson, createLessonError, isCreatingLesson} = useLessonStore();

  // Functions
  async function handleSubmit() {
    if (isCreatingLesson) return;

    const newLesson = await createLesson(sectionId, lessonNumber, title, description, experienceReward);

    if (newLesson) {
      reloadSection();
      cancel();
    }
  }

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ duration: .2 }}
      className={"fixed top-0 left-0 w-[25rem] h-screen p-8 pt-24 flex flex-col items-center justify-center z-40 overflow-y-scroll bg-white shadow-xl"}
    >
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h5 className="text-2xl font-semibold text-primary">Create a new Lesson</h5>
        <hr className="border w-full"/>
        <div className="flex flex-col">
          <p className="input-label">SECTION ID</p>
          <input type="number" className="input-bar" value={sectionId}
                 onChange={(e) => setSectionId(e.target.valueAsNumber)}/>
        </div>
        <div className="flex flex-col">
          <p className="input-label">LESSON NUMBER</p>
          <input type="number" className="input-bar" value={lessonNumber}
                 onChange={(e) => setLessonNumber(e.target.valueAsNumber)}/>
        </div>
        <div className="flex flex-col">
          <p className="input-label">TITLE</p>
          <input type="text" className="input-bar" value={title} onChange={(e) => setTitle(e.target.value)}/>
        </div>

        <div className="flex flex-col">
          <p className="input-label">DESCRIPTION</p>
          <input type="text" className="input-bar" value={description}
                 onChange={(e) => setDescription(e.target.value)}/>
        </div>

        <div className="flex flex-col">
          <p className="input-label">EXPERIENCE REWARD</p>
          <input type="number" className="input-bar" value={experienceReward}
                 onChange={(e) => setExperienceReward(e.target.valueAsNumber)}/>
        </div>
        <div className="flex gap-4 items-center w-full">
          <button className="submit-btn" disabled={isCreatingLesson}>
            {isCreatingLesson
              ? <LoadingSM/>
              : 'Create Lesson'
            }
          </button>

          <section className="cancel-btn" onClick={cancel}>Cancel</section>
        </div>

        {createLessonError && (
          <>
            <hr className="border w-full"/>
            <p className="text-red-500 font-semibold">{createLessonError}</p>
          </>
        )}
      </form>

    </motion.div>
  );
};

export default CreateLesson;