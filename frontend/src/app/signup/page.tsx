'use client';
import React, {useState} from 'react';
import {LoadingLG, LoadingSM} from "@/components/util/Loading";
import {useUserStore} from "@/stores/userStore";
import {useUnprotected} from "@/hooks/useUnprotected";
import Link from "next/link";

const Page = () => {

  const { isCheckingProtection } = useUnprotected("/learn");

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const { signup, isSigningUp, signupError } = useUserStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSigningUp || !firstName || !lastName || !email || !password || !confirmPassword) return;
    signup(firstName, lastName, email, password, confirmPassword);
  }


  if (isCheckingProtection) return <LoadingLG/>;

  else return (
    <div className="w-full h-screen bg-background flex items-center justify-center">
      <div className="w-96 bg-white p-4 shadow-xl rounded flex flex-col gap-2">
        <h1 className="text-xl text-primary font-semibold text-center">Create an Account</h1>

        <form className={"flex flex-col gap-2"} onSubmit={handleSubmit}>
          <div>
            <label className="input-label">FIRST NAME:</label>
            <input
              type="text"
              className="input-bar"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="input-label">LAST NAME:</label>
            <input
              type="text"
              className="input-bar"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
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
          <div>
            <label className="input-label">CONFIRM PASSWORD:</label>
            <input
              type="password"
              className="input-bar"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            className={`submit-btn ${(isSigningUp || (!email || !password || !firstName || !lastName || !confirmPassword)) && 'disabled'}`}
            disabled={isSigningUp || (!email || !password || !firstName || !lastName || !confirmPassword)}>
            {isSigningUp ? <LoadingSM/> : "Sign Up"}
          </button>
        </form>
        <p>Already have an account? <Link href={"/login"} className="text-accent hover:underline cursor-pointer">Login Here</Link></p>

        {signupError && <p className="text-red-500 text-center">{signupError}</p>}

      </div>
    </div>
  );
};

export default Page;