import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ThankYouPage = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          Thank You!
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Your message has been received. I'll get back to you as soon as possible.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-3 bg-white text-black rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:bg-gray-200 hover:shadow-lg hover:shadow-white/10 active:scale-[0.98]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;