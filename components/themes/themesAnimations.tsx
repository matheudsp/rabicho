import React, { useMemo } from 'react';

export const HeartAnimation = ({ isDark }: { isDark: boolean }) => {
  // Use useMemo to ensure the random positions are calculated only once
  const hearts = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDuration: `${15 + Math.random() * 20}s`,
      animationDelay: `${Math.random() * 5}s`,
      size: `${20 + Math.random() * 20}px`
    }));
  }, []); // Empty dependency array means this runs only once on mount
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart, i) => (
        <div
          key={i}
          className={`absolute animate-float ${isDark ? "text-rose-700" : "text-rose-500"} opacity-70`}
          style={{
            left: heart.left,
            top: `-50px`,
            animationDuration: heart.animationDuration,
            animationDelay: heart.animationDelay,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
            style={{ width: heart.size }}
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export const GlitterAnimation = ({ isDark }: { isDark: boolean }) => {
  // Use useMemo to ensure the random positions are calculated only once
  const glitters = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${2 + Math.random() * 6}px`,
      height: `${2 + Math.random() * 6}px`,
      opacity: 0.3 + Math.random() * 0.7,
      animationDuration: `${3 + Math.random() * 4}s`,
      animationDelay: `${Math.random() * 5}s`,
    }));
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {glitters.map((glitter, i) => (
        <div
          key={i}
          className={`absolute ${isDark ? "bg-indigo-400" : "bg-indigo-300"} rounded-full animate-pulse-fade`}
          style={{
            left: glitter.left,
            top: glitter.top,
            width: glitter.width,
            height: glitter.height,
            opacity: glitter.opacity,
            animationDuration: glitter.animationDuration,
            animationDelay: glitter.animationDelay,
          }}
        ></div>
      ))}
    </div>
  );
};

export const BalloonAnimation = () => {
  // Use useMemo to ensure the random positions are calculated only once
  const balloons = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      left: `${10 + Math.random() * 80}%`,
      animationDuration: `${30 + Math.random() * 30}s`,
      animationDelay: `${Math.random() * 10}s`,
      width: `${30 + Math.random() * 20}px`,
      color: ["#F59E0B", "#EF4444", "#3B82F6", "#10B981", "#8B5CF6"][Math.floor(Math.random() * 5)]
    }));
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {balloons.map((balloon, i) => (
        <div
          key={i}
          className="absolute animate-float-slow"
          style={{
            left: balloon.left,
            top: `100%`,
            animationDuration: balloon.animationDuration,
            animationDelay: balloon.animationDelay,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={balloon.color}
            className="w-8 h-10"
            style={{ width: balloon.width }}
          >
            <path d="M12 2C7.03 2 3 6.03 3 11c0 2.31.83 4.41 2.2 6.03.19.22.15.55-.08.73l-.08.08c-.29.29-.38.71-.25 1.09.13.38.49.65.9.65h12.63c.41 0 .77-.27.9-.65.12-.38.04-.8-.25-1.09l-.07-.08c-.24-.18-.28-.51-.08-.73C20.17 15.41 21 13.31 21 11c0-4.97-4.03-9-9-9z" />
            <path d="M12 22l-2.09-4.18M12 22l2.09-4.18" stroke="#888888" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export const ConfettiExplosion = () => {
  // Use useMemo to ensure the random positions are calculated only once
  const confetti = useMemo(() => {
    return [...Array(50)].map((_, i) => ({
      width: `${5 + Math.random() * 7}px`,
      height: `${5 + Math.random() * 7}px`,
      backgroundColor: ["#F59E0B", "#EF4444", "#3B82F6", "#10B981", "#8B5CF6"][Math.floor(Math.random() * 5)],
      rotation: `${Math.random() * 360}deg`,
      borderRadius: Math.random() > 0.5 ? '50%' : '0%',
      animationDuration: `${1 + Math.random() * 2}s`,
      animationDelay: `${Math.random() * 0.5}s`,
    }));
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {confetti.map((piece, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: '50%',
            top: '50%',
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.backgroundColor,
            transformOrigin: 'center',
            transform: `rotate(${piece.rotation})`,
            borderRadius: piece.borderRadius,
            animationDuration: piece.animationDuration,
            animationDelay: piece.animationDelay,
          }}
        ></div>
      ))}
    </div>
  );
};