'use client';
import React, {useEffect, useState} from 'react';
import Link from "next/link";
import {useUserStore} from "@/stores/userStore";
import {User} from "@/types/Types";
import { IconLockFilled, IconMenu2, IconX} from "@tabler/icons-react";
import UserIcon from "@/components/navbar/UserIcon";
import {AnimatePresence, motion} from 'framer-motion';

const Navbar = () => {

  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Determine screen size on load
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    }
  }, []);

  // Listen for screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, []);

  const {user} = useUserStore();

  if (isMobile) {
    return <MobileNavbar user={user}/>
  }

  return <DesktopNavbar user={user}/>

};

export default Navbar;

const DesktopNavbar = ({user}: {
  user: User | null;
}) => {
  return (
    <div
      className="w-full h-16 p-4 px-16 flex gap-4 items-center justify-between bg-primary shadow-xl z-50 fixed top-0">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <Link href={"/"} className="flex gap-2 items-center border-r border-r-background pr-4">

          <div className="bg-background rounded-full hover:shadow-xl hover:scale-95 duration-500 cursor-pointer">
            <img src="/flag.png" alt="Norway Flag" className="w-12 p-2"/>
          </div>

          <p className="text-background text-xl font-semibold hover:scale-95 duration-500">Learn Norsk</p>
        </Link>

        <Link href={"/learn"} className={"text-background nav-link"}>Learn</Link>
      </div>
      {/* Right Side */}
      <div className="flex items-center gap-4">
        {!user && (
          <>
            <Link href={"/login"} className={"text-background nav-link"}>Login</Link>
            <Link href={"/signup"}
                  className={"nav-link bg-background hover:bg-accent text-primary hover:text-background"}>Sign Up</Link>
          </>
        )}
        {user && (
          <>
            {user.role === "admin" && <Link href={"/admin/manage-content"}
                                            className={"nav-link bg-background hover:bg-accent text-primary hover:text-background inline-flex"}><IconLockFilled/> Dashboard</Link>}
            <UserIcon/>
          </>
        )}
      </div>

    </div>
  )
}

const MobileNavbar = ({user}: {
  user: User | null;
}) => {

  const [menuClicked, setMenuClicked] = useState<boolean>(false);

  return (
    <div className="fixed z-50">

      {/* Hamburger Button */}
      <div
        onClick={() => setMenuClicked(prev => !prev)}
        className="fixed top-2 right-2 w-10 h-10 bg-primary p-1 rounded-full flex items-center justify-center text-background hover:bg-accent duration-300 cursor-pointer z-50"
      >
        {!menuClicked ? <IconMenu2/> : <IconX/>}
      </div>

      {/* Menu */}
      <AnimatePresence initial={false}>
        {menuClicked && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .3 }}
            onClick={() => setMenuClicked(false)}
            className="w-full h-screen fixed bg-[rgba(0,0,0,.8)] duration-300"
          >
            {/* Nav */}
            <motion.div
              initial={{x: '-100%'}}
              animate={{x: 0}}
              exit={{ x: '-100%' }}
              transition={{duration: .3}}
              className="w-64 h-screen fixed top-0 left-0 z-50 bg-primary flex flex-col gap-4 items-center p-4 text-background"
            >
              <Link href={"/"} className="flex gap-2 items-center">
                <div className="bg-background rounded-full hover:shadow-xl hover:scale-95 duration-500 cursor-pointer">
                  <img src="/flag.png" alt="Norway Flag" className="w-12 p-2"/>
                </div>
                <p className="text-background text-xl font-semibold hover:scale-95 duration-500">Learn Norsk</p>
              </Link>
              <hr className="border w-full"/>

              <Link href={"/learn"} className={"text-background nav-link text-2xl"}>Learn</Link>
              <hr className="border w-full"/>
              {!user && (
                <div className="flex gap-2 items-center">
                  <Link href={"/login"} className={"text-background nav-link"}>Login</Link>
                  <Link href={"/signup"}
                        className={"nav-link bg-background hover:bg-accent text-primary hover:text-background"}>Sign
                    Up</Link>
                </div>
              )}
              {user && (
                <>
                  {user.role === "admin" && (
                    <Link
                      href={"/admin/manage-content"}
                      className={"nav-link bg-background hover:bg-accent text-primary hover:text-background inline-flex"}
                    >
                      <IconLockFilled/> Dashboard
                    </Link>
                  )}
                  <UserIcon isMobile={true}/>
                </>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}