"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import styles from "./ProjectShowcase.module.css";
import PixelIcon from "./PixelIcon";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Project {
    id: number;
    world: string;
    title: string;
    tagline: string;
    description: string;
    tech: string[];
    difficulty: number;
    duration: string;
    demoUrl: string;
    codeUrl: string;
    comingSoon?: boolean;
    screenTheme: "medical" | "hospital" | "news" | "cards" | "game" | "blog";
}

const projects: Project[] = [
    {
        id: 1,
        world: "2-1",
        title: "Medify",
        tagline: "AI-Powered Medicine Authenticator",
        description:
            "Built an AI-powered counterfeit medicine detection app using React Native, FastAPI, and PyTorch (EfficientNet-B3) with 92%+ accuracy, supporting 1000+ scans; implemented secure PostgreSQL APIs, JWT auth, Docker deployment, and EAS mobile builds.",
        tech: ["React Native", "FastAPI", "OCR", "PostgreSQL", "Docker"],
        difficulty: 5,
        duration: "Oct 2025",
        demoUrl: "#",
        codeUrl: "https://github.com/an1ket030/auth-checker.git",
        screenTheme: "medical",
    },
    {
        id: 2,
        world: "2-2",
        title: "CareConnect",
        tagline: "Hospital Management System",
        description:
            "Role-based HMS supporting Admin, Doctor, and Patient workflows with Flask-Login and CSRF protection. Implemented appointment scheduling with automated SQLite database generation and treatment-record modules, improving record accuracy by 30%.",
        tech: ["Flask", "SQLite", "Jinja2", "Bootstrap"],
        difficulty: 4,
        duration: "Nov 2025",
        demoUrl: "#",
        codeUrl: "https://github.com/an1ket030/CareConnect-HMS.git",
        screenTheme: "hospital",
    },
    {
        id: 3,
        world: "2-3",
        title: "PopScope Express",
        tagline: "Trends Dashboard",
        description:
            "Real-time pop culture news aggregator pulling from 5 APIs with 300+ daily updates. Built responsive UI optimized for mobile and desktop, reduced fetch latency by 35% using API caching and throttling.",
        tech: ["React", "Node.js", "Express", "REST APIs"],
        difficulty: 4,
        duration: "Jun 2025",
        demoUrl: "https://popscopeexpress.web.app",
        codeUrl: "https://github.com/an1ket030/popscopeexpress.git",
        screenTheme: "news",
    },
    {
        id: 4,
        world: "2-4",
        title: "HappiCards",
        tagline: "Personalized Card Creator",
        description:
            "Card generation app supporting 500+ greetings in 4 categories with custom animations and emoji insertion. Integrated Firebase Firestore and Auth for template persistence. Crafted an intuitive drag-and-drop UI with reusable component library.",
        tech: ["React", "Firebase", "Tailwind", "DnD"],
        difficulty: 3,
        duration: "Apr 2025",
        demoUrl: "#",
        codeUrl: "https://github.com/an1ket030/HappiCards.git",
        screenTheme: "cards",
    },
    {
        id: 5,
        world: "2-5",
        title: "PixelForge",
        tagline: "Game Engine Toolkit",
        description:
            "A lightweight 2D game development toolkit built with Unity and C#. Features a tile-based level editor, sprite animation system, and physics engine. Designed to help indie developers prototype games rapidly with a visual scripting interface.",
        tech: ["Unity", "C#", "Godot", "Blender"],
        difficulty: 4,
        duration: "Coming Soon",
        demoUrl: "#",
        codeUrl: "#",
        comingSoon: true,
        screenTheme: "game",
    },
    {
        id: 6,
        world: "2-6",
        title: "DevLog",
        tagline: "Developer Blog Platform",
        description:
            "A markdown-powered developer blog platform with syntax highlighting, dark mode, SEO optimization, and an integrated analytics dashboard. Features a custom CMS with real-time preview and tagging system for categorized posts.",
        tech: ["Next.js", "Supabase", "MDX", "Tailwind"],
        difficulty: 3,
        duration: "Coming Soon",
        demoUrl: "#",
        codeUrl: "#",
        comingSoon: true,
        screenTheme: "blog",
    },
];

// ── Pixel-art screen renderer ──
function PixelScreen({ theme, index }: { theme: Project["screenTheme"]; index: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio, 2);
        const w = 160;
        const h = 144;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        ctx.scale(dpr, dpr);

        const C1 = "#0f380f";
        const C2 = "#306230";
        const C3 = "#8bac0f";
        const C4 = "#9bbc0f";

        let frame = 0;

        const drawPixel = (x: number, y: number, s: number, color: string) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, s, s);
        };

        const scenes: Record<Project["screenTheme"], () => void> = {
            medical: () => {
                ctx.fillStyle = C4;
                ctx.fillRect(0, 0, w, h);
                // Pill capsule
                const pY = 50 + Math.sin(frame * 0.04) * 8;
                ctx.fillStyle = C1;
                ctx.fillRect(60, pY, 40, 20);
                ctx.fillStyle = C2;
                ctx.fillRect(60, pY, 20, 20);
                ctx.beginPath();
                ctx.arc(60, pY + 10, 10, 0, Math.PI * 2);
                ctx.fillStyle = C2;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(100, pY + 10, 10, 0, Math.PI * 2);
                ctx.fillStyle = C1;
                ctx.fill();
                // Scanning line
                const scanY = (frame * 2) % h;
                ctx.fillStyle = C3;
                ctx.globalAlpha = 0.3;
                ctx.fillRect(0, scanY, w, 2);
                ctx.globalAlpha = 1;
                // Check mark
                if (frame > 40) {
                    ctx.fillStyle = C1;
                    ctx.font = "bold 10px monospace";
                    ctx.textAlign = "center";
                    ctx.fillText("✓ VERIFIED", w / 2, 100);
                }
                // Title
                ctx.fillStyle = C1;
                ctx.font = "bold 8px monospace";
                ctx.textAlign = "center";
                ctx.fillText("AUTH CHECKER", w / 2, 18);
                // OCR animation dots
                for (let i = 0; i < 3; i++) {
                    const dotAlpha = Math.sin(frame * 0.08 + i * 0.5) > 0 ? 1 : 0.2;
                    ctx.globalAlpha = dotAlpha;
                    drawPixel(70 + i * 10, 120, 4, C1);
                }
                ctx.globalAlpha = 1;
            },

            hospital: () => {
                ctx.fillStyle = C4;
                ctx.fillRect(0, 0, w, h);
                // Cross symbol
                ctx.fillStyle = C1;
                ctx.fillRect(w / 2 - 4, 20, 8, 24);
                ctx.fillRect(w / 2 - 12, 28, 24, 8);
                // Heartbeat line
                ctx.strokeStyle = C1;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(10, 70);
                for (let x = 10; x < w - 10; x += 2) {
                    const progress = (x + frame * 2) % w;
                    let y = 70;
                    if (progress > 60 && progress < 70) y = 70 - 15;
                    else if (progress > 70 && progress < 75) y = 70 + 10;
                    else if (progress > 75 && progress < 80) y = 70 - 8;
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
                // Stats
                ctx.fillStyle = C2;
                ctx.font = "7px monospace";
                ctx.textAlign = "left";
                ctx.fillText("PATIENTS: 142", 10, 100);
                ctx.fillText("APPTS: 38", 10, 112);
                ctx.fillText("STATUS: ONLINE", 10, 124);
                ctx.fillStyle = C1;
                ctx.font = "8px monospace";
                ctx.textAlign = "center";
                ctx.fillText("CARE CONNECT", w / 2, 140);
            },

            news: () => {
                ctx.fillStyle = C4;
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = C1;
                ctx.font = "bold 8px monospace";
                ctx.textAlign = "center";
                ctx.fillText("POPSCOPE EXPRESS", w / 2, 16);
                // Scrolling headlines
                const scrollOffset = (frame * 0.7) % 90;
                ctx.fillStyle = C2;
                ctx.font = "6px monospace";
                ctx.textAlign = "left";
                const headlines = [
                    "TRENDING: New tech release...",
                    "VIRAL: Internet sensation...",
                    "UPDATE: Gaming milestone...",
                    "HOT: Movie breaks records...",
                    "NEW: Music album drops...",
                ];
                headlines.forEach((txt, i) => {
                    const y = 30 + i * 18 - scrollOffset;
                    if (y > 20 && y < 130) {
                        ctx.fillStyle = C1;
                        ctx.fillRect(10, y - 2, 140, 14);
                        ctx.fillStyle = C4;
                        ctx.fillText(txt, 14, y + 8);
                    }
                });
                // Activity bar
                for (let i = 0; i < 8; i++) {
                    const barH = 5 + Math.sin(frame * 0.06 + i) * 5 + 5;
                    ctx.fillStyle = C2;
                    ctx.fillRect(16 + i * 16, 134 - barH, 10, barH);
                }
            },

            cards: () => {
                ctx.fillStyle = C4;
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = C1;
                ctx.font = "bold 8px monospace";
                ctx.textAlign = "center";
                ctx.fillText("HAPPI CARDS", w / 2, 16);
                // Animated card stack
                const cards = 3;
                for (let i = cards - 1; i >= 0; i--) {
                    const offset = i * 8;
                    const wobble = i === 0 ? Math.sin(frame * 0.05) * 3 : 0;
                    ctx.fillStyle = i === 0 ? C1 : C2;
                    ctx.fillRect(40 + offset, 28 + offset + wobble, 80, 60);
                    ctx.fillStyle = C4;
                    ctx.fillRect(42 + offset, 30 + offset + wobble, 76, 56);
                    if (i === 0) {
                        ctx.fillStyle = C1;
                        ctx.font = "16px serif";
                        ctx.fillText("♥", 80, 55 + wobble);
                        ctx.font = "6px monospace";
                        ctx.fillText("HAPPY BIRTHDAY!", 80, 75 + wobble);
                    }
                }
                // Emoji rain
                const emojis = ["♥", "★", "♦", "♠"];
                for (let i = 0; i < 6; i++) {
                    const ex = 20 + i * 24;
                    const ey = (frame * 1.5 + i * 30) % (h + 20) - 10;
                    ctx.fillStyle = C2;
                    ctx.font = "8px serif";
                    ctx.fillText(emojis[i % emojis.length], ex, ey + 100);
                }
            },

            game: () => {
                ctx.fillStyle = C4;
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = C1;
                ctx.font = "bold 8px monospace";
                ctx.textAlign = "center";
                ctx.fillText("PIXEL FORGE", w / 2, 16);
                // Tile grid
                const tileSize = 12;
                for (let row = 0; row < 5; row++) {
                    for (let col = 0; col < 10; col++) {
                        const filled = Math.sin((row + col) * 1.5 + frame * 0.02) > 0.3;
                        ctx.fillStyle = filled ? C2 : C3;
                        ctx.fillRect(20 + col * tileSize, 28 + row * tileSize, tileSize - 1, tileSize - 1);
                    }
                }
                // Character on tiles
                const cX = 45 + Math.sin(frame * 0.04) * 30;
                ctx.fillStyle = C1;
                ctx.fillRect(cX, 90, 8, 8); // head
                ctx.fillRect(cX - 2, 98, 12, 10); // body
                ctx.fillRect(cX - 2, 108, 5, 6);  // left leg
                ctx.fillRect(cX + 5, 108, 5, 6);  // right leg
                // "COMING SOON" banner
                ctx.fillStyle = C1;
                ctx.fillRect(20, 122, 120, 14);
                ctx.fillStyle = C4;
                ctx.font = "bold 7px monospace";
                ctx.fillText("COMING SOON", w / 2, 132);
            },

            blog: () => {
                ctx.fillStyle = C4;
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = C1;
                ctx.font = "bold 8px monospace";
                ctx.textAlign = "center";
                ctx.fillText("DEV LOG", w / 2, 16);
                // Text lines typing effect
                const maxChars = Math.floor(frame * 0.5);
                const lines = [
                    "## Hello World",
                    "",
                    "This is my dev blog.",
                    "I write about code,",
                    "design, and life.",
                    "",
                    "const dev = true;",
                ];
                ctx.fillStyle = C1;
                ctx.font = "6px monospace";
                ctx.textAlign = "left";
                let charCount = 0;
                lines.forEach((line, i) => {
                    const y = 30 + i * 12;
                    if (y > 130) return;
                    const visibleChars = Math.max(0, maxChars - charCount);
                    const shown = line.substring(0, visibleChars);
                    if (i === 0) ctx.fillStyle = C2;
                    else if (line.startsWith("const")) ctx.fillStyle = C2;
                    else ctx.fillStyle = C1;
                    ctx.fillText(shown, 12, y);
                    charCount += line.length + 1;
                });
                // Cursor blink
                if (Math.sin(frame * 0.1) > 0) {
                    ctx.fillStyle = C1;
                    ctx.fillRect(12 + Math.min(maxChars, 20) * 4, 118, 4, 8);
                }
                // "COMING SOON" banner
                ctx.fillStyle = C1;
                ctx.fillRect(20, 128, 120, 14);
                ctx.fillStyle = C4;
                ctx.font = "bold 7px monospace";
                ctx.textAlign = "center";
                ctx.fillText("COMING SOON", w / 2, 138);
            },
        };

        const draw = () => {
            frame++;
            ctx.clearRect(0, 0, w, h);
            scenes[theme]();
            animRef.current = requestAnimationFrame(draw);
        };

        // Stagger start to avoid all canvases starting at once
        const timeout = setTimeout(() => {
            animRef.current = requestAnimationFrame(draw);
        }, index * 200);

        return () => {
            clearTimeout(timeout);
            cancelAnimationFrame(animRef.current);
        };
    }, [theme, index]);

    return (
        <canvas
            ref={canvasRef}
            className={styles.screenCanvas}
            aria-hidden="true"
        />
    );
}

// ── 3D tilt hook ──
function useTilt(enabled: boolean = true) {
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!enabled || !ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateX = (y - 0.5) * -6;
            const rotateY = (x - 0.5) * 6;
            ref.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        },
        [enabled]
    );

    const handleMouseLeave = useCallback(() => {
        if (!ref.current) return;
        ref.current.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)";
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!el || !enabled) return;
        el.addEventListener("mousemove", handleMouseMove);
        el.addEventListener("mouseleave", handleMouseLeave);
        return () => {
            el.removeEventListener("mousemove", handleMouseMove);
            el.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [enabled, handleMouseMove, handleMouseLeave]);

    return ref;
}

export default function ProjectShowcase() {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeNode, setActiveNode] = useState<number>(0);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.registerPlugin(ScrollTrigger);

            // Section title entrance
            const title = sectionRef.current?.querySelector(`.section-title`);
            if (title) {
                gsap.fromTo(
                    title,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        ease: "power3.out",
                        scrollTrigger: { trigger: title, start: "top 85%" },
                    }
                );
            }

            // World map path drawing animation
            const paths = sectionRef.current?.querySelectorAll(`.${styles.nodePath}`);
            paths?.forEach((path, i) => {
                gsap.fromTo(
                    path,
                    { scaleX: 0, transformOrigin: "left center" },
                    {
                        scaleX: 1,
                        duration: 0.4,
                        ease: "power2.out",
                        scrollTrigger: { trigger: path, start: "top 90%" },
                        delay: i * 0.12,
                    }
                );
            });

            // World map node pop-in with stagger
            const nodes = sectionRef.current?.querySelectorAll(`.${styles.nodeCircle}`);
            nodes?.forEach((node, i) => {
                gsap.fromTo(
                    node,
                    { opacity: 0, scale: 0, rotation: -180 },
                    {
                        opacity: 1,
                        scale: 1,
                        rotation: 0,
                        duration: 0.6,
                        ease: "back.out(2.5)",
                        scrollTrigger: { trigger: node, start: "top 90%" },
                        delay: i * 0.12,
                    }
                );
            });

            // Project cards staggered reveal with alternating slide direction
            const cards = sectionRef.current?.querySelectorAll(`.${styles.projectCard}`);
            cards?.forEach((card, i) => {
                const fromLeft = i % 2 === 0;
                gsap.fromTo(
                    card,
                    { opacity: 0, x: fromLeft ? -60 : 60, y: 30 },
                    {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        duration: 0.9,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            end: "top 30%",
                            toggleActions: "play none none reverse",
                            onEnter: () => setActiveNode(i),
                        },
                    }
                );
            });

            // Tech badges pop-in with rotation
            const badges = sectionRef.current?.querySelectorAll(`.${styles.badge}`);
            badges?.forEach((badge, i) => {
                gsap.fromTo(
                    badge,
                    { opacity: 0, scale: 0, rotation: -15 },
                    {
                        opacity: 1,
                        scale: 1,
                        rotation: 0,
                        duration: 0.35,
                        ease: "back.out(3)",
                        scrollTrigger: { trigger: badge, start: "top 92%" },
                        delay: (i % 5) * 0.06,
                    }
                );
            });

            // Parallax backgrounds for each card screen
            const screens = sectionRef.current?.querySelectorAll(`.${styles.cardScreen}`);
            screens?.forEach((screen) => {
                gsap.to(screen, {
                    y: -15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: screen,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5,
                    },
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="projects" className={`section ${styles.showcase}`} ref={sectionRef}>
            <div className="section-content">
                <span className="section-world">World 2</span>
                <h2 className="section-title">
                    <span className="star">★</span> Select Your Level{" "}
                    <span className="star">★</span>
                </h2>

                {/* World Map */}
                <div className={styles.worldMap}>
                    {projects.map((project, i) => (
                        <div key={project.id} className={styles.mapNode}>
                            <a
                                href={`#project-${project.id}`}
                                className={`${styles.nodeCircle} ${i === activeNode ? styles.nodeActive : ""} ${project.comingSoon ? styles.nodeLocked : ""}`}
                            >
                                <span>{project.world}</span>
                                {project.comingSoon && (
                                    <span className={styles.lockIcon}><PixelIcon name="lock" size={12} color="#888" /></span>
                                )}
                            </a>
                            {i < projects.length - 1 && <div className={styles.nodePath} />}
                        </div>
                    ))}
                </div>

                {/* Project Cards */}
                <div className={styles.projects}>
                    {projects.map((project, i) => (
                        <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Individual Project Card with 3D tilt ──
function ProjectCard({ project, index }: { project: Project; index: number }) {
    const tiltRef = useTilt(true);

    return (
        <article
            id={`project-${project.id}`}
            className={`${styles.projectCard} ${index % 2 === 1 ? styles.cardReverse : ""} ${project.comingSoon ? styles.cardComingSoon : ""}`}
            ref={tiltRef}
            style={{ transitionProperty: "transform, border-color, box-shadow" }}
        >
            <div className={styles.cardInner}>
                {/* Left: Screen */}
                <div className={`${styles.cardScreen} gb-screen crt-scanlines`}>
                    <div className={styles.screenContent}>
                        <PixelScreen theme={project.screenTheme} index={index} />
                    </div>
                    {project.comingSoon && (
                        <div className={styles.comingSoonOverlay}>
                            <span className={styles.comingSoonBadge}><PixelIcon name="hourglass" size={12} color="var(--gbc-gold)" /> COMING SOON</span>
                        </div>
                    )}
                </div>

                {/* Right: Info */}
                <div className={styles.cardInfo}>
                    <div className={styles.cardHeader}>
                        <span className={styles.worldLabel}>WORLD {project.world}</span>
                        <h3 className={styles.projectTitle}>{project.title}</h3>
                        <span className={styles.projectTagline}>{project.tagline}</span>
                    </div>

                    <div className={styles.cardBody}>
                        <div className={styles.questLog}>
                            <span className={styles.questLabel}>QUEST LOG:</span>
                            <p className={styles.questText}>{project.description}</p>
                        </div>

                        <div className={styles.techStack}>
                            <span className={styles.techLabel}>POWER-UPS:</span>
                            <div className={styles.techBadges}>
                                {project.tech.map((t) => (
                                    <span key={t} className={styles.badge}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.meta}>
                            <div className={styles.difficulty}>
                                <span className={styles.metaLabel}>DIFFICULTY:</span>
                                <span className={styles.stars}>
                                    {"★".repeat(project.difficulty)}
                                    {"☆".repeat(5 - project.difficulty)}
                                </span>
                            </div>
                            <div className={styles.duration}>
                                <span className={styles.metaLabel}>DATE:</span>
                                <span>{project.duration}</span>
                            </div>
                        </div>

                        <div className={styles.cardActions}>
                            <a
                                href={project.demoUrl}
                                className={`btn btn-primary ${project.comingSoon ? styles.btnDisabled : ""}`}
                                aria-disabled={project.comingSoon}
                            >
                                {project.comingSoon ? <><PixelIcon name="lock" size={12} color="currentColor" /> LOCKED</> : <><PixelIcon name="play" size={12} color="currentColor" /> PLAY DEMO</>}
                            </a>
                            <a
                                href={project.codeUrl}
                                className={`btn btn-secondary ${project.comingSoon ? styles.btnDisabled : ""}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-disabled={project.comingSoon}
                            >
                                {project.comingSoon ? <><PixelIcon name="lock" size={12} color="currentColor" /> LOCKED</> : <><PixelIcon name="code" size={12} color="currentColor" /> VIEW CODE</>}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
