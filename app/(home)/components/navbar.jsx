"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function Navbar() {
  const [navToggle, setNavToggle] = useState(false);

  const toggleNav = () => {
    setNavToggle(!navToggle);
  };
  return (
    <nav
      className="flex justify-between px-10 py-2 absolute top-0 z-20 w-full bg-black bg-opacity-40 xl:bg-opacity-0"
      data-aos="fade-down"
      data-aos-duration="1000"
    >
      <Link href="/">
        <p className="font-semibold text-white bg-black bg-opacity-30 px-2 py-1 rounded-md">
          VAVAPOPO
        </p>
      </Link>

      <ul className="hidden md:flex gap-10 text-sm font-medium">
        <Link
          href="/"
          className="cursor-pointer hover:underline hover:font-bold"
        >
          Home
        </Link>
        <Link
          href="/#about"
          className="cursor-pointer hover:underline hover:font-bold"
        >
          About
        </Link>
        <Link
          href="/packs"
          className="cursor-pointer hover:underline hover:font-bold"
        >
          Packages
        </Link>
        <Link
          href="/#review"
          className="cursor-pointer hover:underline hover:font-bold"
        >
          Review
        </Link>
      </ul>
      <Link href="/packs">
        <button className="hidden md:block py-2 px-6 rounded-md bg-foreground text-sm font-medium text-white hover:scale-105 hover:shadow-lg">
          Explore
        </button>
      </Link>
      <div
        className="block md:hidden text-white cursor-pointer"
        onClick={toggleNav}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          color="white"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="size-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </div>
      <div
        className={`${
          navToggle ? "active" : "inactive"
        } absolute top-0 right-0 w-full bg-green-500 py-10 nav`}
      >
        <ul className="flex flex-col justify-center gap-5 items-center text-sm text-white font-medium">
          <Link href="/" className="cursor-pointer hover:underline">
            Home
          </Link>
          <Link href="/#about" className="cursor-pointer hover:underline">
            About
          </Link>
          <Link href="/packs" className="cursor-pointer hover:underline">
            Packages
          </Link>
          <Link href="/#review" className="cursor-pointer hover:underline">
            Review
          </Link>
        </ul>
        <div
          className="text-white font-bold absolute top-4 right-4 cursor-pointer"
          onClick={toggleNav}
        >
          <Image src="/navbar/close.svg" width={40} height={40} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
