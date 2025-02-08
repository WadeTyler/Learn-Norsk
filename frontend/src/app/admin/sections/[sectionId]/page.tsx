'use client';
import React, {useEffect, useState} from 'react';
import {useParams} from "next/navigation";
import {useSectionStore} from "@/stores/sectionStore";
import {useAdminProtected} from "@/hooks/useAdminProtected";
import LoadingScreen from "@/components/util/LoadingScreen";
import {Lesson, Section} from "@/types/Types";
import {IconCheck, IconPencil} from "@tabler/icons-react";
import EditLesson from "@/components/admin/lessons/EditLesson";
import {AnimatePresence} from "framer-motion";
import ConfirmPanel from "@/components/util/ConfirmPanel";

const Page = () => {

  const {isCheckingAdmin} = useAdminProtected();

  // Nav
  const {sectionId} = useParams();

  // Stores
  const {getSectionById, fetchingSection} = useSectionStore();

  // States
  const [isEditingSection, setIsEditingSection] = useState<boolean>(false);
  const [isEditingLesson, setIsEditingLesson] = useState<boolean>(false);
  const [isConfirmingDeleteSection, setIsConfirmingDeleteSection] = useState<boolean>(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [sectionTitle, setSectionTitle] = useState<string>("");
  const [sectionNumber, setSectionNumber] = useState<number>(0);
  const [sectionExperienceReward, setSectionExperienceReward] = useState<number>(0);


  // Functions
  async function loadSection() {
    if (typeof sectionId !== "string") return;
    const section = await getSectionById(parseInt(sectionId));
    setSection(section);

    if (section) {
      setSectionTitle(section.title);
      setSectionNumber(section.sectionNumber);
      setSectionExperienceReward(section.experienceReward);

      if (isEditingLesson && currentLesson) {
        const lesson = section?.lessons.filter((lesson) => lesson.id === currentLesson.id)[0];
        setCurrentLesson(lesson);
      }
    }
  }

  async function reloadSection() {
    loadSection();
  }

  async function saveChanges() {
    // TODO: Add update saveChanges functionality for sections
    setIsEditingSection(false);
  }

  async function editLesson(lesson: Lesson) {
    setCurrentLesson(lesson);
    setIsEditingLesson(true);
  }

  function stopEditingLesson() {
    if (!isEditingLesson) return;

    setCurrentLesson(null);
    setIsEditingLesson(false);
  }

  function handleDeleteSection() {
    // TODO: Implement handleDeleteSection
    setIsConfirmingDeleteSection(false);
  }

  // useEffects
  useEffect(() => {
    loadSection();

  }, [sectionId, getSectionById]);

  useEffect(() => {
    console.log(section);
  }, [section]);

  // Returns
  if (fetchingSection || isCheckingAdmin) return <LoadingScreen/>

  if (!section) return (
    <div className={"w-full h-screen flex items-center justify-center"}>
      <p className="text-primary text-2xl font-semibold">404 - No Section Found</p>
    </div>
  );

  return (
    <div className={"w-full min-h-screen p-32 flex justify-between gap-16 relative"}>
      <div className="flex flex-col gap-4 w-full">

        <h6 className="text-primary font-semibold text-2xl">Section Id: {section.id}</h6>

        <hr className="w-full border"/>
        <div className="w-full flex items-center gap-4">
          {!isEditingSection && (
            <button
              className="submit-btn inline-flex"
              onClick={() => {
                setIsEditingSection(true)
              }}
            >
              <IconPencil/> Edit
            </button>
          )}
          {isEditingSection && (
            <button
              className="submit-btn inline-flex"
              onClick={saveChanges}
            >
              <IconCheck/> Save
            </button>
          )}
          <button
            className="delete-btn"
            onClick={() => setIsConfirmingDeleteSection(true)}
          >
            Delete Section
          </button>
        </div>

        <hr className="w-full border"/>

        <div className={"flex flex-col"}>
          <p className="input-label">SECTION ID</p>
          <p>{section.id}</p>
        </div>
        <div className="flex flex-col">
          <p className="input-label">SECTION TITLE</p>
          <input type="text" className={`${isEditingSection ? 'input-bar' : 'duration-300'}`}
                 disabled={!isEditingSection} value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)}/>
        </div>
        <div className="flex flex-col">
          <p className="input-label">SECTION NUMBER</p>
          <input type="number" className={`${isEditingSection ? 'input-bar' : 'duration-300'}`}
                 disabled={!isEditingSection} value={sectionNumber}
                 onChange={(e) => setSectionNumber(e.target.valueAsNumber)}/>
        </div>
        <div className="flex flex-col">
          <p className="input-label">SECTION EXPERIENCE REWARD</p>
          <input type="number" className={`${isEditingSection ? 'input-bar' : 'duration-300'}`}
                 disabled={!isEditingSection} value={sectionExperienceReward}
                 onChange={(e) => setSectionExperienceReward(e.target.valueAsNumber)}/>
        </div>
        <div className={"flex flex-col"}>
          <p className="input-label">CREATED AT</p>
          <p>{section.createdAt}</p>
        </div>
        <div className={"flex flex-col"}>
          <p className="input-label">LESSONS</p>
          <p>{section.lessons.length}</p>
        </div>

      </div>

      <div className="flex flex-col gap-4 w-full">
        <p className="text-primary text-xl font-semibold">Lessons ({section.lessons.length})</p>
        <table className={"table-auto bg-white"}>
          <thead>
          <tr className={"bg-background3 text-white font-bold gap-4"}>
            <th className={"border p-2"}>Id</th>
            <th className={"border p-2"}>Number</th>
            <th className={"border p-2"}>Description</th>
            <th className={"border p-2"}>Exp</th>
            <th className={"border p-2"}>Questions</th>
            <th className={"border p-2"}>Created At</th>
          </tr>
          </thead>
          <tbody>
          {section.lessons.map((lesson) => (
            <tr
              key={lesson.id}
              className={"bg-white hover:bg-background2 hover:text-background3 cursor-pointer"}
              onClick={() => editLesson(lesson)}
            >
              <td className="border p-2">{lesson.id}</td>
              <td className="border p-2">{lesson.lessonNumber}</td>
              <td className="border p-2">{lesson.description}</td>
              <td className="border p-2">{lesson.experienceReward}</td>
              <td className="border p-2">{lesson.questions?.length}</td>
              <td className="border p-2">{lesson.createdAt}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {isConfirmingDeleteSection && <ConfirmPanel header={"You are about to delete a section!"}
                                                  body={"This action is irreversible and all lessons and questions will be lost forever. Are you sure you want to do this?"}
                                                  cancelFunc={() => setIsConfirmingDeleteSection(false)}
                                                  confirmFunc={handleDeleteSection}
                                                  confirmText={"Yes, delete the section."}/>}

      <AnimatePresence>
        {isEditingLesson && currentLesson &&
          <EditLesson lesson={currentLesson} stopEditingLesson={stopEditingLesson} reloadSection={reloadSection}/>}
      </AnimatePresence>
    </div>
  );
};

export default Page;