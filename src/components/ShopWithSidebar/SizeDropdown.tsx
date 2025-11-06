"use client";
import { useState, useEffect } from "react";
import { fetchSizes } from "@/lib/productUtils";

const SizeDropdown = ({ onSizeChange }) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [sizes, setSizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    const loadSizes = async () => {
      const data = await fetchSizes();
      setSizes(data);
      setLoading(false);
    };

    loadSizes();
  }, []);

  const handleSizeClick = (size: string) => {
    const newSelection = selectedSize === size ? null : size;
    setSelectedSize(newSelection);
    onSizeChange(newSelection || "");
    // Scroll is now handled in parent component's handleSizeChange
  };

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={(e) => {
          e.preventDefault();
          setToggleDropdown(!toggleDropdown);
        }}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${
          toggleDropdown && "shadow-filter"
        }`}
      >
        <p className="text-dark font-medium">Size</p>
        <button
          aria-label="Toggle size dropdown"
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

      <div
        className={`flex-wrap gap-2.5 p-6 ${
          toggleDropdown ? "flex" : "hidden"
        }`}
      >
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : sizes.length > 0 ? (
          sizes.map((size) => (
            <button
              key={size.name}
              onClick={() => handleSizeClick(size.name)}
              className={`cursor-pointer select-none text-custom-sm py-[5px] px-3.5 rounded-[5px] transition-all duration-200 ${
                selectedSize === size.name
                  ? "bg-blue text-white"
                  : "bg-gray-100 text-dark hover:bg-blue hover:text-white"
              }`}
            >
              {size.name}
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-500 py-10">No sizes available.</p>
        )}
      </div>
    </div>
  );
};

export default SizeDropdown;
