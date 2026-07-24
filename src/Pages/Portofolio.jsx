import React, { useEffect, useState, useCallback } from "react";

import { supabase } from "../supabase"; 

import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";


const ToggleButton = ({ onClick, isShowingMore }) => {
  const { t } = useLanguage();
  return (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-gray-300
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-white/5 
      hover:bg-white/10
      rounded-md
      border 
      border-white/10
      hover:border-white/20
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? t.portfolio.seeLess : t.portfolio.seeMore}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 transition-all duration-300 group-hover:w-full"></span>
  </button>
  );
};


function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

// Lightweight pulsing placeholders shown while Supabase data is loading, so
// the grid doesn't look broken/empty on a slow connection.
const SkeletonProjectCard = () => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden animate-pulse" aria-hidden="true">
    <div className="aspect-[16/10] bg-white/5" />
    <div className="p-5 sm:p-6 space-y-3">
      <div className="h-5 w-2/3 rounded bg-white/10" />
      <div className="h-3.5 w-full rounded bg-white/5" />
      <div className="h-3.5 w-4/5 rounded bg-white/5" />
      <div className="pt-4 mt-2 border-t border-white/[0.06] flex justify-between">
        <div className="h-4 w-20 rounded bg-white/5" />
        <div className="h-4 w-16 rounded bg-white/5" />
      </div>
    </div>
  </div>
);

const SkeletonCertificateCard = () => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden animate-pulse" aria-hidden="true">
    <div className="aspect-[4/3] bg-white/5" />
  </div>
);

// techStacks tetap sama
const techStacks = [
  { icon: "python.svg", language: "Python" },
  { icon: "java.svg", language: "Java" },
  { icon: "csharp.svg", language: "C#" },
  { icon: "cpp.svg", language: "C++" },
  { icon: "php.svg", language: "PHP" },
  { icon: "mysql.svg", language: "MySQL" },
  { icon: "mongodb.svg", language: "MongoDB" },
  { icon: "c.svg", language: "C" },
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "figma.svg", language: "Figma" },
  { icon: "github.svg", language: "GitHub", mono: true },
  { icon: "laravel.svg", language: "Laravel" },
  { icon: "git.svg", language: "Git" },
  { icon: "postgresql.svg", language: "PostgreSQL" },
  { icon: "supabase.svg", language: "Supabase" },
  { icon: "golang.svg", language: "Golang" },
  { icon: "dart.svg", language: "Dart" },
  { icon: "flutter.svg", language: "Flutter" },
  { icon: "firebase.svg", language: "Firebase" },
];

export default function FullWidthTabs() {
  const { t } = useLanguage();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    AOS.init({
      once: true,
    });
  }, []);


  const fetchData = useCallback(async () => {
    try {
      // Mengambil data dari Supabase secara paralel
      const [projectsResponse, certificatesResponse] = await Promise.all([
        supabase.from("projects").select("*").order('sort_order', { ascending: true, nullsFirst: false }).order('id', { ascending: true }),
        supabase.from("certificates").select("*").order('id', { ascending: true }), 
      ]);

      // Error handling untuk setiap request
      if (projectsResponse.error) throw projectsResponse.error;
      if (certificatesResponse.error) throw certificatesResponse.error;

      // Supabase mengembalikan data dalam properti 'data'
      const projectData = (projectsResponse.data || []).map(p => ({
        id: p.id,
        Title: p.title,
        Description: p.description,
        Img: p.img,
        DetailImg: p.detail_img,
        Link: p.link,
        ApkLink: p.apk_link,
        Github: p.github,
        TechStack: p.tech_stack || [],
        Features: p.features || [],
      }));

      console.log("PROJECTS FROM SUPABASE:", projectData);

      const certificateData = (certificatesResponse.data || []).map(c => ({
        id: c.id,
        Img: c.img,
        Link: c.link,
      }));

      console.log("CERTIFICATES FROM SUPABASE:", certificateData);

      setProjects(projectData);
      setCertificates(certificateData);

      // Store in localStorage (fungsionalitas ini tetap dipertahankan)
      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("certificates", JSON.stringify(certificateData));
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
    }
  }, []);



  useEffect(() => {
    // Coba ambil dari localStorage dulu untuk laod lebih cepat
    const cachedProjects = localStorage.getItem('projects');
    const cachedCertificates = localStorage.getItem('certificates');

    if (cachedProjects && cachedCertificates) {
        setProjects(JSON.parse(cachedProjects));
        setCertificates(JSON.parse(cachedCertificates));
        setIsLoading(false); // already have something to show; fetch still syncs in the background
    }

    fetchData().finally(() => setIsLoading(false)); // Tetap panggil fetchData untuk sinkronisasi data terbaru
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === 'projects') {
      setShowAllProjects(prev => !prev);
    } else {
      setShowAllCertificates(prev => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

  // Sisa dari komponen (return statement) tidak ada perubahan
  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-black overflow-hidden" id="Portofolio">
      {/* Header section - unchanged */}
      <div className="text-center pb-12" data-aos="fade-up" data-aos-duration="700">
        <p className="text-[11px] tracking-[0.25em] uppercase text-gray-500 mb-4">
          {t.portfolio.eyebrow}
        </p>
        <h2 className="display-tight text-4xl md:text-6xl font-semibold text-white">
          {t.portfolio.heading}
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg mt-4">
          {t.portfolio.subtitle}
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section - unchanged */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          {/* Tabs remain unchanged */}
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#9ca3af",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "rgba(255, 255, 255, 0.12)",
                  boxShadow: "0 4px 15px -3px rgba(255, 255, 255, 0.1)",
                  "& .lucide": {
                    color: "#ffffff",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
                backgroundColor: "transparent",
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              label={t.portfolio.tabs.projects}
              {...a11yProps(0)}
            />
            <Tab
              icon={<Award className="mb-2 w-5 h-5 transition-all duration-300" />}
              label={t.portfolio.tabs.certificates}
              {...a11yProps(1)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label={t.portfolio.tabs.techStack}
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {isLoading && displayedProjects.length === 0 &&
                  Array.from({ length: initialItems }).map((_, i) => <SkeletonProjectCard key={`skeleton-${i}`} />)}
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <CardProject
                      Img={project.Img}
                      Title={project.Title}
                      Description={project.Description}
                      Link={project.Link}
                      ApkLink={project.ApkLink}
                      id={project.id}
                    />
                  </div>
                ))}
              </div>
              {!isLoading && projects.length === 0 && (
                <p className="text-gray-500 text-sm py-10">{t.portfolio.noProjects}</p>
              )}
            </div>
            {projects.length > initialItems && (
              <div className="mt-8 w-full flex justify-center">
                <ToggleButton
                  onClick={() => toggleShowMore('projects')}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
                {isLoading && displayedCertificates.length === 0 &&
                  Array.from({ length: initialItems }).map((_, i) => <SkeletonCertificateCard key={`skeleton-${i}`} />)}
                {displayedCertificates.map((certificate, index) => (
                  <div
                    key={certificate.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <Certificate 
                              ImgSertif={certificate.Img}
                              Link={certificate.Link} />
                  </div>
                ))}
              </div>
              {!isLoading && certificates.length === 0 && (
                <p className="text-gray-500 text-sm py-10">{t.portfolio.noCertificates}</p>
              )}
            </div>
            {certificates.length > initialItems && (
              <div className="mt-8 w-full flex justify-center">
                <ToggleButton
                  onClick={() => toggleShowMore('certificates')}
                  isShowingMore={showAllCertificates}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} mono={stack.mono} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}