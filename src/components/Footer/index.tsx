import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 px-4 sm:px-6 pt-12 pb-6">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* CONTACT / ABOUT SECTION */}
        <div className="space-y-5">
          <h6 className="font-semibold">GET IN TOUCH</h6>
          <ul className="space-y-3">
            <li className="flex items-center text-[15px] text-gray-500 hover:text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-600" />
              Near Entrance Hospital Kokomelemele.
            </li>
            <li className="flex items-center text-[15px] text-gray-500 hover:text-gray-600">
              <Mail className="w-4 h-4 mr-2 text-gray-600" />
              vetabellegh@gmail.com
            </li>
            <li className="flex items-center text-[15px] text-gray-500 hover:text-gray-600">
              <Phone className="w-4 h-4 mr-2 text-gray-600" />
              +233 54 818 2872
            </li>
            <li className="flex items-center text-[15px] text-gray-500 hover:text-gray-600">
              <Phone className="w-4 h-4 mr-2 text-gray-600" />
              +233 20 873 9590
            </li>
          </ul>
        </div>
        {/* SHOP LINKS */}
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
                href="/products"
                className="text-[15px] text-gray-500 hover:text-gray-600"
              >
                Explore All Products
              </Link>
            </li>
            <li>
              <Link
                href="/gallery"
                className="text-[15px] text-gray-500 hover:text-gray-600"
              >
                Gallery
              </Link>
            </li>
          </ul>
        </div>
        {/* HELPFUL LINKS */}
        <div className="space-y-5">
          <h6 className="font-semibold">HELPFUL LINKS</h6>
          <ul className="space-y-3">
            <li>
              <Link
                href="/about"
                className="text-[15px] text-gray-500 hover:text-gray-600"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-[15px] text-gray-500 hover:text-gray-600"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="text-[15px] text-gray-500 hover:text-gray-600"
              >
                FAQs
              </Link>
            </li>
          </ul>
        </div>
        {/* SOCIALS */}
        <div className="space-y-5">
          <h6 className="font-semibold">CONNECT WITH US</h6>
          <p className="text-[15px] text-gray-500">
            Follow Vetabelle on social media and stay updated on our wellness
            and beauty insights.
          </p>
          <ul className="flex space-x-5">
            {/* Instagram */}
            <li>
              <a
                href="https://www.instagram.com/vetabellegh"
                target="_blank"
                rel="noopener noreferrer"
              >
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
                      <rect width="152" height="152" fill="url(#a)" rx="76" />
                      <path
                        fill="#fff"
                        d="M94 36H58a22 22 0 0 0-22 22v36a22 22 0 0 0 22 22h36a22 22 0 0 0 22-22V58a22 22 0 0 0-22-22zm15 54.84A18.16 18.16 0 0 1 90.84 109H61.16A18.16 18.16 0 0 1 43 90.84V61.16A18.16 18.16 0 0 1 61.16 43h29.68A18.16 18.16 0 0 1 109 61.16z"
                      />
                      <path
                        fill="#fff"
                        d="M76 89.56A13.56 13.56 0 1 1 89.37 76 13.46 13.46 0 0 1 76 89.56zm26.43-35.18a4.88 4.88 0 0 1-4.85 4.92 4.81 4.81 0 0 1-3.42-1.43 4.93 4.93 0 0 1 3.43-8.39 4.82 4.82 0 0 1 3.09 1.12l.1.1a3.05 3.05 0 0 1 .44.44l.11.12a4.92 4.92 0 0 1 1.1 3.12z"
                      />
                    </g>
                  </g>
                </svg>
              </a>
            </li>

            {/* WhatsApp */}
            <li>
              <a
                href="https://wa.me/233548182872"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 fill-green-light"
                  viewBox="0 0 32 32"
                >
                  <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.82.75 5.54 2.18 7.93L.52 31.5l7.72-2.06A15.37 15.37 0 0 0 16 31.5c8.56 0 15.5-6.94 15.5-15.5S24.56.5 16 .5zm0 28.3c-2.6 0-5.14-.68-7.36-1.97l-.53-.3-4.59 1.22 1.23-4.47-.35-.55A13.2 13.2 0 0 1 2.7 16 13.27 13.27 0 1 1 16 28.8zm7.6-10.04c-.41-.21-2.42-1.2-2.8-1.33-.38-.14-.66-.21-.94.21-.27.41-1.08 1.33-1.32 1.6-.24.27-.49.31-.9.1-.41-.21-1.73-.64-3.3-2.03-1.22-1.08-2.03-2.42-2.26-2.83-.24-.41-.03-.63.18-.84.18-.18.41-.49.62-.73.21-.24.28-.41.41-.69.14-.27.07-.52-.03-.73-.1-.21-.94-2.26-1.29-3.1-.34-.82-.69-.71-.94-.73h-.8c-.28 0-.73.1-1.11.52s-1.46 1.43-1.46 3.5 1.5 4.07 1.71 4.35c.21.28 2.96 4.52 7.15 6.34.99.43 1.76.69 2.36.88.99.31 1.9.27 2.62.16.8-.12 2.42-.99 2.76-1.94.34-.94.34-1.76.24-1.94-.1-.18-.38-.28-.8-.49z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      <div className="max-w-screen-xl mx-auto text-center">
        <p className="text-gray-400 text-[13px]">
          Vetabelle © {year}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
