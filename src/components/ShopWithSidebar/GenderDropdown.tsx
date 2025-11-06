"use client";
import { useState, useEffect } from "react";
import { fetchGenders } from "@/lib/productUtils";

const GenderItem = ({ gender, selected, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(gender.name)}
      className={`${
        selected ? "text-blue" : "text-dark"
      } group flex items-center justify-between ease-out duration-200 hover:text-blue`}
    >
      <div className="flex items-center gap-2">
        {/* Radio button style - only one can be selected */}
        <div
          className={`cursor-pointer flex items-center justify-center rounded-full w-4 h-4 border ${
            selected ? "border-blue" : "border-gray-3"
          }`}
        >
          {selected && <div className="w-2 h-2 rounded-full bg-blue" />}
        </div>
        <span>{gender.name}</span>
      </div>

      <span
        className={`${
          selected ? "text-white bg-blue" : "bg-gray-2 text-dark"
        } inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-white group-hover:bg-blue`}
      >
        {gender.products}
      </span>
    </button>
  );
};

const GenderDropdown = ({ onGenderChange }) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [genders, setGenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  useEffect(() => {
    const loadGenders = async () => {
      const data = await fetchGenders();
      setGenders(data);
      setLoading(false);
    };

    loadGenders();
  }, []);

  const handleToggleGender = (name: string) => {
    // If clicking the same gender, deselect it (show all products)
    const newSelection = selectedGender === name ? null : name;
    setSelectedGender(newSelection);

    // Pass lowercase gender value or empty string for "all"
    onGenderChange(newSelection ? newSelection.toLowerCase() : "");
  };

  return (
    <div className="bg-white shadow-1 rounded-lg">
      {/* Header */}
      <div
        onClick={(e) => {
          e.preventDefault();
          setToggleDropdown(!toggleDropdown);
        }}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${
          toggleDropdown && "shadow-filter"
        }`}
      >
        <p className="text-dark font-medium">Gender</p>
        <button
          aria-label="Toggle gender dropdown"
          className={`text-dark transition-transform duration-200 ${
            toggleDropdown && "rotate-180"
          }`}
        >
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown Body */}
      <div
        className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${
          toggleDropdown ? "flex" : "hidden"
        }`}
      >
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : genders.length > 0 ? (
          genders.map((gender) => (
            <GenderItem
              key={gender.name}
              gender={gender}
              selected={selectedGender === gender.name}
              onToggle={handleToggleGender}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 py-10">No genders found.</p>
        )}
      </div>
    </div>
  );
};

export default GenderDropdown;
