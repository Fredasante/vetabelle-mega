"use client";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row bg-[#f9f9f9]">
      {/* Text Section */}
      <div className="max-w-[394px] py-10 pl-4 sm:pl-7.5 lg:pl-12.5 text-center sm:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-4 mb-7.5 sm:mb-10">
          <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue-dark">
            30%
          </span>
          <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px] uppercase">
            Off
            <br />
            Everything
          </span>
        </div>

        <h1 className="font-semibold text-dark text-2xl sm:text-4xl mb-3 leading-snug">
          Trendy Styles. Unbeatable Prices. You deserve it!
        </h1>

        <p className="text-gray-700 leading-relaxed">
          Upgrade your wardrobe with the season&apos;s latest looks. From casual
          wear to statement pieces — enjoy <strong>30% off everything</strong>{" "}
          for a limited time only.
        </p>

        <Link
          href="/shop"
          className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue-dark mt-10"
        >
          Shop Now
        </Link>
      </div>

      {/* Image Section */}
      <div className="flex justify-center sm:justify-end">
        <Image
          src="/images/hero/lady.png"
          alt="Bend the Trend Hero"
          width={380}
          height={358}
          className="rounded-md w-64 h-auto sm:w-[380px]"
        />
      </div>
    </div>
  );
};

export default HeroSection;
