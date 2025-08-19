import React, { useEffect, useState } from 'react';

export default function SabnodeAnimatedLogo() {
  const letters = 'sabnode'.split('');
  const [visibleLetters, setVisibleLetters] = useState(0);

  useEffect(() => {
    // Reveal letters one by one
    const interval = setInterval(() => {
      setVisibleLetters((prev) => {
        if (prev >= letters.length) {
          clearInterval(interval); // Stop once all letters are visible
          return prev;
        }
        return prev + 1;
      });
    }, 150); // 150ms between each letter

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      {/* Subtle Pulsing Dots */}
      <div className="flex gap-2 mb-5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#2980B9] animate-ping"
            style={{
              animationDelay: `${i * 200}ms`,
              animationDuration: '1.5s',
            }}
          />
        ))}
      </div>

      {/* "sabnode" Animated Reveal */}
      <div className="flex space-x-2 text-4xl font-bold tracking-wide">
        {letters.map((char, i) => (
          <span
            key={i}
            className={`transition-all duration-700 ease-out transform ${
              i < visibleLetters
                ? 'opacity-100 translate-y-0 scale-100 text-[#2980B9]'
                : 'opacity-0 translate-y-3 scale-90 text-gray-300'
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}
