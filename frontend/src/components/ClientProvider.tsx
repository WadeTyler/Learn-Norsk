'use client';
import {useEffect} from 'react';
import {useUserStore} from "@/stores/userStore";

const ClientProvider = () => {

  const { fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return null;
};

export default ClientProvider;