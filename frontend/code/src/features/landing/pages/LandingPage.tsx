import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import Hero from "../components/Hero";
import FeaturesSection from "../components/FeaturesSection";
import FooterCTA from "../components/FooterCTA";
import StaticBackground from "../../../components/layout/StaticBackground";

import PreviewSection from "../components/PreviewSection";
import BenefitsSection from "../components/BenefitsSection";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page-view min-h-screen bg-[#0c0a08]">
      <StaticBackground />
      <Navbar
        onSignInSelect={() => navigate("/login")}
        onCreateAccountSelect={() => navigate("/register")}
      />

      <main>
        <Hero onCreateClick={() => navigate("/register")} />

        <FeaturesSection />

        <PreviewSection />

        <BenefitsSection />

        <FooterCTA />
      </main>

      <footer className="py-12 border-t border-white/10 text-center text-white/50 text-sm relative z-10 bg-gradient-to-t from-black/80 to-transparent">
        <p className="drop-shadow-md">
          &copy; {new Date().getFullYear()} RP Hub. Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
