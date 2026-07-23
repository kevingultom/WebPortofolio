import React, { useEffect, memo, useMemo } from "react"
import { FileText, Code, Award, Globe, ArrowUpRight, Sparkles, UserCheck } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useLanguage } from "../context/LanguageContext"

// Memoized Components
const Header = memo(() => {
  const { t } = useLanguage();
  return (
    <div className="text-center lg:mb-10 mb-4 px-[5%]">
      <p className="text-[11px] tracking-[0.25em] uppercase text-gray-500 mb-4" data-aos="fade-up">
        {t.about.eyebrow}
      </p>
      <h2
        className="display-tight text-4xl md:text-6xl font-semibold text-white"
        data-aos="fade-up"
        data-aos-duration="600"
      >
        {t.about.heading}
      </h2>
      <p
        className="mt-4 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        {t.about.subtitle}
      </p>
    </div>
  );
});

const ProfileImage = memo(() => (
  <div className="flex justify-end items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2">
    <div
      className="relative group"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      {/* Single static soft glow */}
      <div className="absolute -inset-4 opacity-15 z-0 hidden sm:block">
        <div className="absolute inset-0 bg-white rounded-3xl blur-2xl" />
      </div>

      <div className="relative w-64 sm:w-80 aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 shadow-[0_0_40px_rgba(255,255,255,0.12)] transform transition-all duration-700 group-hover:scale-[1.02] group-hover:border-white/30">
        <img
          src="/profil.png"
          alt="Profile"
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Subtle hover shine */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </div>
  </div>
));

const StatCard = memo(({ icon: Icon, value, label, description, animation }) => (
  <div data-aos={animation} data-aos-duration={1300} className="relative group">
    <div className="relative z-10 bg-white/[0.03] backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-white/20 hover:shadow-2xl h-full flex flex-col justify-between">
      <div className="absolute -z-10 inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>

      <div className="flex items-center justify-between mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 transition-transform group-hover:rotate-6">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <span 
          className="text-4xl font-bold text-white"
          data-aos="fade-up-left"
          data-aos-duration="1500"
          data-aos-anchor-placement="top-bottom"
        >
          {value}
        </span>
      </div>

      <div>
        <p 
          className="text-sm uppercase tracking-wider text-gray-300 mb-2"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-anchor-placement="top-bottom"
        >
          {label}
        </p>
        <div className="flex items-center justify-between">
          <p 
            className="text-xs text-gray-400"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-anchor-placement="top-bottom"
          >
            {description}
          </p>
          <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  </div>
));

const AboutPage = () => {
  const { t } = useLanguage();

  // Memoized calculations
  const { totalProjects, totalCertificates, YearExperience } = useMemo(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const storedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]");
    
    const startDate = new Date("2023-08-17");
    const today = new Date();
    const experience = today.getFullYear() - startDate.getFullYear() -
      (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);

    return {
      totalProjects: storedProjects.length,
      totalCertificates: storedCertificates.length,
      YearExperience: experience
    };
  }, []);

  // Optimized AOS initialization
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
      });
    };

    initAOS();
    
    // Debounced resize handler
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initAOS, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Memoized stats data
  const statsData = useMemo(() => [
    {
      id: "projects",
      icon: Code,
      value: totalProjects,
      label: t.about.stats.totalProjects,
      description: t.about.stats.totalProjectsDesc,
      animation: "fade-right",
    },
    {
      id: "certificates",
      icon: Award,
      value: totalCertificates,
      label: t.about.stats.certificates,
      description: t.about.stats.certificatesDesc,
      animation: "fade-up",
    },
    {
      id: "experience",
      icon: Globe,
      value: YearExperience,
      label: t.about.stats.experience,
      description: t.about.stats.experienceDesc,
      animation: "fade-left",
    },
  ], [totalProjects, totalCertificates, YearExperience, t]);

  return (
    <div
      className="h-auto pb-[10%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm-mt-0" 
      id="About"
    >
      <Header />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {t.about.helloImA}
              </span>
              <span
                className="block mt-2 text-gray-200"
                data-aos="fade-right"
                data-aos-duration="1300"
              >
              Kevin Gultom
              </span>
            </h2>

            <p
              className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed text-justify pb-4 sm:pb-0"
              data-aos="fade-right"
              data-aos-duration="1500"
            >
            {t.about.bio}</p>

               {/* Quote Section */}
      <div
        className="relative bg-white/5 border border-white/10 rounded-2xl p-4 my-6 backdrop-blur-md shadow-2xl overflow-hidden"
        data-aos="fade-up"
        data-aos-duration="1700"
      >
        {/* Floating orbs background */}
        <div className="absolute top-2 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -left-2 w-12 h-12 bg-white/10 rounded-full blur-lg"></div>

        {/* Quote icon */}
        <div className="absolute top-3 left-4 text-white opacity-30">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
          </svg>
        </div>
        
        <blockquote className="text-gray-300 text-center lg:text-left italic font-medium text-sm relative z-10 pl-6">
          "{t.about.quote}"
        </blockquote>
      </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-4 lg:px-0 w-full">
              <a href="https://drive.google.com/file/d/119YYWMO46MB05z9GgvMf49h4S7IRnwlH/view?usp=sharing" className="w-full lg:w-auto">
              <button
                data-aos="fade-up"
                data-aos-duration="800"
                className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg bg-white text-black font-medium transition-all duration-300 hover:scale-105 hover:bg-gray-200 flex items-center justify-center lg:justify-start gap-2 shadow-lg hover:shadow-xl "
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> {t.about.downloadCV}
              </button>
              </a>
              <a href="#Portofolio" className="w-full lg:w-auto">
              <button
                data-aos="fade-up"
                data-aos-duration="1000"
                className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg border border-white/40 text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 hover:bg-white/10 "
              >
                <Code className="w-4 h-4 sm:w-5 sm:h-5" /> {t.about.viewProjects}
              </button>
              </a>
            </div>
          </div>

          <ProfileImage />
        </div>

        <a href="#Portofolio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 cursor-pointer">
            {statsData.map((stat) => (
              <StatCard key={stat.id} {...stat} />
            ))}
          </div>
        </a>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slower {
          to { transform: rotate(360deg); }
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        .animate-spin-slower {
          animation: spin-slower 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(AboutPage);