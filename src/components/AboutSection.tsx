"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import styles from "./AboutSection.module.css";
import PixelIcon from "./PixelIcon";
import { triggerSfx } from "./SoundManager";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const achievements = [
    {
        icon: "trophy",
        title: "Chancellor's Scholarship",
        desc: "₹5,00,000 awarded for top 1% academic performance",
        xp: "+500 XP",
    },
    {
        icon: "star",
        title: "SHAASTRA'24 – IIT Madras",
        desc: "Top 50 out of 3,500+ national teams",
        xp: "+400 XP",
    },
    {
        icon: "gamepad",
        title: "Game Dev Bootcamp Lead",
        desc: "Led Unity/Godot training for 25 students over 15 weeks",
        xp: "+350 XP",
    },
    {
        icon: "rocket",
        title: "TechFest Coordinator",
        desc: "Managed UI/UX event with 100+ attendees, grew participation by 40%",
        xp: "+300 XP",
    },
];

const hobbies = [
    { icon: "film", name: "Movies", desc: "Cinephile — Sci-fi & Thriller" },
    { icon: "football", name: "Football", desc: "Weekend warrior" },
    { icon: "gamepad", name: "Video Games", desc: "RPGs & Strategy" },
    { icon: "book", name: "Reading", desc: "Sci-fi & Philosophy" },
    { icon: "writing", name: "Writing", desc: "Creative storytelling" },
    { icon: "music", name: "Music", desc: "Lo-fi & Indie" },
    { icon: "coffee", name: "Coffee", desc: "Fuel source" },
    { icon: "palette", name: "Design", desc: "Pixel art & UI" },
    { icon: "puzzle", name: "Puzzles", desc: "Brain teasers" },
    { icon: "camera", name: "Photography", desc: "Street & Nature" },
];

const timeline = [
    {
        year: "2020",
        role: "Secondary Schooling",
        company: "Gautam School",
        level: 1,
        desc: "Foundation days",
    },
    {
        year: "2023",
        role: "B.Tech CSE",
        company: "Amrita Vishwa Vidyapeetham",
        level: 2,
        desc: "Started the journey",
    },
    {
        year: "2024",
        role: "Game Dev Journey",
        company: "Unity & Godot",
        level: 3,
        desc: "Creating digital worlds",
    },
    {
        year: "2025",
        role: "Full-Stack Dev",
        company: "Building & Shipping",
        level: 4,
        desc: "Real-world apps",
    },
    {
        year: "NOW",
        role: "Leveling Up",
        company: "Open to Opportunities",
        level: 5,
        desc: "Next chapter loading...",
    },
];

const coursework = [
    "DSA",
    "Operating Systems",
    "DBMS",
    "AI/ML",
    "Web Dev",
    "UI/UX",
    "OOP",
];

const bioLines = [
    "I'm Aniket — a CS undergrad at Amrita, Chennai,",
    "passionate about building things that live on screens.",
    "",
    "Full-stack apps, AI-powered mobile tools, game dev —",
    "I love every corner of the digital craft.",
];

// ── Typewriter Hook ──
function useTypewriter(lines: string[], active: boolean, speed = 25) {
    const [displayText, setDisplayText] = useState("");
    const [done, setDone] = useState(false);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        if (!active) return;

        const fullText = lines.join("\n");
        let charIndex = 0;
        let lastTime = 0;

        const tick = (ts: number) => {
            if (!lastTime) lastTime = ts;
            const elapsed = ts - lastTime;

            if (elapsed >= speed) {
                charIndex++;
                lastTime = ts;
                setDisplayText(fullText.slice(0, charIndex));

                if (charIndex >= fullText.length) {
                    setDone(true);
                    return;
                }
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [lines, active, speed]);

    return { displayText, done };
}

// ── Component ──
export default function AboutSection() {
    const [bioRevealed, setBioRevealed] = useState(false);
    const [activeTimelineNode, setActiveTimelineNode] = useState(-1);
    const sectionRef = useRef<HTMLElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    const { displayText, done: typingDone } = useTypewriter(bioLines, bioRevealed, 20);

    // Intersection Observer for bio reveal
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setBioRevealed(true);
            },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // GSAP animations
    useEffect(() => {
        if (!bioRevealed) return;

        const loadGsap = () => {
            gsap.registerPlugin(ScrollTrigger);

            const section = sectionRef.current;
            if (!section) return;

            // Section title entrance
            const title = section.querySelector(`.section-title`);
            if (title) {
                gsap.fromTo(title, { opacity: 0, y: 30, scale: 0.9 }, {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.7, ease: "back.out(2)",
                });
            }

            // Player card entrance
            const playerCard = section.querySelector(`.${styles.playerCard}`);
            if (playerCard) {
                gsap.fromTo(playerCard, { opacity: 0, y: 50 }, {
                    opacity: 1, y: 0,
                    duration: 0.8, ease: "power3.out", delay: 0.2,
                });
            }

            // Avatar bounce
            const avatar = section.querySelector(`.${styles.avatarInner}`);
            if (avatar) {
                gsap.fromTo(avatar, { opacity: 0, scale: 0.3, rotation: -15 }, {
                    opacity: 1, scale: 1, rotation: 0,
                    duration: 0.6, ease: "elastic.out(1.2, 0.5)", delay: 0.4,
                });
            }

            // Stat rows stagger
            const statRows = section.querySelectorAll(`.${styles.statRow}`);
            statRows.forEach((row, i) => {
                gsap.fromTo(row, { opacity: 0, x: 30 }, {
                    opacity: 1, x: 0,
                    duration: 0.4, ease: "power2.out",
                    delay: 0.5 + i * 0.08,
                });
            });

            // Coursework badges bounce
            const badges = section.querySelectorAll(`.${styles.courseworkBadge}`);
            badges.forEach((badge, i) => {
                gsap.fromTo(badge, { opacity: 0, scale: 0, rotation: -10 }, {
                    opacity: 1, scale: 1, rotation: 0,
                    duration: 0.4, ease: "back.out(3)",
                    delay: 0.8 + i * 0.06,
                });
            });

            // Timeline nodes stagger with progressive reveal
            const timelineNodes = section.querySelectorAll(`.${styles.timelineNode}`);
            timelineNodes.forEach((node, i) => {
                gsap.fromTo(node, { opacity: 0, y: 20, scale: 0.8 }, {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.5, ease: "back.out(2)",
                    delay: 1.2 + i * 0.2,
                    onComplete: () => setActiveTimelineNode(i),
                });
            });

            // Timeline paths draw-in
            const paths = section.querySelectorAll(`.${styles.timelinePath}`);
            paths.forEach((path, i) => {
                gsap.fromTo(path, { scaleX: 0 }, {
                    scaleX: 1,
                    duration: 0.4, ease: "power2.out",
                    delay: 1.3 + i * 0.2,
                    transformOrigin: "left center",
                });
            });

            // Achievement cards stagger
            const achCards = section.querySelectorAll(`.${styles.achievementCard}`);
            achCards.forEach((card, i) => {
                gsap.fromTo(card, { opacity: 0, y: 20, scale: 0.9 }, {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.5, ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                    },
                    delay: i * 0.1,
                });
            });

            // Hobby items bounce in
            const hobbyItems = section.querySelectorAll(`.${styles.hobbyItem}`);
            hobbyItems.forEach((item, i) => {
                gsap.fromTo(item, { opacity: 0, y: 15, scale: 0.8 }, {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.4, ease: "back.out(2.5)",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 90%",
                    },
                    delay: i * 0.08,
                });
            });
        };

        loadGsap();
    }, [bioRevealed]);

    const skipTypewriter = useCallback(() => {
        // Handled by just setting bioRevealed — full text displays on click
    }, []);

    return (
        <section id="about" className={`section ${styles.about}`} ref={sectionRef}>
            <div className="section-content">
                <span className="section-world">World 4</span>
                <h2 className="section-title">
                    <span className="star">★</span> Player Select <span className="star">★</span>
                </h2>

                <div className={styles.playerCard}>
                    {/* Avatar + Stats */}
                    <div className={styles.cardTop}>
                        <div className={styles.avatar}>
                            <div className={styles.avatarInner}>
                                <Image
                                    src="/images/profile-photo.jpg"
                                    alt="Aniket Kumar Singh"
                                    width={100}
                                    height={100}
                                    className={styles.avatarPhoto}
                                    priority
                                />
                            </div>
                        </div>

                        <div className={styles.statInfo}>
                            <div className={styles.statRow}>
                                <span className={styles.statKey}>NAME:</span>
                                <span className={styles.statVal}>Aniket Kumar Singh</span>
                            </div>
                            <div className={styles.statRow}>
                                <span className={styles.statKey}>CLASS:</span>
                                <span className={styles.statVal}>
                                    Full-Stack Developer & Game Dev
                                </span>
                            </div>
                            <div className={styles.statRow}>
                                <span className={styles.statKey}>BASE:</span>
                                <span className={styles.statVal}>Chennai, India</span>
                            </div>
                            <div className={styles.statRow}>
                                <span className={styles.statKey}>GUILD:</span>
                                <span className={styles.statVal}>
                                    B.Tech CSE @ Amrita (CGPA: 7.60)
                                </span>
                            </div>
                            <div className={styles.statRow}>
                                <span className={styles.statKey}>QUEST:</span>
                                <span className={styles.statVal}>
                                    Building the future, one commit at a time
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Coursework Badges */}
                    <div className={styles.coursework}>
                        <span className={styles.courseworkLabel}>SKILL TREE:</span>
                        <div className={styles.courseworkBadges}>
                            {coursework.map((c) => (
                                <span key={c} className={styles.courseworkBadge}>{c}</span>
                            ))}
                        </div>
                    </div>

                    {/* Backstory — Typewriter */}
                    <div className={styles.backstory}>
                        <span className={styles.backstoryLabel}>BACKSTORY:</span>
                        <div className={styles.backstoryBox}>
                            <pre className={styles.backstoryText}>
                                {displayText}
                                {!typingDone && <span className={styles.cursor}>▌</span>}
                            </pre>
                        </div>
                    </div>

                    {/* Experience Timeline */}
                    <div className={styles.timelineSection}>
                        <span className={styles.timelineLabel}>JOURNEY:</span>
                        <div className={styles.timeline} ref={timelineRef}>
                            {timeline.map((item, i) => (
                                <div
                                    key={item.year}
                                    className={`${styles.timelineNode} ${i <= activeTimelineNode ? styles.nodeActive : ""
                                        }`}
                                >
                                    <div className={styles.nodeMarker}>
                                        <div className={styles.markerDot}>
                                            <PixelIcon
                                                name="star"
                                                size={14}
                                                color={i <= activeTimelineNode ? "var(--gbc-gold)" : "var(--gb-dark)"}
                                            />
                                        </div>
                                        <span className={styles.flagLevel}>LVL {item.level}</span>
                                    </div>
                                    <div className={styles.nodeContent}>
                                        <span className={styles.nodeYear}>{item.year}</span>
                                        <span className={styles.nodeRole}>{item.role}</span>
                                        <span className={styles.nodeCompany}>
                                            @ {item.company}
                                        </span>
                                        <span className={styles.nodeDesc}>{item.desc}</span>
                                    </div>
                                    {i < timeline.length - 1 && (
                                        <div className={styles.timelinePath} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className={styles.achievementsSection}>
                        <span className={styles.achievementsLabel}>ACHIEVEMENTS UNLOCKED:</span>
                        <div className={styles.achievements}>
                            {achievements.map((a) => (
                                <div key={a.title} className={styles.achievementCard}>
                                    <div className={styles.achIconWrap}>
                                        <PixelIcon name={a.icon} size={22} color="var(--gbc-gold)" />
                                    </div>
                                    <div className={styles.achContent}>
                                        <div className={styles.achHeader}>
                                            <span className={styles.achTitle}>{a.title}</span>
                                            <span className={styles.achXP}>{a.xp}</span>
                                        </div>
                                        <span className={styles.achDesc}>{a.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Side Quests — Marquee Ticker */}
                    <div className={styles.sideQuests}>
                        <span className={styles.sideQuestsLabel}>SIDE QUESTS:</span>
                        <div className={styles.hobbiesTrack}>
                            <div className={styles.hobbiesScroll}>
                                {/* Duplicate for seamless loop */}
                                {[...hobbies, ...hobbies].map((h, i) => (
                                    <div
                                        key={`${h.name}-${i}`}
                                        className={styles.hobbyItem}
                                        onClick={(e) => {
                                            triggerSfx("coin");
                                            // Spawn coin popup
                                            const popup = document.createElement("div");
                                            popup.className = styles.coinPopup;
                                            popup.textContent = "+1 🪙";
                                            const target = e.currentTarget;
                                            target.style.position = "relative";
                                            target.appendChild(popup);
                                            setTimeout(() => popup.remove(), 700);
                                        }}
                                    >
                                        <div className={styles.hobbyIcon}>
                                            <PixelIcon name={h.icon} size={22} color="var(--gb-light)" />
                                        </div>
                                        <span className={styles.hobbyName}>{h.name}</span>
                                        <span className={styles.hobbyDesc}>{h.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Resume Download */}
                    <div className={styles.resumeAction}>
                        <a href="#" className="btn btn-primary">
                            <PixelIcon name="save" size={14} color="currentColor" /> DOWNLOAD RESUME
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
