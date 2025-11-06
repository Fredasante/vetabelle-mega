import React from "react";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 px-4 sm:px-6 pt-12 pb-6">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div className="space-y-5">
          <h6 className="font-semibold">ABOUT US</h6>
          <p className="text-[15px] text-gray-500 leading-relaxed italic">
            “At Bend the Trendd, we believe fashion is more than clothing —
            it&apos;s a reflection of confidence, culture, and creativity. Every
            piece you wear is a statement of who you are and the story
            you&apos;re telling the world.”
          </p>
          <p className="text-[15px] text-gray-500">— Bend the Trendd</p>
        </div>

        <div className="space-y-5">
          <h6 className="font-semibold">SHOP</h6>
          <ul className="space-y-3">
            <li>
              <Link
                href="/cart"
                className="text-[15px] text-gray-500 hover:text-gray-600"
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                href="/wishlist"
                className="text-[15px] text-gray-500 hover:text-gray-600"
              >
                Wishlist
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="text-[15px] text-gray-500 hover:text-gray-600"
              >
                Explore All Products
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="text-[15px] text-gray-500 hover:text-gray-600"
              >
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-5">
          <h6 className="font-semibold">HELPFUL LINKS</h6>
          <ul className="space-y-3">
            <li>
              <Link
                href="/about"
                className="text-[15px] text-gray-400 hover:text-white"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-[15px] text-gray-400 hover:text-white"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="text-[15px] text-gray-400 hover:text-white"
              >
                FAQs
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-[15px] text-gray-400 hover:text-white"
              ></Link>
            </li>
          </ul>
        </div>

        <div className="space-y-5">
          <h6 className="font-semibold">SOCIAL MEDIA</h6>
          <div className="">
            <h6 className="text-[15px] text-gray-400">
              Stay connected — follow us on social media for trend updates,
              style tips, and exclusive looks you won&apos;t find anywhere else.
            </h6>
          </div>
          <ul className="flex space-x-4">
            <li>
              <a href="javascript:void(0)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-[#0202ac] w-8 h-8"
                  viewBox="0 0 49.652 49.652"
                >
                  <path
                    d="M24.826 0C11.137 0 0 11.137 0 24.826c0 13.688 11.137 24.826 24.826 24.826 13.688 0 24.826-11.138 24.826-24.826C49.652 11.137 38.516 0 24.826 0zM31 25.7h-4.039v14.396h-5.985V25.7h-2.845v-5.088h2.845v-3.291c0-2.357 1.12-6.04 6.04-6.04l4.435.017v4.939h-3.219c-.524 0-1.269.262-1.269 1.386v2.99h4.56z"
                    data-original="#0202ac"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 152 152"
                >
                  <linearGradient
                    id="a"
                    x1="22.26"
                    x2="129.74"
                    y1="22.26"
                    y2="129.74"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#fae100" />
                    <stop offset=".15" stopColor="#fcb720" />
                    <stop offset=".3" stopColor="#ff7950" />
                    <stop offset=".5" stopColor="#ff1c74" />
                    <stop offset="1" stopColor="#6c1cd1" />
                  </linearGradient>
                  <g data-name="Layer 2">
                    <g data-name="03.Instagram">
                      <rect
                        width="152"
                        height="152"
                        fill="url(#a)"
                        data-original="url(#a)"
                        rx="76"
                      />
                      <g fill="#fff">
                        <path
                          fill="#ffffff10"
                          d="M133.2 26c-11.08 20.34-26.75 41.32-46.33 60.9S46.31 122.12 26 133.2q-1.91-1.66-3.71-3.46A76 76 0 1 1 129.74 22.26q1.8 1.8 3.46 3.74z"
                          data-original="#ffffff10"
                        />
                        <path
                          d="M94 36H58a22 22 0 0 0-22 22v36a22 22 0 0 0 22 22h36a22 22 0 0 0 22-22V58a22 22 0 0 0-22-22zm15 54.84A18.16 18.16 0 0 1 90.84 109H61.16A18.16 18.16 0 0 1 43 90.84V61.16A18.16 18.16 0 0 1 61.16 43h29.68A18.16 18.16 0 0 1 109 61.16z"
                          data-original="#ffffff"
                        />
                        <path
                          d="m90.59 61.56-.19-.19-.16-.16A20.16 20.16 0 0 0 76 55.33 20.52 20.52 0 0 0 55.62 76a20.75 20.75 0 0 0 6 14.61 20.19 20.19 0 0 0 14.42 6 20.73 20.73 0 0 0 14.55-35.05zM76 89.56A13.56 13.56 0 1 1 89.37 76 13.46 13.46 0 0 1 76 89.56zm26.43-35.18a4.88 4.88 0 0 1-4.85 4.92 4.81 4.81 0 0 1-3.42-1.43 4.93 4.93 0 0 1 3.43-8.39 4.82 4.82 0 0 1 3.09 1.12l.1.1a3.05 3.05 0 0 1 .44.44l.11.12a4.92 4.92 0 0 1 1.1 3.12z"
                          data-original="#ffffff"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 1227 1227"
                >
                  <path
                    d="M613.5 0C274.685 0 0 274.685 0 613.5S274.685 1227 613.5 1227 1227 952.315 1227 613.5 952.315 0 613.5 0z"
                    data-original="#000000"
                  />
                  <path
                    fill="#fff"
                    d="m680.617 557.98 262.632-305.288h-62.235L652.97 517.77 470.833 252.692H260.759l275.427 400.844-275.427 320.142h62.239l240.82-279.931 192.35 279.931h210.074L680.601 557.98zM345.423 299.545h95.595l440.024 629.411h-95.595z"
                    data-original="#ffffff"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <hr className="my-6 border-gray-600" />

      <div className="max-w-screen-xl mx-auto text-center">
        <p className="text-gray-400 text-[13px]">
          Bend the Trendd © 2025. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
