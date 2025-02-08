'use client';
import React, {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from "next/navigation";
import {useAdminProtected} from "@/hooks/useAdminProtected";
import LoadingScreen from "@/components/util/LoadingScreen";
import {useQuestionStore} from "@/stores/questionStore";
import toast from "react-hot-toast";
import WordsNotFound from "@/components/admin/words/WordsNotFound";

const Page = () => {

  // Route Protection
  const {isCheckingAdmin} = useAdminProtected();

  // Nav - ?lessonId=x&sectionId=x
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonIdParam = searchParams.get("lessonId");
  const sectionIdParam = searchParams.get("sectionId");

  // States
  const [lessonId, setLessonId] = useState<number | undefined>(typeof lessonIdParam === "string" ? parseInt(lessonIdParam) : undefined);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [type, setType] = useState<string>("sentence-forming");
  const [options, setOptions] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  // Stores
  const { createQuestion, isCreatingQuestion, createQuestionError, notFoundWords } = useQuestionStore();

  // Functions
  async function handleSubmit() {
    if (isCreatingQuestion) return;

    if (!lessonId || !questionNumber || !title || !type || !answer) {
      return toast.error("All fields required.");
    }

    const newQuestion = await createQuestion(lessonId, questionNumber, title, type, options, answer);
    if (newQuestion) {
      // Redirect to section
      if (sectionIdParam) {
        router.push(`/admin/sections/${sectionIdParam}?currentLesson=${lessonId}&currentQuestion=${newQuestion.id}`);
      }
      else {
        router.push(`/admin/sections`);
      }
    }
  }

  useEffect(() => {
    console.log(notFoundWords)
  }, [notFoundWords]);

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
        <h5 className="text-2xl font-semibold text-primary">Create a new Question</h5>
        <hr className="border w-full"/>

        <div className="flex flex-col">
          <p className="input-label">LESSON ID</p>
          <input
            type={"number"}
            className={"input-bar"}
            value={lessonId}
            onChange={(e) => setLessonId(e.target.valueAsNumber)}
          />
        </div>
        <div className="flex flex-col">
          <p className="input-label">QUESTION NUMBER</p>
          <input
            type={"number"}
            className={"input-bar"}
            value={questionNumber}
            onChange={(e) => setQuestionNumber(e.target.valueAsNumber)}
          />
        </div>
        <div className="flex flex-col">
          <p className="input-label">TITLE</p>
          <input
            type={"string"}
            className={"input-bar"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Type the word or sentence the user should type."
          />
        </div>
        <div className="flex flex-col">
          <p className="input-label">TYPE</p>
          <select className={"input-bar"} value={type} onChange={(e) => setType(e.target.value)}>
            <option value={"sentence-forming"}>sentence-forming</option>
            <option value="sentence-typing">sentence-typing</option>
            <option value="image-choice">image-choice</option>
          </select>
        </div>
        {type !== "sentence-typing" &&
          <div className="flex flex-col">
            <p className="input-label">OPTIONS</p>
            <input
              type={"text"}
              className={"input-bar"}
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              placeholder="Type options separated by spaces. Ex: elsker jeg deg"
            />
          </div>
        }
        <div className="flex flex-col">
          <p className="input-label">ANSWER</p>
          <input
            type={"text"}
            className={"input-bar"}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type answer separated by spaces. Ex: jeg elsker deg"
          />
        </div>

        <button className="submit-btn">Create Question</button>

        {createQuestionError && (
          <>
            <hr className="border w-full"/>
            <p className="font-semibold text-red-500">{createQuestionError}</p>
          </>
        )}

      </form>

      {notFoundWords.length > 0 && <WordsNotFound />}

    </div>
  );
};

export default Page;