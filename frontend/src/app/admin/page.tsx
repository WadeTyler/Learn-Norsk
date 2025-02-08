
'use client';
import React from 'react';
import Link from "next/link";
import {useAdminProtected} from "@/hooks/useAdminProtected";
import {LoadingLG} from "@/components/util/Loading";

const Page = () => {

  const { isCheckingAdmin } = useAdminProtected();
  if (isCheckingAdmin) return <LoadingLG />;

  return (
    <div className="flex flex-col pt-16 h-screen">
      <h1>Admin Page</h1>
      <Link href={"/admin/sections"}>Sections</Link>
    </div>
  );
};

export default Page;