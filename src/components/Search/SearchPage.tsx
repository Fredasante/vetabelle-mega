"use client";

import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import SingleGridItem from "@/components/Shop/SingleGridItem";
import SingleListItem from "@/components/Shop/SingleListItem";
import { ListBulletIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import { ClipLoader } from "react-spinners";
import Pagination from "@/components/Common/Pagination";
import { useSearchParams } from "next/navigation";
import { searchProducts } from "@/lib/searchQueries";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [productStyle, setProductStyle] = useState("grid");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const productsTopRef = useRef<HTMLDivElement>(null);

  // Fetch search results
  useEffect(() => {
    const loadSearchResults = async () => {
      if (!searchQuery) {
        setProducts([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { products, totalCount } = await searchProducts(searchQuery, {
        page: currentPage,
        perPage,
      });
      setProducts(products);
      setTotalCount(totalCount);
      setLoading(false);
    };

    loadSearchResults();
  }, [searchQuery, currentPage, perPage]);

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

  const pageTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : "Search Results";

  return (
    <>
      <Breadcrumb title={pageTitle} pages={["search"]} />
      <section
        className="overflow-hidden relative pb-20 pt-5 lg:pt-12 bg-[#f3f4f6]"
        ref={productsTopRef}
      >
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* Header */}
          <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-sm sm:text-base">
                  {searchQuery ? (
                    <>
                      Showing{" "}
                      <span className="text-dark font-medium">
                        {(currentPage - 1) * perPage + 1}-
                        {Math.min(currentPage * perPage, totalCount)} of{" "}
                        {totalCount}
                      </span>{" "}
                      Results
                    </>
                  ) : (
                    <span className="text-gray-600">
                      Enter a search term to find products
                    </span>
                  )}
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
            ) : !searchQuery ? (
              <div className="text-center col-span-full py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gray-1 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-dark mb-2">
                    Start Your Search
                  </h3>
                  <p className="text-gray-600">
                    Use the search bar above to find products
                  </p>
                </div>
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
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gray-1 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-dark mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-600 mb-1">
                    We couldn&apos;t find any products matching &quot;
                    {searchQuery}&quot;
                  </p>
                  <p className="text-sm text-gray-500">
                    Try using different keywords or check your spelling
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && products.length > 0 && totalPages > 1 && (
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
}
