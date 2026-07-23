import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative">
        <div className="absolute -inset-4 bg-white/20 rounded-full opacity-20 blur-2xl animate-pulse"></div>
        <div className="relative flex flex-col items-center gap-4 p-8">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-white animate-spin"></div>
          <div className="relative">
            <span className="relative text-gray-200 text-sm">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;