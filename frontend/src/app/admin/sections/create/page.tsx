'use client';
import React, {useState} from 'react';
import {useAdminProtected} from "@/hooks/useAdminProtected";
import {LoadingSM} from "@/components/util/Loading";
import {useSectionStore} from "@/stores/sectionStore";
import LoadingScreen from "@/components/util/LoadingScreen";
import {useRouter} from "next/navigation";

const Page = () => {
  const {isCheckingAdmin} = useAdminProtected();

  // Nav
  const router = useRouter();
  // States
  const [sectionTitle, setSectionTitle] = useState<string>("");
  const [sectionNumber, setSectionNumber] = useState<number>(0);
  const [experienceReward, setExperienceReward] = useState<number>(0);

  // Stores
  const {isCreatingSection, createSectionError, createSection} = useSectionStore();

  // Functions
  const handleSubmit = async () => {
    if (isCreatingSection) return;
    const newSection = await createSection(sectionTitle, sectionNumber, experienceReward);
    if (newSection) {
      router.push("/admin/sections");
    }
  }

  // Returns
  if (isCheckingAdmin) return <LoadingScreen />;

  return (
    <div className={"w-full min-h-screen p-16 flex flex-col items-center justify-center"}>
      <form
        className="w-[35rem] flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h5 className="text-2xl font-semibold text-primary">Create a new Section</h5>
        <hr className="border w-full"/>
        <section>
          <p className="input-label">SECTION TITLE</p>
          <input
            type="text"
            className={"input-bar"}
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
          />
        </section>
        <section>
          <p className="input-label">SECTION NUMBER</p>
          <input
            type="number"
            className={"input-bar"}
            value={sectionNumber}
            onChange={(e) => setSectionNumber(e.target.valueAsNumber)}
          />
        </section>
        <section>
          <p className="input-label">EXPERIENCE REWARD</p>
          <input
            type="number"
            className={"input-bar"}
            value={experienceReward}
            onChange={(e) => setExperienceReward(e.target.valueAsNumber)}
          />
        </section>

        <button className="submit-btn" disabled={isCreatingSection}>
          {isCreatingSection ? <LoadingSM /> : 'Create Section'}
        </button>

        {createSectionError &&
          <>
            <p className={"text-red-500"}>{createSectionError}</p>
          </>
        }

      </form>



    </div>
  );
};

export default Page;