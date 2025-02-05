'use client';
import React, {useEffect} from 'react';
import {useRouter} from "next/navigation";
import {LoadingLG} from "@/components/util/Loading";

const NotFound = () => {
  const router = useRouter();

  // Auto Redirect back to home page
  useEffect(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="w-full h-screen bg-white flex flex-col items-center justify-center">
      <p>Page not found.</p>
      <LoadingLG />
      <p>Redirecting...</p>
    </div>
  );
};

export default NotFound;