'use client';
import {useRouter} from "next/navigation";
import {useUserStore} from "@/stores/userStore";
import {useEffect, useState} from "react";

export function useProtected(redirectTo = "/login") {
  const router = useRouter();
  const { user, isLoadingUser } = useUserStore();
  const [isCheckingProtection, setIsCheckingProtection] = useState(true);

  useEffect(() => {
    setIsCheckingProtection(true);
    if (!isLoadingUser) {
      if (!user) {
        router.push(redirectTo);
      } else {
        setIsCheckingProtection(false);
      }
    }
  }, [user, router, redirectTo, isLoadingUser]);

  return { isCheckingProtection };
}