import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const LanguageToggle = () => {
    const { lang, toggleLanguage } = useLanguage();
    return (
        <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="flex items-center rounded-full border border-white/15 bg-white/5 p-0.5 text-xs font-semibold"
        >
            <span
                className={`px-2.5 py-1 rounded-full transition-colors duration-200 ${
                    lang === "en" ? "bg-white text-black" : "text-gray-400"
                }`}
            >
                EN
            </span>
            <span
                className={`px-2.5 py-1 rounded-full transition-colors duration-200 ${
                    lang === "id" ? "bg-white text-black" : "text-gray-400"
                }`}
            >
                ID
            </span>
        </button>
    );
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const { t } = useLanguage();

    const navItems = [
        { href: "#Home", key: "home", label: t.nav.home },
        { href: "#About", key: "about", label: t.nav.about },
        { href: "#Portofolio", key: "portfolio", label: t.nav.portfolio },
        { href: "#Contact", key: "contact", label: t.nav.contact },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            const sections = navItems.map(item => {
                const section = document.querySelector(item.href);
                if (section) {
                    return {
                        id: item.href.replace("#", ""),
                        offset: section.offsetTop - 550,
                        height: section.offsetHeight
                    };
                }
                return null;
            }).filter(Boolean);

            const currentPosition = window.scrollY;
            const active = sections.find(section =>
                currentPosition >= section.offset &&
                currentPosition < section.offset + section.height
            );

            if (active) {
                setActiveSection(active.id);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const scrollToSection = (e, href) => {
        e.preventDefault();
        const section = document.querySelector(href);
        if (section) {
            const top = section.offsetTop - 100;
            window.scrollTo({
                top: top,
                behavior: "smooth"
            });
        }
        setIsOpen(false);
    };

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-500 ${
                isOpen
                    ? "bg-black"
                    : scrolled
                    ? "bg-black/70 backdrop-blur-md border-b border-white/5"
                    : "bg-transparent"
            }`}
        >
            <div className="mx-auto px-[5%] sm:px-[5%] lg:px-[10%]">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <img
                            src="/logo-circle.png"
                            alt="Logo"
                            className="w-8 h-8 object-contain"
                        />
                        <a
                            href="#Home"
                            onClick={(e) => scrollToSection(e, "#Home")}
                            className="text-xl font-bold text-white"
                        >
                            KEVin.
                        </a>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <div className="flex items-center space-x-8">
                                {navItems.map((item) => (
                                    <a
                                        key={item.key}
                                        href={item.href}
                                        onClick={(e) => scrollToSection(e, item.href)}
                                        className="group relative px-1 py-2 text-sm font-medium"
                                    >
                                        <span
                                            className={`relative z-10 transition-colors duration-300 ${
                                                activeSection === item.href.substring(1)
                                                    ? "text-white font-semibold"
                                                    : "text-gray-400 group-hover:text-white"
                                            }`}
                                        >
                                            {item.label}
                                        </span>
                                        <span
                                            className={`absolute bottom-0 left-0 w-full h-0.5 bg-white transform origin-left transition-transform duration-300 ${
                                                activeSection === item.href.substring(1)
                                                    ? "scale-x-100"
                                                    : "scale-x-0 group-hover:scale-x-100"
                                            }`}
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Language toggle */}
                        <LanguageToggle />

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className={`relative p-2 text-gray-300 hover:text-white transition-transform duration-300 ease-in-out transform ${
                                    isOpen ? "rotate-90 scale-125" : "rotate-0 scale-100"
                                }`}
                            >
                                {isOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${
                    isOpen
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
                <div className="px-4 py-6 space-y-4">
                    {navItems.map((item, index) => (
                        <a
                            key={item.key}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className={`block px-4 py-3 text-lg font-medium transition-all duration-300 ease ${
                                activeSection === item.href.substring(1)
                                    ? "text-white font-semibold"
                                    : "text-gray-400 hover:text-white"
                            }`}
                            style={{
                                transitionDelay: `${index * 100}ms`,
                                transform: isOpen ? "translateX(0)" : "translateX(50px)",
                                opacity: isOpen ? 1 : 0,
                            }}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
