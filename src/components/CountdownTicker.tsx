import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

interface CountdownTickerProps {
  targetHours?: number;
}

export const CountdownTicker: React.FC<CountdownTickerProps> = ({ targetHours = 4 }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: targetHours,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="bg-netflix-red/10 border border-netflix-red/30 px-3 py-1.5 rounded-md flex items-center space-x-2 text-netflix-white text-xs">
      <div className="flex items-center space-x-1 text-netflix-red font-bold animate-pulse">
        <Flame className="w-3.5 h-3.5 fill-netflix-red" />
        <span className="uppercase text-[10px]">Show Starts In:</span>
      </div>
      <div className="font-mono font-extrabold text-netflix-white tracking-wider flex items-center space-x-1">
        <span className="bg-netflix-black px-1.5 py-0.5 rounded border border-white/10">
          {formatNumber(timeLeft.hours)}h
        </span>
        <span>:</span>
        <span className="bg-netflix-black px-1.5 py-0.5 rounded border border-white/10">
          {formatNumber(timeLeft.minutes)}m
        </span>
        <span>:</span>
        <span className="bg-netflix-black px-1.5 py-0.5 rounded border border-white/10 text-netflix-red">
          {formatNumber(timeLeft.seconds)}s
        </span>
      </div>
    </div>
  );
};
