import React from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";

interface EventEndedProps {
  title?: string;
}

export const NoActiveEvent: React.FC = () => (
  <section className="overflow-hidden py-20 bg-gray-2 mt-32 md:mt-40">
    <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      <div className="bg-white shadow-1 rounded-[10px] p-8 md:p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fdf6f0] mb-5">
          <Calendar className="w-8 h-8 text-[#c77f56]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-3">
          No upcoming masterclass right now
        </h2>
        <p className="text-dark-5 mb-7 max-w-lg mx-auto">
          We&apos;re cooking up the next one. Follow us on social media to be
          the first to know when registration opens.
        </p>
        <Link
          href="/"
          className="inline-block font-medium text-white bg-[#c77f56] py-3 px-8 rounded-md ease-out duration-200 hover:bg-opacity-90"
        >
          Back to Home
        </Link>
      </div>
    </div>
  </section>
);

export const EventEnded: React.FC<EventEndedProps> = ({ title }) => (
  <section className="overflow-hidden py-20 bg-gray-2 mt-32 md:mt-40">
    <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      <div className="bg-white shadow-1 rounded-[10px] p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-dark mb-3">
          {title ? `${title} has ended` : "This event has ended"}
        </h2>
        <p className="text-dark-5 mb-7 max-w-lg mx-auto">
          Thanks to everyone who joined! Stay tuned for the next masterclass.
        </p>
        <Link
          href="/"
          className="inline-block font-medium text-white bg-[#c77f56] py-3 px-8 rounded-md ease-out duration-200 hover:bg-opacity-90"
        >
          Back to Home
        </Link>
      </div>
    </div>
  </section>
);

export const RegistrationClosed: React.FC = () => (
  <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
    <h3 className="text-xl font-semibold text-dark mb-2">
      Registration is closed
    </h3>
    <p className="text-dark-5">
      Registration for this masterclass is no longer accepting new sign-ups.
    </p>
  </div>
);
