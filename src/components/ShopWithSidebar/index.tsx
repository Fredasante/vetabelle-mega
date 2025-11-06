"use client";

import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "./CustomSelect";
import CategoryDropdown from "./CategoryDropdown";
import GenderDropdown from "./GenderDropdown";
import SizeDropdown from "./SizeDropdown";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import { ListBulletIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import { fetchPaginatedProducts } from "@/lib/productUtils";
import { ClipLoader } from "react-spinners";
import Pagination from "../Common/Pagination";
import ColorsDropdown from "./ColorsDropdown";

const ShopWithSidebar = () => {
  const [productStyle, setProductStyle] = useState("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(9);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const productsTopRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleStickyMenu = () => {
    setStickyMenu(window.scrollY >= 80);
  };

  // Close sidebar function
  const closeSidebar = () => {
    setProductSidebar(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Close if clicking outside sidebar
      if (
        productSidebar &&
        sidebarRef.current &&
        !sidebarRef.current.contains(target) &&
        !target.closest(
          'button[aria-label="button for product sidebar toggle"]'
        )
      ) {
        closeSidebar();
      }
    };

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, [productSidebar]);

  const options = [
    { label: "Latest Products", value: "1" },
    { label: "Old Products", value: "2" },
  ];

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const { products, totalCount } = await fetchPaginatedProducts({
        page: currentPage,
        perPage,
        category: selectedCategory,
        gender: selectedGender,
        size: selectedSize,
        color: selectedColor,
      });
      setProducts(products);
      setTotalCount(totalCount);
      setLoading(false);
    };

    loadProducts();
  }, [
    currentPage,
    perPage,
    selectedCategory,
    selectedGender,
    selectedSize,
    selectedColor,
  ]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    closeSidebar();
  };

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
    scrollToProducts();
    setCurrentPage(1);
    closeSidebar();
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    scrollToProducts();
    setCurrentPage(1);
    closeSidebar();
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    scrollToProducts();
    setCurrentPage(1);
    closeSidebar();
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedGender("");
    setSelectedSize("");
    setSelectedColor("");
    setCurrentPage(1);
    closeSidebar();
  };

  const scrollToProducts = () => {
    if (productsTopRef.current) {
      const yOffset = -150;
      const y =
        productsTopRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToProducts();
  };

  const totalPages = Math.ceil(totalCount / perPage) || 1;

  return (
    <>
      <Breadcrumb title={"Explore All Products"} pages={["shop"]} />
      <section
        className="overflow-hidden relative pb-20 pt-5 lg:pt-12 bg-[#f3f4f6]"
        ref={productsTopRef}
      >
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* Sidebar Start */}
            <div
              ref={sidebarRef}
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                  : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1 ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-37"
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
                    d="M10.0068 3.44714C10.3121 3.72703 10.3328 4.20146 10.0529 4.5068L5.70494 9.25H20C20.4142 9.25 20.75 9.58579 20.75 10C20.75 10.4142 20.4142 10.75 20 10.75H4.00002C3.70259 10.75 3.43327 10.5742 3.3135 10.302C3.19374 10.0298 3.24617 9.71246 3.44715 9.49321L8.94715 3.49321C9.22704 3.18787 9.70147 3.16724 10.0068 3.44714Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.6865 13.698C20.5668 13.4258 20.2974 13.25 20 13.25L4.00001 13.25C3.5858 13.25 3.25001 13.5858 3.25001 14C3.25001 14.4142 3.5858 14.75 4.00001 14.75L18.2951 14.75L13.9472 19.4932C13.6673 19.7985 13.6879 20.273 13.9932 20.5529C14.2986 20.8328 14.773 20.8121 15.0529 20.5068L20.5529 14.5068C20.7539 14.2876 20.8063 13.9703 20.6865 13.698Z"
                    fill=""
                  />
                </svg>
              </button>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  <div className="bg-white shadow-1 rounded-lg py-4 px-5">
                    <div className="flex items-center justify-between">
                      <p>Filters:</p>
                      <button
                        type="button"
                        className="text-blue"
                        onClick={handleClearFilters}
                      >
                        Clean All
                      </button>
                    </div>
                  </div>

                  <CategoryDropdown onCategoryChange={handleCategoryChange} />
                  <GenderDropdown onGenderChange={handleGenderChange} />
                  <SizeDropdown onSizeChange={handleSizeChange} />
                  <ColorsDropdown onColorChange={handleColorChange} />
                </div>
              </form>
            </div>
            {/* Sidebar End */}

            {/* Content Start */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    <CustomSelect options={options} />
                    <p>
                      Showing{" "}
                      <span className="text-dark">
                        {products.length} of {totalCount}
                      </span>{" "}
                      Products
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setProductStyle("grid")}
                      aria-label="grid view"
                      className={`${
                        productStyle === "grid"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <TableCellsIcon width={20} height={20} />
                    </button>

                    <button
                      onClick={() => setProductStyle("list")}
                      aria-label="list view"
                      className={`${
                        productStyle === "list"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <ListBulletIcon width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Grid/List */}
              <div
                className={`${
                  productStyle === "grid"
                    ? "grid grid-cols-2 lg:grid-cols-3 gap-x-5 md:gap-x-7.5 gap-y-9"
                    : "flex flex-col gap-7.5"
                }`}
              >
                {loading ? (
                  <div className="flex justify-center items-center w-full min-h-[300px] col-span-full">
                    <ClipLoader size={28} color="#000080" />
                  </div>
                ) : products.length > 0 ? (
                  products.map((item, key) =>
                    productStyle === "grid" ? (
                      <SingleGridItem item={item} key={key} />
                    ) : (
                      <SingleListItem item={item} key={key} />
                    )
                  )
                ) : (
                  <p className="text-center col-span-full py-10">
                    No products found.
                  </p>
                )}
              </div>

              {/* pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;
