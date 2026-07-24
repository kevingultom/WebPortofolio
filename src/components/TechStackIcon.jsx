import React from 'react';

const TechStackIcon = ({ TechStackIcon, Language, mono = false }) => {
  return (
    <div className="group flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04] transition-all duration-300">
      <img
        src={TechStackIcon}
        alt={`${Language} icon`}
        loading="lazy"
        className={`h-14 w-14 md:h-16 md:w-16 transition-all duration-300 ${
          mono
            ? "tech-icon-mono brightness-0 invert opacity-70 group-hover:opacity-100"
            : "tech-icon-color grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"
        }`}
      />
      <span className="text-sm md:text-base font-medium text-gray-400 group-hover:text-white transition-colors duration-300">
        {Language}
      </span>
    </div>
  );
};

export default TechStackIcon;
