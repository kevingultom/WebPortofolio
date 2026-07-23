import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowUpRight, Download } from 'lucide-react';

const getHostname = (url) => {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
};

const CardProject = ({ Img, Title, Description, Link: ProjectLink, ApkLink, id }) => {
  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      e.preventDefault();
      alert("Live demo link is not available");
    }
  };

  // APK downloads (Android apps) show a "Download APK" action; the browser bar
  // shows the APK host instead of a live-site host.
  const hostname = getHostname(ApkLink || ProjectLink);

  return (
    <div className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-white/25 hover:bg-white/[0.04]">
      {/* Browser-mockup image frame — sized to the image's own aspect ratio, nothing cropped or letterboxed */}
      <div className="relative flex flex-col bg-[#0a0a0a] border-b border-white/[0.06] overflow-hidden">
        {/* Chrome bar */}
        <div className="flex items-center gap-3 px-3 py-2 bg-[#111111] border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          </div>
          <div className="flex-1 h-5 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center px-2.5 min-w-0">
            <span className="text-[10px] text-gray-500 truncate">
              {hostname || 'preview'}
            </span>
          </div>
        </div>

        {/* Screenshot */}
        {Img ? (
          <div className="relative">
            <img
              src={Img}
              alt={Title}
              loading="lazy"
              className="block w-full h-auto opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ) : (
          <div className="aspect-[16/10] flex items-center justify-center text-gray-600 text-sm">No preview</div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-white">
            {Title}
          </h3>
          {id && (
            <Link
              to={`/project/${id}`}
              className="shrink-0 mt-0.5 text-gray-500 group-hover:text-white transition-colors"
              aria-label="View details"
            >
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          )}
        </div>

        <p className="mt-2.5 text-sm text-gray-400 leading-relaxed line-clamp-2">
          {Description}
        </p>

        <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
          {ApkLink ? (
            <a
              href={ApkLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <span className="font-medium">Download APK</span>
              <Download className="w-3.5 h-3.5" />
            </a>
          ) : ProjectLink ? (
            <a
              href={ProjectLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLiveDemo}
              className="inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <span className="font-medium">Live Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-sm text-gray-600">Demo unavailable</span>
          )}

          {id ? (
            <Link
              to={`/project/${id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Details
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="text-sm text-gray-600">—</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardProject;
