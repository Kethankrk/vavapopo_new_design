"use client";
import { db } from "@/app/firebase/firebaseinit";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const Footersection = () => {
  const [email, setEmail] = useState("");

  const subscribeEmail = async (e) => {
    e.preventDefault();
    toast.info("Subscribing...", {
      toastId: "email-toast",
      autoClose: false,
      theme: "colored",
      position: "bottom-right",
      closeOnClick: false,
    });
    try {
      if (!email.includes("@")) return;
      const q = query(
        collection(db, "newsletter"),
        where("email", "==", email)
      );
      const checkExist = await getDocs(q);
      if (!checkExist.empty) {
        toast.update("email-toast", {
          render: "Email already exist",
          type: "error",
          autoClose: 1500,
          closeOnClick: true,
        });
        return;
      }
      const res = await addDoc(collection(db, "newsletter"), { email });
      setEmail("");
      toast.update("email-toast", {
        render: "Successfully subscribed",
        type: "success",
        autoClose: 1500,
        closeOnClick: true,
      });
    } catch (error) {
      console.log(error);
      toast.update("email-toast", {
        render: "Unknown error",
        type: "error",
        autoClose: 1500,
        closeOnClick: true,
      });
    }
  };

  return (
    <div className="w-full bg-[#003329] flex justify-center text-white">
      <div className="max-w-5xl mx-2 md:mx-8 py-12 px-5 md:px-0 sm:py-24 grid grid-cols-1 gap-5 sm:grid-cols-3 md:grid-cols-4 w-full">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-xl">Address</h1>
          <p className="max-w-[200px]">
            Hilite business park, Kozhikode, Kerala, India.
          </p>
          <h1 className="font-bold text-xl mt-5">Contact</h1>
          <p className="">+91 8589000052</p>
          <div className="flex gap-4 sm:mt-12  ">
            <a href="">
              <Image
                src={"/footer/facebookIcon.svg"}
                alt="none"
                width={18}
                height={18}
              />
            </a>
            <a href="">
              <Image
                src={"/footer/instaIcon.svg"}
                alt="none"
                width={18}
                height={18}
              />
            </a>
            <a href="">
              <Image
                src={"/footer/linkedInIcon.svg"}
                alt="none"
                width={18}
                height={18}
              />
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-5 md:mt-0 md:items-center">
          <h1 className="font-semibold text-xl">Pages</h1>

          <div className="flex flex-col gap-2 text-sm">
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
          </div>
        </div>
        {/* <div className="flex flex-col gap-3">
          <h1 className="font-semibold text-sm">Stay Updated</h1>
          <form
            action=""
            className="flex bg-white px-1 py-1 sm:mt-9"
            onSubmit={subscribeEmail}
          >
            <input
              type="email"
              placeholder="Enter your Email "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="placeholder:text-xs md:placeholder:text-sm  placeholder:px-2 text-blue-gray-800 outline-none min-w-1 "
            />{" "}
            <button className="bg-[#003329] px-2 py-2" type="submit">
              {" "}
              <img src={"/footer/sentIcon.svg"} alt="" className="w-6 " />
            </button>
          </form>
        </div> */}
        <div className="md:col-span-2 flex">
          <iframe
            src="https://cdn.forms-content-1.sg-form.com/d8657c49-1c04-11ef-8456-ea7584dea972"
            className="w-full h-[460px]"
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Footersection;
