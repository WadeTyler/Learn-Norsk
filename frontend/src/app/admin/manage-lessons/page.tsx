'use client';
import React from 'react';
import CreateLesson from "@/components/admin/lessons/CreateLesson";
import SearchQuestions from "@/components/admin/questions/SearchQuestions";
import SearchLessons from "@/components/admin/lessons/SearchLessons";
import DeleteLesson from "@/components/admin/lessons/DeleteLesson";
import {useAdminProtected} from "@/hooks/useAdminProtected";
import {LoadingLG} from "@/components/util/Loading";

const Page = () => {

  const { isCheckingAdmin } = useAdminProtected();
  if (isCheckingAdmin) return <LoadingLG />;

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-4 p-16 pt-32">
      <h1 className="font-semibold text-2xl">Manage Lessons</h1>
      <div className="w-full flex gap-8 justify-center flex-wrap">
        <SearchLessons />
        <CreateLesson />
        <div className="flex flex-col gap-8 ">
          <SearchQuestions />
          <DeleteLesson />
        </div>
      </div>
    </div>
  );
};

export default Page;