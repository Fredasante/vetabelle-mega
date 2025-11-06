"use client";
import { useState, useEffect } from "react";
import { fetchColors } from "@/lib/productUtils";

// Color mapping for visual display
const colorMap: Record<string, string> = {
  red: "#EF4444",
  blue: "#3B82F6",
  orange: "#F97316",
  pink: "#EC4899",
  purple: "#A855F7",
  black: "#000000",
  white: "#FFFFFF",
  green: "#10B981",
  yellow: "#EAB308",
  gray: "#6B7280",
  grey: "#6B7280",
  brown: "#92400E",
  beige: "#D4C5B9",
  navy: "#1E3A8A",
};

const ColorsDropdown = ({ onColorChange }) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [colors, setColors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    const loadColors = async () => {
      const data = await fetchColors();
      setColors(data);
      setLoading(false);
    };

    loadColors();
  }, []);

  const handleColorClick = (color: string) => {
    const newSelection = selectedColor === color ? null : color;
    setSelectedColor(newSelection);
    onColorChange(newSelection || "");
  };

  const getColorValue = (colorName: string) => {
    return colorMap[colorName.toLowerCase()] || "#9CA3AF";
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
        <p className="text-dark font-medium">Colors</p>
        <button
          aria-label="Toggle colors dropdown"
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
        ) : colors.length > 0 ? (
          colors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorClick(color.name)}
              className="cursor-pointer select-none flex items-center group"
              title={`${color.name} (${color.products})`}
            >
              <div
                className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200"
                style={{
                  boxShadow:
                    selectedColor === color.name
                      ? `0 0 0 2px white, 0 0 0 4px ${getColorValue(
                          color.name
                        )}`
                      : "0 0 0 1px rgba(209, 213, 219, 1)",
                }}
              >
                <span
                  className={`block w-4 h-4 rounded-full ${
                    color.name.toLowerCase() === "white"
                      ? "border border-gray-300"
                      : ""
                  }`}
                  style={{ backgroundColor: getColorValue(color.name) }}
                ></span>
              </div>
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-500 py-10">No colors available.</p>
        )}
      </div>
    </div>
  );
};

export default ColorsDropdown;
