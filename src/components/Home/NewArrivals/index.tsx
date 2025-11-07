"use client";

import { useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";
import { client, fetcher } from "@/sanity/client";
import { newArrivalsQuery } from "@/sanity/groq";
import ProductItem from "@/components/Common/ProductItem";
import { ClipLoader } from "react-spinners";
import { Handbag } from "lucide-react";

export default function NewArrival() {
  // Fetch products via SWR
  const fetchProducts = async () => {
    return await fetcher([newArrivalsQuery]);
  };

  const {
    data: products = [],
    isLoading,
    mutate,
  } = useSWR("new-arrivals", fetchProducts, {
    revalidateOnFocus: false,
    fallbackData: [],
  });

  // Real-time Sanity subscription for instant updates
  useEffect(() => {
    const subscription = client
      .listen('*[_type == "product"]', {}, { includeResult: true })
      .subscribe((update) => {
        mutate(); // Refresh data
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [mutate]);

  return (
    <section className="overflow-hidden pt-15 bg-[#f3f4f6] pb-5 lg:pb-10">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Section Header */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <Handbag color="#c77f56" className="w-5 h-5" />
              This Week&apos;s
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              New Arrivals
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            View All
          </Link>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <ClipLoader size={30} color={"#c77f56"} className="mx-auto py-10" />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 md:gap-x-7.5 gap-y-9">
            {products.length > 0 ? (
              products.map((item: any) => (
                <ProductItem key={item._id} item={item} />
              ))
            ) : (
              <p className="text-center col-span-full py-10">
                No new arrivals yet.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
