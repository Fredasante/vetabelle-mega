"use client";

import { useState, useRef, useEffect } from "react";
import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

interface AuthDropdownProps {
  user: any;
  isSignedIn: boolean;
}

export default function AuthDropdown({ user, isSignedIn }: AuthDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Truncate long names
  const truncateName = (name: string, maxLength: number = 12) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  // If not signed in, show sign in link
  if (!isSignedIn) {
    return (
      <Link href="/signin" className="flex items-center gap-2.5 mt-2 md:mt-0">
        <Image
          src="/icons/person.svg"
          alt="Account Icon"
          width={25}
          height={25}
        />
        <div>
          <span className="block text-2xs text-dark-4 uppercase">account</span>
          <p className="font-medium text-custom-sm text-dark">Sign In</p>
        </div>
      </Link>
    );
  }

  // If signed in, show dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2.5 mt-2 md:mt-0 hover:opacity-80 transition-opacity"
      >
        <Image
          src={user?.imageUrl || "/icons/person.svg"}
          alt="User Avatar"
          width={25}
          height={25}
          className="rounded-full object-cover"
        />
        <div className="text-left">
          <span className="block text-2xs text-dark-4 uppercase">account</span>
          <p className="font-medium text-custom-sm text-dark">
            {truncateName(user?.firstName || "My Account")}
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-dark transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-1 border border-gray-3 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-3">
            <p className="font-medium text-dark text-sm">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-dark-4 truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          <div className="pt-2">
            <SignOutButton>
              <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red hover:bg-gray-1 transition-colors text-left">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      )}
    </div>
  );
}
