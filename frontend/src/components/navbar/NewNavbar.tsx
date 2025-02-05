'use client';
import React, {useEffect, useState} from 'react';
import {User} from "@/types/Types";
import {useUserStore} from "@/stores/userStore";
import Link from "next/link";
import {usePathname} from "next/navigation";
import UserIcon from "@/components/navbar/UserIcon";
import {IconLockFilled} from "@tabler/icons-react";

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

  console.log(user)

  return (
    <div>

    </div>
  )
}