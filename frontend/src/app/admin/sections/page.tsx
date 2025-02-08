'use client';
import React, {useEffect} from 'react';
import {useAdminProtected} from "@/hooks/useAdminProtected";
import LoadingScreen from "@/components/util/LoadingScreen";
import {useSectionStore} from "@/stores/sectionStore";
import {useRouter} from "next/navigation";
import Link from "next/link";

const Page = () => {
  
  const { isCheckingAdmin } = useAdminProtected();

  // Nav
  const router = useRouter();
  // Stores
  const { sections, getAllSections, isSearchingSections } = useSectionStore();
  
  // UseEffects
  useEffect(() => {
    getAllSections();
  }, [getAllSections]);

  // Functions
  function navigateToSection(sectionId: number) {
   router.push(`/admin/sections/${sectionId}`);
  }
  
  // Returns 
  if (isCheckingAdmin || isSearchingSections) return <LoadingScreen />
  
  return (
    <div className={"w-full min-h-screen p-32 flex items-center flex-col gap-4"}>

      <h5 className={"text-primary font-semibold text-3xl"}>Sections</h5>
      <hr className="border w-full"/>

      {/* Actions */}
      <div className="w-full flex items-center justify-between">

        <div className={"flex items-center gap-4"}>
          <p><strong>Sections:</strong> {sections.length}</p>
        </div>

        <div>
          <Link href={"/admin/sections/create"} className="submit-btn">Create Section</Link>
        </div>

      </div>

      <hr className="border w-full" />
      <table className={"w-full table-auto bg-white p-4 shadow-xl"}>
        <thead>
        <tr className={"text-white font-bold bg-background3 shadow-2xl"}>
          <th className={"p-2 border"}>Id</th>
          <th className={"p-2 border"}>Title</th>
          <th className={"p-2 border"}>Number</th>
          <th className={"p-2 border"}>Exp</th>
          <th className={"p-2 border"}>Created</th>
          <th className={"p-2 border"}>Lessons</th>
        </tr>
        </thead>
        <tbody>
        {sections.map((section) => (
          <tr
            key={section.id}
            className={"hover:bg-background2 cursor-pointer hover:text-background3"}
            onClick={() => navigateToSection(section.id)}
          >
            <td className={"p-2 border"}>{section.id}</td>
            <td className={"p-2 border"}>{section.title}</td>
            <td className={"p-2 border"}>{section.sectionNumber}</td>
            <td className={"p-2 border"}>{section.experienceReward}</td>
            <td className={"p-2 border"}>{section.createdAt}</td>
            <td className={"p-2 border"}>{section.lessons.length}</td>
          </tr>
        ))}

        </tbody>
      </table>
      
    </div>
  );
};

export default Page;