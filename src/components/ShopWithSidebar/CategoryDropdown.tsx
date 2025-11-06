"use client";
import { fetchCategories } from "@/lib/productUtils";
import { useState, useEffect } from "react";

const CategoryItem = ({ category, selected, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(category.name)}
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
        <span className="capitalize">{category.name}</span>
      </div>
      <span
        className={`${
          selected ? "text-white bg-blue" : "bg-gray-2 text-dark"
        } inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-white group-hover:bg-blue`}
      >
        {category.products}
      </span>
    </button>
  );
};

const CategoryDropdown = ({ onCategoryChange }) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
      setLoading(false);
    };

    loadCategories();
  }, []);

  const handleToggleCategory = (name: string) => {
    // If clicking the same category, deselect it (show all products)
    const newSelection = selectedCategory === name ? null : name;
    setSelectedCategory(newSelection);

    // Pass single category or empty string for "all"
    onCategoryChange(newSelection || "");
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
        <p className="text-dark font-medium">Category</p>
        <button
          aria-label="Toggle category dropdown"
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
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <CategoryItem
              key={category.name}
              category={category}
              selected={selectedCategory === category.name}
              onToggle={handleToggleCategory}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 py-10">No categories found.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryDropdown;
