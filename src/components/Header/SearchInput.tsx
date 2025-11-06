"use client";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import CustomSelect from "./CustomSelect";
import { useRouter } from "next/navigation";
import { getCategories } from "@/lib/categoryQueries";

export default function SearchInput() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [categoryOptions, setCategoryOptions] = useState([
    { label: "All Categories", value: "0" },
  ]);
  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      const categories = await getCategories();
      const options = [
        { label: "All Categories", value: "0" },
        ...categories.map((category) => ({
          label: category.charAt(0).toUpperCase() + category.slice(1),
          value: category,
        })),
      ];
      setCategoryOptions(options);
    };
    loadCategories();
  }, []);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);

    // Navigate immediately when category changes (except "All Categories")
    if (value !== "0") {
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.set("q", searchQuery);
      }
      params.set("category", value);
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim() && selectedCategory === "0") {
      return;
    }

    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("q", searchQuery);
    }
    if (selectedCategory !== "0") {
      params.set("category", selectedCategory);
    }

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch}>
      <div className="flex items-center">
        <CustomSelect
          options={categoryOptions}
          onChange={handleCategoryChange}
          defaultValue="0"
        />

        <div className="relative max-w-[333px] sm:min-w-[333px] w-full">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 inline-block w-px h-5.5 bg-gray-4"></span>
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            type="search"
            name="search"
            id="search"
            placeholder="I am shopping for..."
            autoComplete="off"
            className="custom-search w-full rounded-r-[5px] bg-gray-1 !border-l-0 border border-gray-3 py-2.5 pl-4 pr-10 outline-none ease-in duration-200"
          />

          <button
            type="submit"
            id="search-btn"
            aria-label="Search"
            className="flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 ease-in duration-200 hover:text-blue"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
}
