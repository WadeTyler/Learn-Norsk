'use client';
import React, {useEffect, useState} from 'react';
import {User} from "@/types/Types";
import {useUserStore} from "@/stores/userStore";
import Link from "next/link";
import {usePathname} from "next/navigation";
import UserIcon from "@/components/navbar/UserIcon";
import {IconLockFilled, IconMenu2, IconX} from "@tabler/icons-react";

const NewNavbar = () => {
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


export default NewNavbar;

const DesktopNavbar = ({user}: {
  user: User | null;
}) => {

  // Determine currentPage
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState("");
  useEffect(() => {
    if (pathname) {
      setCurrentPage(pathname.split("/")[1]);
    }

  }, [pathname]);

  const [isAtTop, setIsAtTop] = useState(true);
  useEffect(() => {

    const handleScroll = () => {
      setIsAtTop(window.scrollY < 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div
      className={`fixed w-full h-16 text-white flex items-center justify-center z-50 duration-300 ${
        (currentPage === "" || currentPage === "about") && isAtTop ? 'bg-transparent shadow-none ' : 'bg-[rgba(0,20,30,.7)] shadow-lg backdrop-blur'}
      `}>

      <div className="w-full lg:w-[45rem] xl:w-[75rem] px-4 lg:p-0 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">Learn Norsk</Link>

        <nav className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-between gap-8">
          <Link href="/" className={`nav-bar-link ${currentPage === '' && 'text-accentLight'}`}>Home</Link>
          <Link href="/about" className={`nav-bar-link ${currentPage === 'about' && 'text-accentLight'}`}>About</Link>
          <Link href="/learn" className={`nav-bar-link ${currentPage === 'learn' && 'text-accentLight'}`}>Learn</Link>
          <Link href="/contact"
                className={`nav-bar-link ${currentPage === 'contact' && 'text-accentLight'}`}>Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          {!user && <Link href={"/login"}
                          className={`nav-bar-link xl:visible invisible ${currentPage === 'login' && 'text-accentLight'}`}>Login</Link>}
          {!user && <Link href={"/signup"} className="submit-btn3">Start Learning Now</Link>}
          {user?.role === "admin" &&
            <Link
              href={"/admin/manage-content"}
              className={`nav-link bg-background hover:bg-accent text-primary hover:text-background inline-flex ${currentPage === "admin" && '!bg-accent !text-white'}`}
            >
              <IconLockFilled/> Admin
            </Link>}
          {user && <UserIcon/>}
        </div>

      </div>
    </div>
  )

}

const MobileNavbar = ({user}: {
  user: User | null;
}) => {

  // States
  const [isAtTop, setIsAtTop] = useState(true);
  const [currentPage, setCurrentPage] = useState("");
  const [isShowingMenu, setIsShowingMenu] = useState(false);

  // Determine currentPage
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) {

      if (pathname.split("/")[1] !== currentPage) {
        setIsShowingMenu(false);
      }

      setCurrentPage(pathname.split("/")[1]);
    }

  }, [pathname]);

  useEffect(() => {

    const handleScroll = () => {
      setIsAtTop(window.scrollY < 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className={"fixed w-full flex items-center justify-end top-0 left-0 z-50 "}>

      <div
        className={`flex items-center justify-center w-12 h-12 mr-4 mt-4 rounded-full duration-300 cursor-pointer text-white  hover:text-primary z-50 group ${
          (currentPage === "" || currentPage === "about") && isAtTop || isShowingMenu ? 'bg-transparent shadow-none ' : 'bg-primary shadow-lg backdrop-blur hover:bg-background3'}`}
        onClick={() => setIsShowingMenu(prev => !prev)}
      >
        {isShowingMenu
          ? <IconX className={"group-hover:rotate-90 transition-transform duration-300"}/>
          : <IconMenu2 className={"group-hover:rotate-180 transition-transform duration-300"}/>
        }
      </div>

      {isShowingMenu && (
        <div
          className={`w-full h-screen fixed top-0 left-0 bg-[rgba(0,20,30,.7)] backdrop-blur text-white flex flex-col items-center gap-4 p-8 text-2xl`}
        >
          <Link href={"/"} className={"text-2xl font-semibold"}>Learn Norsk</Link>
          <hr className="border w-full"/>

          <Link href={"/"} className={`mobile-nav-link ${currentPage === '' && 'text-accentLight'}`}>Home</Link>
          <Link href="/about"
                className={`mobile-nav-link ${currentPage === 'about' && 'text-accentLight'}`}>About</Link>
          <Link href="/learn"
                className={`mobile-nav-link ${currentPage === 'learn' && 'text-accentLight'}`}>Learn</Link>
          <Link href="/contact"
                className={`mobile-nav-link ${currentPage === 'contact' && 'text-accentLight'}`}>Contact</Link>

          <hr className="border w-full"/>

          {!user && (
            <div
              className={"w-full flex flex-col items-center gap-4 text-2xl absolute bottom-0 p-8"}
            >
              <Link href={"/login"}
                    className={`mobile-nav-link ${currentPage === 'login' && 'text-accentLight'}`}>
                Login
              </Link>
              <Link href={"/signup"}
                    className={`${currentPage === "signup" ? 'submit-btn2' : 'submit-btn3'}`}>Start Learning Now</Link>
            </div>
          )}

          {user && (
            <div
              className={`w-full flex flex-col items-center gap-4 text-2xl absolute bottom-0 p-8`}
            >
             <UserIcon isMobile={true} />
            </div>
          )}

        </div>
      )}


    </div>
  )
}