'use client';
import React, {useState} from 'react';
import {useRouter, useSearchParams} from "next/navigation";
import {useAdminProtected} from "@/hooks/useAdminProtected";
import LoadingScreen from "@/components/util/LoadingScreen";
import {useLessonStore} from "@/stores/lessonStore";
import {LoadingSM} from "@/components/util/Loading";

const Page = () => {

  // Protection
  const {isCheckingAdmin} = useAdminProtected();

  // Nav
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionIdParam = searchParams.get("sectionId");

  // States
  const [sectionId, setSectionId] = useState<number>(sectionIdParam ? parseInt(sectionIdParam) : 0);
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
      router.push(`/admin/sections/${sectionId}`);
    }
  }

  // Returns
  if (isCheckingAdmin) return <LoadingScreen/>

  return (
    <div className={"w-full min-h-screen p-16 flex flex-col items-center justify-center"}>
      <form
        className="w-[35rem] flex flex-col gap-4"
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

        <button className="submit-btn" disabled={isCreatingLesson}>
          {isCreatingLesson
            ? <LoadingSM/>
            : 'Create Lesson'
          }
        </button>

        {createLessonError && (
          <>
            <hr className="border w-full"/>
            <p className="text-red-500 font-semibold">{createLessonError}</p>
          </>
        )}
      </form>

    </div>
  );
};

export default Page;