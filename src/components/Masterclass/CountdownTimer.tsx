"use client";
import React, { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

interface CountdownTimerProps {
  targetDate: string;
  label?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  label = "Early bird closes in",
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(targetDate));
  const expired = Object.values(timeLeft).every((v) => v === 0);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (expired) return null;

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hrs", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <div className="mb-4">
      <p className="text-xs font-medium text-[#c2712f] uppercase tracking-wide mb-2">
        {label}
      </p>
      <div className="flex items-center gap-2">
        {units.map(({ label: unitLabel, value }, i) => (
          <React.Fragment key={unitLabel}>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-dark tabular-nums leading-none">
                {pad(value)}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">
                {unitLabel}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="text-lg font-bold text-[#c2712f] mb-3 select-none">
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
