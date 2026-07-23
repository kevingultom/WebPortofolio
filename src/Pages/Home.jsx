import React, { useState, useEffect, useCallback, memo } from "react"
import { Github, Linkedin, Mail, ArrowRight, Instagram } from "lucide-react"
import { WhatsApp } from "@mui/icons-material"
import { useLanguage } from "../context/LanguageContext"

// Brand colors, revealed only on hover — keeps the UI monochrome at rest.
const BRAND_COLORS = {
  WhatsApp: "#25D366",
  GitHub: "#f5f5f5",
  LinkedIn: "#0A66C2",
  Instagram: "#E1306C",
};

// ---- Static content ----------------------------------------------------
const TYPING_SPEED = 90;
const ERASING_SPEED = 45;
const PAUSE_DURATION = 2200;

const TECH_LOGOS = [
  { src: "/reactjs.svg", name: "React" },
  { src: "/nodejs.svg", name: "Node.js" },
  { src: "/tailwind.svg", name: "Tailwind" },
  { src: "/laravel.svg", name: "Laravel" },
  { src: "/python.svg", name: "Python" },
  { src: "/postgresql.svg", name: "PostgreSQL" },
  { src: "/supabase.svg", name: "Supabase" },
  { src: "/github.svg", name: "GitHub", plain: true },
];

const SOCIAL_LINKS = [
  { icon: WhatsApp, link: "https://wa.me/6289646964051", name: "WhatsApp" },
  { icon: Github, link: "https://github.com/kevingultom", name: "GitHub" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/kevin-gultom31/", name: "LinkedIn" },
  { icon: Instagram, link: "https://www.instagram.com/kevgtm", name: "Instagram" },
];

// ---- Small components ---------------------------------------------------
const SocialLink = memo(({ icon: Icon, link, name }) => {
  const [hover, setHover] = useState(false);
  const brand = BRAND_COLORS[name];
  return (
    <a href={link} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center justify-center w-10 h-10 rounded-full border transition-colors duration-300"
      style={{
        borderColor: hover ? `${brand}66` : "rgba(255,255,255,0.1)",
        backgroundColor: hover ? `${brand}1A` : "rgba(255,255,255,0.02)",
      }}>
      <Icon className="w-[18px] h-[18px] transition-colors duration-300" style={{ color: hover ? brand : "#9ca3af" }} />
    </a>
  );
});

const Home = () => {
  const { t, lang } = useLanguage();
  const ROLES = t.home.roles;
  const CAPABILITIES = t.home.capabilities;

  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Restart the typing effect cleanly whenever the language changes.
  useEffect(() => {
    setText("");
    setCharIndex(0);
    setWordIndex(0);
    setIsTyping(true);
  }, [lang]);

  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < ROLES[wordIndex].length) {
        setText((prev) => prev + ROLES[wordIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else {
        setWordIndex((prev) => (prev + 1) % ROLES.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex, ROLES]);

  useEffect(() => {
    const timeout = setTimeout(handleTyping, isTyping ? TYPING_SPEED : ERASING_SPEED);
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  return (
    <section id="Home" className="relative min-h-screen bg-black overflow-hidden flex flex-col">
      <div className="flex-1 w-full mx-auto max-w-[1400px] px-[6%] lg:px-[8%] flex flex-col justify-center pt-28 pb-14">
        {/* Eyebrow */}
        <div className="flex items-center gap-2.5 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="text-xs sm:text-sm tracking-[0.2em] uppercase text-gray-400 font-medium">
            {t.home.available}
          </span>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-8 items-start">
          {/* Left: headline */}
          <div>
            <h1 className="display-tight text-white font-semibold text-[3.4rem] sm:text-[5rem] lg:text-[6.2rem]">
              Kevin
              <br />
              Gultom
            </h1>

            <div className="mt-6 h-8 flex items-center text-xl sm:text-2xl text-gray-300 font-light">
              <span>{text}</span>
              <span className="w-[2px] h-6 bg-white ml-1.5 animate-blink"></span>
            </div>

            <p className="mt-6 max-w-xl text-base sm:text-lg text-gray-400 leading-relaxed">
              {t.home.tagline}
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#Portofolio"
                className="group inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors">
                {t.home.viewProjects}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href="#Contact"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-white/15 bg-white/[0.02] text-white text-sm font-medium hover:bg-white/10 hover:border-white/30 transition-all">
                <Mail className="w-4 h-4" />
                {t.home.getInTouch}
              </a>
            </div>

            {/* Socials */}
            <div className="mt-8 flex items-center gap-3">
              {SOCIAL_LINKS.map((s, i) => (
                <SocialLink key={i} {...s} />
              ))}
            </div>
          </div>

          {/* Right: photo, aligned with the name, + capability list below */}
          <div className="flex flex-col items-start lg:items-end gap-10 lg:pb-4">
            <div className="self-start ml-6 sm:ml-10 lg:ml-10 w-44 h-44 sm:w-64 sm:h-64 lg:w-72 lg:h-72 shrink-0">
              <img
                src="/kg.png"
                alt="Kevin Gultom"
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="border-l border-white/10 pl-6 space-y-5 w-full">
              {CAPABILITIES.map((c, i) => (
                <div key={i} className="group">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-mono text-gray-600">0{i + 1}</span>
                    <span className="text-lg sm:text-xl text-gray-300 group-hover:text-white transition-colors">
                      {c}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tech logo strip */}
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1400px] px-[6%] lg:px-[8%] py-7">
          <p className="text-[11px] tracking-[0.25em] uppercase text-gray-600 mb-5">
            {t.home.toolsTitle}
          </p>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
            {TECH_LOGOS.map((t) => (
              <img
                key={t.name}
                src={t.src}
                alt={t.name}
                title={t.name}
                className={`${t.plain ? "logo-mono-plain" : "logo-mono"} h-6 sm:h-7 w-auto`}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Home);
