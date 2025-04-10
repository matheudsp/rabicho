import React, { useMemo } from 'react';

export const HeartAnimation = ({ isDark }: { isDark: boolean }) => {
  // Create hearts with more varied animations
  const hearts = useMemo(() => {
    return [...Array(10)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDuration: `${8 + Math.random() * 15}s`, // Faster animation
      animationDelay: `${Math.random() * 3}s`, // Less delay
      size: `${20 + Math.random() * 30}px`, // Bigger hearts
      opacity: 0.6 + Math.random() * 0.4, // More opacity
      rotate: Math.random() > 0.5 ? `${Math.random() * 20}deg` : `-${Math.random() * 20}deg`,
      scale: 0.9 + Math.random() * 0.4
    }));
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart, i) => (
        <div
          key={i}
          className="absolute animate-float-slow"
          style={{
            left: heart.left,
            top: '100%',
            animationDuration: heart.animationDuration,
            animationDelay: heart.animationDelay,
          }}
        >
          <svg
            width={heart.size}
            height={heart.size}
            viewBox="0 0 24 24"
            fill={isDark ? "#f9a8d4" : "#e11d48"}
            style={{
              transform: `rotate(${heart.rotate}) scale(${heart.scale})`,
              opacity: heart.opacity,
              filter: `drop-shadow(0 0 2px ${isDark ? 'rgba(253, 164, 175, 0.5)' : 'rgba(225, 29, 72, 0.5)'})`
            }}
          >
            {/* Heart shape SVG path */}
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export const GlitterAnimation = ({ isDark }: { isDark: boolean }) => {
  // Create more dynamic sparkles with star shapes and movement
  const sparkles = useMemo(() => {
    return [...Array(40)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${3 + Math.random() * 8}px`,
      opacity: 0.3 + Math.random() * 0.7,
      animationDuration: `${2 + Math.random() * 4}s`,
      animationDelay: `${Math.random() * 5}s`,
      type: Math.random() > 0.5 ? 'circle' : 'star',
      color: isDark 
        ? [`bg-indigo-400`, `bg-purple-300`, `bg-blue-300`, `bg-white`][Math.floor(Math.random() * 4)]
        : [`bg-indigo-300`, `bg-purple-200`, `bg-blue-200`, `bg-white`][Math.floor(Math.random() * 4)]
    }));
  }, [isDark]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {sparkles.map((sparkle, i) => (
        <div
          key={i}
          className={`absolute ${sparkle.color} ${sparkle.type === 'circle' ? 'rounded-full' : 'star-shape'} animate-pulse-fade`}
          style={{
            left: sparkle.left,
            top: sparkle.top,
            width: sparkle.size,
            height: sparkle.size,
            opacity: sparkle.opacity,
            animationDuration: sparkle.animationDuration,
            animationDelay: sparkle.animationDelay,
            boxShadow: `0 0 ${parseInt(sparkle.size) * 2}px ${parseInt(sparkle.size) / 2}px rgba(255, 255, 255, 0.7)`,
            ...(sparkle.type === 'star' ? {
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
            } : {})
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