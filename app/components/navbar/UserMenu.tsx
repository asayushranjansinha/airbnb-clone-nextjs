"use client";
import { useState, useCallback } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import MenuItems from "./MenuItems";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";

import { signOut } from "next-auth/react";
import { SafeUser } from "@/app/types";
import { toast } from "react-hot-toast";
interface UserMenuProps {
  currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  return (
    <div className="relative ">
      <div className="flex flex-row gap-3">
        <div
          onClick={() => {}}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer "
        >
          Airbnb Your Home
        </div>
        <div
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-100 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
          onClick={toggleOpen}
        >
          <AiOutlineMenu />

          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItems onClick={() => {}} label="My Trips" />
                <MenuItems onClick={() => {}} label="My Favourites" />
                <MenuItems onClick={() => {}} label="My Reservations" />
                <MenuItems onClick={() => {}} label="My Properties" />
                <MenuItems onClick={() => {}} label="Airbnb my home" />
                <MenuItems
                  onClick={() => {
                    signOut();
                    toast.success("Logged Out");
                  }}
                  label="Logout"
                />
              </>
            ) : (
              <>
                <MenuItems onClick={loginModal.onOpen} label="Login" />
                <MenuItems onClick={registerModal.onOpen} label="Sign up" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
