'use client';
import {useRouter} from "next/navigation";
import {useUserStore} from "@/stores/userStore";
import {useEffect, useState} from "react";

export function useAdminProtected(redirectTo = "/login") {
  const router = useRouter();
  const { user, isLoadingUser } = useUserStore();
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    setIsCheckingAdmin(true);
    if (!isLoadingUser) {
      if (!user || user.role  !== "admin") {
        router.push(redirectTo);
      } else {
        setIsCheckingAdmin(false);
      }
    }
  }, [user, isLoadingUser, router, redirectTo]);

  return { isCheckingAdmin };
}