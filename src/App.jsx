import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, Suspense, lazy } from 'react';
import "./index.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import ContactPage from "./Pages/Contact";
import WelcomeScreen from "./Pages/WelcomeScreen";
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import { Analytics } from "@vercel/analytics/react";

// Route-level code splitting: the project detail page and 404 page aren't
// needed for the initial landing-page visit, so defer them to their own
// chunks instead of bundling them into the main entry.
const ProjectDetails = lazy(() => import("./components/ProjectDetail"));
const NotFoundPage = lazy(() => import("./Pages/404"));

const RouteFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  const { t } = useLanguage();
  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          <Navbar />
          <AnimatedBackground />
          <Home />
          <About />
          <Portofolio />
          <ContactPage />
          <footer className="border-t border-white/[0.06] mt-10">
            <div className="mx-auto max-w-[1400px] px-[6%] lg:px-[8%] py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-lg font-semibold text-white tracking-tight">KEVin.</span>
              <span className="text-sm text-gray-500">
                © 2025 Kevin Gultom. {t.footer.rights}
              </span>
            </div>
          </footer>
        </>
      )}
    </>
  );
};

const ProjectPageLayout = () => (
  <>
    <ProjectDetails />
    <footer className="border-t border-white/[0.06] mt-10">
      <div className="mx-auto max-w-[1400px] px-[6%] lg:px-[8%] py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-lg font-semibold text-white tracking-tight">KEVin.</span>
        <span className="text-sm text-gray-500">© 2025 Kevin Gultom. All rights reserved.</span>
      </div>
    </footer>
  </>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />} />
              <Route path="/project/:id" element={<ProjectPageLayout />} />
               <Route path="*" element={<NotFoundPage />} /> {/* Ini route 404 */}
            </Routes>
          </Suspense>
          <ThemeToggle />
        </BrowserRouter>
        <Analytics />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;