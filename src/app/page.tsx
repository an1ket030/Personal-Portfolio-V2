"use client";

import { useState } from "react";
import BootSequence from "@/components/BootSequence";
import HeroSection from "@/components/HeroSection";
import ProjectShowcase from "@/components/ProjectShowcase";
import SkillsShowcase from "@/components/SkillsShowcase";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import FloatingNav from "@/components/FloatingNav";
import CRTOverlay from "@/components/CRTOverlay";
import EasterEggs from "@/components/EasterEggs";
import SoundManager from "@/components/SoundManager";

export default function Home() {
    const [bootComplete, setBootComplete] = useState(false);

    return (
        <>
            {!bootComplete && (
                <BootSequence onComplete={() => setBootComplete(true)} />
            )}

            {bootComplete && (
                <>
                    <FloatingNav />
                    <CRTOverlay />
                    <EasterEggs />
                    <SoundManager />
                </>
            )}

            <main
                style={{
                    opacity: bootComplete ? 1 : 0,
                    transition: "opacity 0.5s ease-out",
                    pointerEvents: bootComplete ? "auto" : "none",
                }}
            >
                <HeroSection />
                <ProjectShowcase />
                <SkillsShowcase />
                <AboutSection />
                <ContactSection />
            </main>
        </>
    );
}
