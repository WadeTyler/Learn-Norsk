'use client';
import React, { useState} from 'react';
import {useUserStore} from "@/stores/userStore";
import {LoadingLG, LoadingSM} from "@/components/util/Loading";
import {useUnprotected} from "@/hooks/useUnprotected";
import Link from 'next/link';

const Page = () => {
  const { isCheckingProtection } = useUnprotected("/learn");

  const { isLoggingIn, loginError, login } = useUserStore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password || isLoggingIn) return;
    await login(email, password);
  }

  if (isCheckingProtection) return <LoadingLG />;

  return (
    <div className="w-full h-screen bg-background flex items-center justify-center">
      <div className="w-96 bg-white p-4 shadow-xl rounded flex flex-col gap-2">
        <h1 className="text-xl text-primary font-semibold text-center">Welcome Back</h1>

        <form className={"flex flex-col gap-2"} onSubmit={handleSubmit}>
          <div>
            <label className="input-label">EMAIL:</label>
            <input
              type="text"
              className="input-bar"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="input-label">PASSWORD:</label>
            <input
              type="password"
              className="input-bar"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className={`submit-btn ${(!email || !password) && 'disabled'}`} disabled={isLoggingIn || (!email || !password)}>
            {isLoggingIn ? <LoadingSM /> : "Login"}
          </button>
        </form>
        <p>Don&#39;t have an account? <Link href={"/signup"} className="text-accent hover:underline cursor-pointer">Signup Now</Link></p>


        {loginError && <p className="text-red-500 text-center">{loginError}</p>}

      </div>
    </div>
  );
};

export default Page;