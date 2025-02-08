'use client';
import React, {useEffect, useState} from 'react';
import Link from "next/link";
import {useAdminProtected} from "@/hooks/useAdminProtected";
import {useAdminStore} from "@/stores/adminStore";
import {AdminDashboardData} from "@/types/Types";
import LoadingScreen from "@/components/util/LoadingScreen";

const Page = () => {

  const { isCheckingAdmin } = useAdminProtected();

  // States
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);

  // Stores
  const { getAdminDashboardData, isLoadingAdminDashboardData } = useAdminStore();

  // Functions
  async function loadDashboardData() {
    const data = await getAdminDashboardData();
    setDashboardData(data);
  }

  // useEffect
  useEffect(() => {
    loadDashboardData();

    return () => {
      setDashboardData(null);
    }
  }, [getAdminDashboardData]);

  useEffect(() => {
    console.log("Dashboard Data: ", dashboardData);
  }, [dashboardData]);

  // Returns

  if (isCheckingAdmin || isLoadingAdminDashboardData) return <LoadingScreen />;

  return (
    <div className="flex flex-col pt-16 h-screen">
      <h1>Admin Page</h1>
      <Link href={"/admin/sections"}>Sections</Link>
    </div>
  );
};

export default Page;