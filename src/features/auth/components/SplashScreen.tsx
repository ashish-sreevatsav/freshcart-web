import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center z-[100] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-6 animate-bounce">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
            <span className="text-5xl">🛒</span>
          </div>
        </div>

        {/* App Name with fade-in animation */}
        <h1 className="text-white text-5xl font-bold mb-2 animate-fade-in">
          FreshCart
        </h1>
        <p className="text-green-100 text-lg animate-fade-in-delay">
          Fresh groceries delivered
        </p>

        {/* Loading indicator */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-150"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-300"></div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.3s both;
        }

        .delay-150 {
          animation-delay: 150ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
}
