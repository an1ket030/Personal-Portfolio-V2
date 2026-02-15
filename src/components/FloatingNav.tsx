"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import styles from "./FloatingNav.module.css";
import PixelIcon from "./PixelIcon";

const sections = [
    { id: "hero", label: "HOME", icon: "home", world: "1" },
    { id: "projects", label: "PROJECTS", icon: "folder", world: "2" },
    { id: "skills", label: "SKILLS", icon: "sword", world: "3" },
    { id: "about", label: "ABOUT", icon: "user", world: "4" },
    { id: "contact", label: "CONTACT", icon: "send", world: "5" },
];

export default function FloatingNav() {
    const [activeSection, setActiveSection] = useState("hero");
    const [scrollProgress, setScrollProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
            setScrollProgress(Math.min(progress, 100));

            // Show nav after scrolling past hero
            setVisible(scrollY > 300);

            // Determine active section
            const sectionEls = sections.map((s) => document.getElementById(s.id));
            let current = "hero";
            for (let i = sectionEls.length - 1; i >= 0; i--) {
                const el = sectionEls[i];
                if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
                    current = sections[i].id;
                    break;
                }
            }
            setActiveSection(current);
            lastScrollY.current = scrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = useCallback((id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    const currentWorld = sections.find((s) => s.id === activeSection);

    return (
        <>
            {/* Scroll Progress Bar */}
            <div
                className={styles.progressBar}
                style={{ width: `${scrollProgress}%` }}
                aria-hidden="true"
            />

            {/* Floating Navigation */}
            <nav
                className={`${styles.nav} ${visible ? styles.navVisible : ""}`}
                aria-label="Section navigation"
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
            >
                {/* World Indicator */}
                <div className={styles.worldBadge}>
                    <span className={styles.worldLabel}>W{currentWorld?.world}</span>
                </div>

                {/* Section Dots */}
                <div className={styles.dots}>
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            className={`${styles.dot} ${activeSection === section.id ? styles.dotActive : ""}`}
                            onClick={() => scrollTo(section.id)}
                            aria-label={`Navigate to ${section.label}`}
                            title={section.label}
                        >
                            <span className={styles.dotIcon}>
                                <PixelIcon
                                    name={section.icon}
                                    size={12}
                                    color={activeSection === section.id ? "var(--gb-lightest)" : "var(--gb-dark)"}
                                />
                            </span>
                            {expanded && (
                                <span className={styles.dotLabel}>{section.label}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Scroll to Top */}
                <button
                    className={styles.topBtn}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    aria-label="Scroll to top"
                >
                    ↑
                </button>
            </nav>
        </>
    );
}
