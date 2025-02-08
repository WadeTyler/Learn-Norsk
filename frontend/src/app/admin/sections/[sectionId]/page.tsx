'use client';
import React, {useEffect, useState} from 'react';
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {useSectionStore} from "@/stores/sectionStore";
import {useAdminProtected} from "@/hooks/useAdminProtected";
import LoadingScreen from "@/components/util/LoadingScreen";
import {Lesson, Question, Section} from "@/types/Types";
import {IconArrowLeft, IconCheck, IconPencil} from "@tabler/icons-react";
import EditLesson from "@/components/admin/lessons/EditLesson";
import {AnimatePresence} from "framer-motion";
import ConfirmPanel from "@/components/util/ConfirmPanel";
import toast from "react-hot-toast";
import {LoadingSM} from "@/components/util/Loading";
import Link from "next/link";
import CreateLesson from "@/components/admin/lessons/CreateLesson";

const Page = () => {

  // Protection
  const {isCheckingAdmin} = useAdminProtected();

  // Nav
  const {sectionId} = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Stores
  const {getSectionById, fetchingSection, deleteSection, isDeletingSection} = useSectionStore();

  // States
  const [isEditingSection, setIsEditingSection] = useState<boolean>(false);
  const [isConfirmingDeleteSection, setIsConfirmingDeleteSection] = useState<boolean>(false);
  const [isCreatingLesson, setIsCreatingLesson] = useState<boolean>(false);

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

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

      if (currentLesson) {
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

  function stopEditingLesson() {
    if (!currentLesson) return;

    setCurrentLesson(null);
  }

  async function handleDeleteSection() {
    // TODO: Implement handleDeleteSection
    setIsConfirmingDeleteSection(false);

    if (!section) return;

    const isSuccess = await deleteSection(section?.id);

    if (isSuccess) {
      toast.success("Section Deleted Successfully.");
      router.push("/admin/sections");
    }
  }

  function handleEditLesson(lesson: Lesson) {
    setCurrentLesson(lesson);
    setIsCreatingLesson(false);
    setIsEditingSection(false);
  }

  function handleCreateLesson() {
    setIsCreatingLesson(true);
    setIsEditingSection(false);
    setCurrentLesson(null);
    setCurrentQuestion(null);
  }

  // useEffects
  useEffect(() => {
    loadSection();
  }, [sectionId, getSectionById]);

  useEffect(() => {
    // Check if we have a currentLesson param
    const currentLessonParam = searchParams.get("currentLesson");
    const currentQuestionParam = searchParams.get("currentQuestion");

    if (section && currentLessonParam) {
      const lesson = section.lessons.find(lesson => lesson.id === parseInt(currentLessonParam));

      if (lesson) {
        // Lesson found
        setCurrentLesson(lesson);

        if (currentQuestionParam && lesson.questions) {
          const question = lesson.questions.find(question => question.id === parseInt(currentQuestionParam));

          if (question) {
            // Question found
            setCurrentQuestion(question);
          } else {
            // Question not found, odd?
            console.log("Question not found");
            setCurrentQuestion(null); // Or some default value
          }
        } else {
          setCurrentQuestion(null); // Or some default value
        }

      } else {
        // Lesson not found, user is messing around.
        setCurrentLesson(null); // Or some default value
        setCurrentQuestion(null); // Or some default value
        console.log("Lesson not found")
      }
    } else {
      setCurrentLesson(null); // Or some default value
      setCurrentQuestion(null); // Or some default value
    }
  }, [searchParams, section]);

  // Returns
  if (fetchingSection || isCheckingAdmin) return <LoadingScreen/>

  if (!section) return (
    <div className={"w-full h-screen flex items-center justify-center"}>
      <p className="text-primary text-2xl font-semibold">404 - No Section Found</p>
    </div>
  );

  return (
    <div className={"w-full min-h-screen p-32 flex flex-col gap-8 relative"}>

      <Link href={`/admin/sections`} className="back-btn inline-flex items-center gap-2 w-fit">
        <IconArrowLeft />
        Back
      </Link>

      <div className="w-full h-full flex gap-16 justify-between">
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
            {!isDeletingSection
              ? <button
                className="delete-btn"
                onClick={() => setIsConfirmingDeleteSection(true)}
              >
                Delete Section
              </button>
              : <LoadingSM/>
            }
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
          <hr className="border w-full"/>
          <div className="w-full items-center flex justify-end">
            <button className="submit-btn" onClick={() => handleCreateLesson()}>Create Lesson</button>
          </div>
          <hr className="border w-full"/>
          <table className={"table-auto bg-white"}>
            <thead>
            <tr className={"bg-background3 text-white font-bold gap-4"}>
              <th className={"border p-2"}>Id</th>
              <th className={"border p-2"}>Number</th>
              <th className="border p-2">Title</th>
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
                onClick={() => handleEditLesson(lesson)}
              >
                <td className="border p-2">{lesson.id}</td>
                <td className="border p-2">{lesson.lessonNumber}</td>
                <td className="border p-2">{lesson.title}</td>
                <td className="border p-2">{lesson.description}</td>
                <td className="border p-2">{lesson.experienceReward}</td>
                <td className="border p-2">{lesson.questions?.length}</td>
                <td className="border p-2">{lesson.createdAt}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>

        <AnimatePresence>
          {currentLesson &&
            <EditLesson lesson={currentLesson} stopEditingLesson={stopEditingLesson} reloadSection={reloadSection}
                        currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion}/>}
        </AnimatePresence>

        <AnimatePresence>
          {isCreatingLesson &&
            <CreateLesson section={section} cancel={() => setIsCreatingLesson(false)} reloadSection={reloadSection}/>
          }
        </AnimatePresence>
      </div>

      {isConfirmingDeleteSection && <ConfirmPanel header={"You are about to delete a section!"}
                                                  body={"This action is irreversible and all lessons and questions will be lost forever. Are you sure you want to do this?"}
                                                  cancelFunc={() => setIsConfirmingDeleteSection(false)}
                                                  confirmFunc={handleDeleteSection}
                                                  confirmText={"Yes, delete the section."}/>}


    </div>
  );
};

export default Page;