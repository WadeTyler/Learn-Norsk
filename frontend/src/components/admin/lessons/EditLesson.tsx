'use client';
import React, {useState} from 'react';
import {Lesson, Question} from "@/types/Types";
import EditQuestion from "@/components/admin/questions/EditQuestion";
import {AnimatePresence, motion} from 'framer-motion';
import ConfirmPanel from "@/components/util/ConfirmPanel";
import {useLessonStore} from "@/stores/lessonStore";

const EditLesson = ({lesson, stopEditingLesson, reloadSection}: {
  lesson: Lesson;
  stopEditingLesson: () => void;
  reloadSection: () => void;
}) => {

  // States
  const [isEditingQuestion, setIsEditingQuestion] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isConfirmingDeleteLesson, setIsConfirmingDeleteLesson] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(lesson.title);
  const [description, setDescription] = useState<string>(lesson.description);
  const [number, setNumber] = useState<number>(lesson.lessonNumber);
  const [experienceReward, setExperienceReward] = useState<number>(lesson.experienceReward);

  // Stores
  const {deleteLesson, isDeletingLesson, deleteLessonError} = useLessonStore();

  // Functions
  function editQuestion(question: Question) {
    setCurrentQuestion(question);
    setIsEditingQuestion(true);
  }

  function stopEditingQuestion() {
    setCurrentQuestion(null);
    setIsEditingQuestion(false);
  }

  async function handleDeleteLesson() {
    if (isDeletingLesson) return;
    const isSuccess = await deleteLesson(lesson.id);

    if (isSuccess) reloadSection();
    stopEditingLesson();
  }

  async function handleSaveChanges() {
    // TODO: Implement handleSaveChanges for editing lesson
  }

  return (
    <motion.div
      initial={{x: '-100%'}}
      animate={{x: 0}}
      exit={{x: '-100%'}}
      transition={{duration: .2}}
      className={"fixed w-[35rem] h-full top-0 left-0 flex flex-col gap-4 p-4 pt-32 overflow-y-scroll shadow-2xl z-40 bg-white"}
    >
      <p className="text-primary text-2xl font-semibold">Editing Lesson: {lesson.id}</p>

      <hr className="border w-full"/>

      <div className="flex flex-col">
        <p className="input-label">ID</p>
        <p>{lesson.id}</p>
      </div>
      <div className="flex flex-col">
        <p className="input-label">SECTION ID</p>
        <p>{lesson.sectionId}</p>
      </div>
      <div className="flex flex-col">
        <p className="input-label">TITLE</p>
        <input type="text" className={"input-bar"} value={title} onChange={(e) => setTitle(e.target.value)}/>
      </div>
      <div className="flex flex-col">
        <p className="input-label">DESCRIPTION</p>
        <input type="text" className={"input-bar"} value={description}
               onChange={(e) => setDescription(e.target.value)}/>
      </div>
      <div className="flex flex-col">
        <p className="input-label">LESSON NUMBER</p>
        <input type="number" className="input-bar" value={number}
               onChange={(e) => setNumber(e.target.valueAsNumber)}/>
      </div>
      <div className="flex flex-col">
        <p className="input-label">EXPERIENCE REWARD</p>
        <input type="number" className={"input-bar"} value={experienceReward}
               onChange={(e) => setExperienceReward(e.target.valueAsNumber)}/>
      </div>
      <div className="flex flex-col">
        <p className="input-label">CREATED AT</p>
        <p>{lesson.createdAt}</p>
      </div>
      <div className="flex flex-col">
        <p className="input-label">QUESTIONS</p>
        <p>{lesson.questions?.length}</p>
      </div>

      <hr className="w-full border"/>

      <p className="text-primary font-semibold text-xl">Questions ({lesson.questions?.length})</p>
      <table className={"bg-white table-auto"}>
        <thead>
        <tr className={"bg-background3 text-white font-bold gap-4"}>
          <th className={"border p-2"}>Id</th>
          <th className={"border p-2"}>Number</th>
          <th className={"border p-2"}>Type</th>
          <th className={"border p-2"}>Title</th>
          <th className={"border p-2"}>Options</th>
          <th className={"border p-2"}>Answer</th>
        </tr>
        </thead>
        <tbody>
        {lesson.questions?.map((question) => (
          <tr
            key={question.id}
            className={"cursor-pointer hover:bg-background2 hover:text-background3"}
            onClick={() => editQuestion(question)}
          >
            <td className={"border p-2"}>{question.id}</td>
            <td className="border p-2">{question.questionNumber}</td>
            <td className="border p-2">{question.type}</td>
            <td className="border p-2">{question.title}</td>
            <td className="border p-2">{question.options?.map((option) => option.norsk).join(" ")}</td>
            <td className="border p-2">{question.answer.map((answer) => answer.norsk).join(" ")}</td>
          </tr>
        ))}
        </tbody>
      </table>

      <hr className="border w-full"/>

      <div className="flex items-center justify-center gap-4 w-full">
        {/* TODO: Add func */}
        <button className="submit-btn" onClick={() => handleSaveChanges()}>Save Changes</button>
        <button className="delete-btn" onClick={() => setIsConfirmingDeleteLesson(true)}>Delete Lesson</button>
        <button className="cancel-btn" onClick={() => stopEditingLesson()}>Cancel</button>
      </div>

      <AnimatePresence>
        {isEditingQuestion && currentQuestion &&
          <EditQuestion question={currentQuestion} stopEditingQuestion={stopEditingQuestion}
                        reloadSection={reloadSection}/>}
      </AnimatePresence>


      {isConfirmingDeleteLesson && (
        <ConfirmPanel header={"You are about to delete a lesson!"}
                      body={"Once you delete this lesson, you will not be able to recover it. All questions inside will be lost. Are you sure you want to delete the lesson?"}
                      cancelFunc={() => setIsConfirmingDeleteLesson(false)} confirmFunc={handleDeleteLesson}
                      confirmText={"Yes, Delete this Lesson"}/>
      )}
      {deleteLessonError && (
        <>
          <hr className="w-full border"/>
          <hr className="w-full border"/>
          <p className={"font-semibold text-red-500"}>{deleteLessonError}</p>
        </>
      )}

    </motion.div>

  );
};

export default EditLesson;