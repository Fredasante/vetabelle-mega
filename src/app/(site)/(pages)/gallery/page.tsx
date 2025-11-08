import Breadcrumb from "@/components/Common/Breadcrumb";
import React from "react";

const Gallery = () => {
  const images = [
    "/Photo-2.jpg",
    "/Photo-3.jpg",
    "/Photo-4.jpg",
    "/vetabelle-image-1.jpg",
    "/Photo-9.jpg",
    "/Photo-12.jpg",
    "/Photo-13.jpg",
    "/Photo-5.jpg",
    "/vetabelle-image-4.jpg",
    "/Photo-8.jpg",
    "/Photo-6.jpg",
    "/Photo-7.jpg",
  ];

  return (
    <>
      <Breadcrumb title={"Gallery"} pages={["gallery"]} />

      <section className="overflow-hidden py-10 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-bold text-2xl md:text-4xl text-dark mb-5">
              Vetabelle Gallery
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore moments that reflect our passion for wellness and beauty —
              a visual journey through the Vetabelle lifestyle.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((src, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl shadow-md group"
              >
                <img
                  src={src}
                  alt={`Vetabelle gallery ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Gallery;
