"use client";

import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "./CustomSelect";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import { ListBulletIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import { fetchPaginatedProducts } from "@/lib/productUtils";
import { ClipLoader } from "react-spinners";
import Pagination from "../Common/Pagination";

const ShopWithoutSidebar = () => {
  const [productStyle, setProductStyle] = useState("grid");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState("latest");
  const productsTopRef = useRef<HTMLDivElement>(null);

  const options = [
    { label: "Latest Products", value: "latest" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
  ];

  // Fetch products whenever page, perPage, or sortBy changes
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const { products, totalCount } = await fetchPaginatedProducts({
        page: currentPage,
        perPage,
        sortBy,
      });
      setProducts(products);
      setTotalCount(totalCount);
      setLoading(false);
    };

    loadProducts();
  }, [currentPage, perPage, sortBy]);

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

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
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
          {/* Header */}
          <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <CustomSelect
                  options={options}
                  value={sortBy}
                  onChange={handleSortChange}
                />
                <p className="text-sm sm:text-base">
                  Showing{" "}
                  <span className="text-dark font-medium">
                    {(currentPage - 1) * perPage + 1}-
                    {Math.min(currentPage * perPage, totalCount)} of{" "}
                    {totalCount}
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
                      ? "bg-teal border-teal text-white"
                      : "text-dark bg-gray-1 border-gray-3"
                  } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-teal hover:border-teal hover:text-white`}
                >
                  <TableCellsIcon width={20} height={20} />
                </button>

                <button
                  onClick={() => setProductStyle("list")}
                  aria-label="list view"
                  className={`${
                    productStyle === "list"
                      ? "bg-teal border-teal text-white"
                      : "text-dark bg-gray-1 border-gray-3"
                  } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-teal hover:border-teal hover:text-white`}
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
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 md:gap-x-7.5 gap-y-9"
                : "flex flex-col gap-7.5"
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center w-full min-h-[300px] col-span-full">
                <ClipLoader size={32} color={"#c77f56"} />
              </div>
            ) : products.length > 0 ? (
              products.map((item) =>
                productStyle === "grid" ? (
                  <SingleGridItem item={item} key={item._id} />
                ) : (
                  <SingleListItem item={item} key={item._id} />
                )
              )
            ) : (
              <div className="text-center col-span-full py-20">
                <p className="text-lg text-gray-600">No products found.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default ShopWithoutSidebar;
