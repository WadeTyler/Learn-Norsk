'use client';
import React from 'react';
import SearchSections from "@/components/admin/sections/SearchSections";
import CreateSection from "@/components/admin/sections/CreateSection";
import DeleteSection from "@/components/admin/sections/DeleteSection";
import SearchLessons from "@/components/admin/lessons/SearchLessons";
import SearchQuestions from "@/components/admin/questions/SearchQuestions";
import SearchWords from "@/components/admin/words/SearchWords";
import CreateLesson from "@/components/admin/lessons/CreateLesson";
import CreateQuestion from "@/components/admin/questions/CreateQuestion";
import CreateWords from "@/components/admin/words/CreateWords";
import DeleteWord from "@/components/admin/words/DeleteWord";
import DeleteQuestion from "@/components/admin/questions/DeleteQuestion";
import DeleteLesson from "@/components/admin/lessons/DeleteLesson";
import {useAdminProtected} from "@/hooks/useAdminProtected";
import {LoadingLG} from "@/components/util/Loading";
import UpdateWord from "@/components/admin/words/UpdateWord";


const Page = () => {

    const {isCheckingAdmin} = useAdminProtected();
    if (isCheckingAdmin) return <LoadingLG/>;

    return (
        <div className="w-full min-h-screen flex flex-col items-center gap-16 p-4 sm:p-8 md:p-16 md:pt-32">
            <h1 className="font-semibold text-2xl">Manage Sections</h1>
            <div className="w-full flex gap-8 justify-center flex-wrap">
                <SearchSections/>
                <CreateSection/>
                <DeleteSection/>
            </div>
            <h1 className="font-semibold text-2xl">Manage Lessons</h1>
            <div className="w-full flex gap-8 justify-center flex-wrap">
                <SearchLessons/>
                <CreateLesson/>
                <DeleteLesson/>
            </div>
            <h1 className="font-semibold text-2xl">Manage Questions</h1>
            <div className="w-full flex gap-8 justify-center flex-wrap">
                <SearchQuestions/>
                <CreateQuestion/>
                <DeleteQuestion/>
            </div>
            <h1 className="font-semibold text-2xl">Manage Words</h1>
            <div className="w-full flex gap-8 justify-center flex-wrap">
                <SearchWords/>
                <CreateWords/>
                <DeleteWord/>
                <UpdateWord/>
            </div>
        </div>
    );
};

export default Page;