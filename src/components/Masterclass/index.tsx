"use client";
import React, { useRef } from "react";
import { PortableText } from "@portabletext/react";
import type { Masterclass as MasterclassType } from "@/types/masterclass";
import { getRegistrationState } from "@/lib/masterclass";
import Hero from "./Hero";
import RegistrationForm from "./RegistrationForm";
import { EventEnded, RegistrationClosed } from "./EmptyStates";

interface MasterclassProps {
  masterclass: MasterclassType;
}

const Masterclass: React.FC<MasterclassProps> = ({ masterclass }) => {
  const formRef = useRef<HTMLDivElement>(null);
  const state = getRegistrationState(masterclass);

  if (state === "ended") {
    return <EventEnded title={masterclass.title} />;
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main>
      <Hero masterclass={masterclass} onRegisterClick={scrollToForm} />

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-5">
                About this Masterclass
              </h2>
              <div className="prose max-w-none leading-relaxed text-slate-500">
                <PortableText value={masterclass.description} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-dark mb-4">
                What you&apos;ll learn
              </h3>
              <ul className="space-y-2.5">
                {masterclass.learningTopics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-2 text-slate-500"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c77f56] mt-2 flex-shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section ref={formRef} className="py-12 md:py-16 bg-gray-2">
        <div className="max-w-[800px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {state === "open" ? (
            <RegistrationForm masterclass={masterclass} />
          ) : (
            <RegistrationClosed />
          )}
        </div>
      </section>
    </main>
  );
};

export default Masterclass;
