"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./SkillsShowcase.module.css";
import PixelIcon from "./PixelIcon";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── Types ──
type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
type Category = "weapon" | "armor" | "magic" | "item";

interface Skill {
    name: string;
    abbr: string;
    label: string;
    value: number;
    category: Category;
    years: number;
    flavor: string;
    rarity: Rarity;
}

interface CoreStat {
    label: string;
    name: string;
    value: number;
    icon: string;
}

// ── Data ──
const coreStats: CoreStat[] = [
    { label: "HP", name: "Frontend", value: 88, icon: "heart" },
    { label: "ATK", name: "Backend", value: 82, icon: "sword" },
    { label: "DEF", name: "AI/ML", value: 72, icon: "shield" },
    { label: "SPD", name: "Problem Solving", value: 90, icon: "bolt" },
    { label: "ACC", name: "UI/UX Design", value: 80, icon: "crosshair" },
    { label: "LCK", name: "Game Dev", value: 75, icon: "clover" },
];

function getRarity(value: number): Rarity {
    if (value >= 90) return "legendary";
    if (value >= 85) return "epic";
    if (value >= 78) return "rare";
    if (value >= 70) return "uncommon";
    return "common";
}

const skillsData = [
    { name: "Python", abbr: "PY", value: 88, category: "weapon" as Category, years: 3, flavor: "Ancient scrolls of automation and AI" },
    { name: "JavaScript", abbr: "JS", value: 90, category: "weapon" as Category, years: 3, flavor: "The legendary blade of the web" },
    { name: "TypeScript", abbr: "TS", value: 82, category: "weapon" as Category, years: 2, flavor: "An enchanted upgrade to the JS blade" },
    { name: "C++", abbr: "C+", value: 75, category: "weapon" as Category, years: 2, flavor: "The heavy artillery of performance" },
    { name: "React", abbr: "Re", value: 90, category: "magic" as Category, years: 3, flavor: "Component-forged sorcery of UI" },
    { name: "React Native", abbr: "RN", value: 80, category: "magic" as Category, years: 1, flavor: "Mobile realm conjuration spell" },
    { name: "Node.js", abbr: "Nd", value: 85, category: "armor" as Category, years: 2, flavor: "Server-side shield generator" },
    { name: "Flask", abbr: "Fl", value: 82, category: "armor" as Category, years: 2, flavor: "Python's lightweight battle armor" },
    { name: "FastAPI", abbr: "FA", value: 80, category: "armor" as Category, years: 1, flavor: "Speed-forged API armor" },
    { name: "Firebase", abbr: "FB", value: 78, category: "item" as Category, years: 2, flavor: "Cloud fire enchantment stone" },
    { name: "Supabase", abbr: "SB", value: 75, category: "item" as Category, years: 1, flavor: "Open-source healing potion" },
    { name: "PostgreSQL", abbr: "PG", value: 78, category: "armor" as Category, years: 2, flavor: "The relational data fortress" },
    { name: "Docker", abbr: "DK", value: 72, category: "item" as Category, years: 1, flavor: "Container of infinite deployment" },
    { name: "Git", abbr: "Gt", value: 88, category: "item" as Category, years: 3, flavor: "Time-travel device for code" },
    { name: "Figma", abbr: "Fg", value: 78, category: "magic" as Category, years: 2, flavor: "Design realm spellbook" },
    { name: "Unity", abbr: "Un", value: 70, category: "magic" as Category, years: 1, flavor: "Game world creation engine" },
    { name: "Godot", abbr: "Go", value: 68, category: "magic" as Category, years: 1, flavor: "Indie game forging hammer" },
    { name: "Blender", abbr: "Bl", value: 65, category: "magic" as Category, years: 1, flavor: "3D reality shaping tool" },
    { name: "Tailwind", abbr: "TW", value: 85, category: "item" as Category, years: 2, flavor: "Utility belt of rapid styling" },
    { name: "HTML/CSS", abbr: "HC", value: 92, category: "weapon" as Category, years: 3, flavor: "Foundation stones of the web realm" },
];

const skills: Skill[] = skillsData.map((s) => ({
    ...s,
    label: s.name,
    rarity: getRarity(s.value),
}));

const categories = [
    { key: "all", label: "ALL", icon: "chest" },
    { key: "weapon", label: "WEAPONS", icon: "sword" },
    { key: "armor", label: "ARMOR", icon: "shield" },
    { key: "magic", label: "MAGIC", icon: "wand" },
    { key: "item", label: "ITEMS", icon: "backpack" },
];

const rarityLabels: Record<Rarity, string> = {
    common: "COMMON",
    uncommon: "UNCOMMON",
    rare: "RARE",
    epic: "EPIC",
    legendary: "LEGENDARY",
};

const categoryIcons: Record<Category, string> = {
    weapon: "sword",
    armor: "shield",
    magic: "wand",
    item: "backpack",
};

// ── Animated XP Counter ──
function useCountUp(target: number, active: boolean, duration = 1200) {
    const [value, setValue] = useState(0);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        if (!active) return;
        let start: number;
        const animate = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setValue(Math.round(target * eased));
            if (progress < 1) rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [target, active, duration]);

    return value;
}

// ── Component ──
export default function SkillsShowcase() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
    const [animatedBars, setAnimatedBars] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const sectionRef = useRef<HTMLElement>(null);

    // Total XP
    const totalXP = skills.reduce((sum, s) => sum + s.value * s.years, 0);
    const animatedXP = useCountUp(totalXP, animatedBars, 2000);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setAnimatedBars(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // GSAP animations
    useEffect(() => {
        if (!animatedBars) return;

        let ctx = gsap.context(() => {
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

            // Stats card entrance
            const statsCard = section.querySelector(`.${styles.statsCard}`);
            if (statsCard) {
                gsap.fromTo(statsCard, { opacity: 0, y: 40 }, {
                    opacity: 1, y: 0,
                    duration: 0.6, ease: "power3.out", delay: 0.15,
                });
            }

            // Stat bars slide in with stagger
            const bars = section.querySelectorAll(`.stat-bar-container`);
            bars.forEach((bar, i) => {
                gsap.fromTo(bar, { opacity: 0, x: -40 }, {
                    opacity: 1, x: 0,
                    duration: 0.5, ease: "power2.out",
                    delay: 0.3 + i * 0.08,
                });
            });

            // XP counter bounce
            const xpDisplay = section.querySelector(`.${styles.xpCounter}`);
            if (xpDisplay) {
                gsap.fromTo(xpDisplay, { opacity: 0, scale: 0.5, rotation: -10 }, {
                    opacity: 1, scale: 1, rotation: 0,
                    duration: 0.7, ease: "elastic.out(1, 0.5)",
                    delay: 0.5,
                });
            }

            // Category tabs pop-in
            const tabs = section.querySelectorAll(`.${styles.tab}`);
            tabs.forEach((tab, i) => {
                gsap.fromTo(tab, { opacity: 0, y: 15, scale: 0.8 }, {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.4, ease: "back.out(2.5)",
                    delay: 0.6 + i * 0.06,
                });
            });

            // Inventory slots pop-in with stagger
            const slots = section.querySelectorAll(`.${styles.inventorySlot}`);
            slots.forEach((slot, i) => {
                gsap.fromTo(slot, { opacity: 0, scale: 0, rotation: -20 }, {
                    opacity: 1, scale: 1, rotation: 0,
                    duration: 0.45, ease: "back.out(3)",
                    delay: 0.7 + i * 0.04,
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [animatedBars]);

    const filteredSkills =
        activeCategory === "all"
            ? skills
            : skills.filter((s) => s.category === activeCategory);

    const handleCategoryChange = useCallback((key: string) => {
        setActiveCategory(key);
        setSelectedSkill(null);
        setHoveredSkill(null);
    }, []);

    const handleSlotClick = useCallback((skill: Skill) => {
        setSelectedSkill((prev) => prev?.name === skill.name ? null : skill);
    }, []);

    const getBarClass = (value: number) => {
        if (value >= 85) return "high";
        if (value >= 70) return "mid";
        return "low";
    };

    return (
        <section id="skills" className={`section ${styles.skills}`} ref={sectionRef}>
            <div className="section-content">
                <span className="section-world">World 3</span>
                <h2 className="section-title">
                    <span className="star">★</span> Character Stats <span className="star">★</span>
                </h2>

                {/* Core Stats Card */}
                <div className={styles.statsCard}>
                    <div className={styles.statsHeader}>
                        <div className={styles.headerInfo}>
                            <span className={styles.className}>CLASS: Full-Stack Developer & Game Dev</span>
                            <span className={styles.level}>LVL: B.Tech CSE @ Amrita</span>
                        </div>
                        <div className={styles.xpCounter}>
                            <span className={styles.xpLabel}>TOTAL XP</span>
                            <span className={styles.xpValue}>{animatedXP.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className={styles.statBars}>
                        {coreStats.map((stat) => (
                            <div key={stat.label} className="stat-bar-container">
                                <span className="stat-bar-label">
                                    <PixelIcon name={stat.icon} size={14} color="var(--gb-light)" /> {stat.label}
                                </span>
                                <div className="stat-bar-track">
                                    <div
                                        className={`stat-bar-fill ${getBarClass(stat.value)}`}
                                        style={{ width: animatedBars ? `${stat.value}%` : "0%" }}
                                    />
                                </div>
                                <span className="stat-bar-value">{stat.value}/100</span>
                            </div>
                        ))}
                    </div>

                    {/* Rarity Legend */}
                    <div className={styles.rarityLegend}>
                        {(["common", "uncommon", "rare", "epic", "legendary"] as Rarity[]).map((r) => (
                            <span key={r} className={`${styles.rarityDot} ${styles[`rarity_${r}`]}`}>
                                {rarityLabels[r]}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Inventory */}
                <div className={styles.inventorySection}>
                    <h3 className={styles.inventoryTitle}>
                        <span className="star">★</span> Inventory <span className="star">★</span>
                    </h3>

                    {/* Category Tabs */}
                    <div className={styles.categoryTabs}>
                        {categories.map((cat) => (
                            <button
                                key={cat.key}
                                className={`${styles.tab} ${activeCategory === cat.key ? styles.tabActive : ""}`}
                                onClick={() => handleCategoryChange(cat.key)}
                            >
                                <span className={styles.tabIcon}>
                                    <PixelIcon name={cat.icon} size={14} color="currentColor" />
                                </span>
                                <span className={styles.tabLabel}>{cat.label}</span>
                                <span className={styles.tabCount}>
                                    {cat.key === "all"
                                        ? skills.length
                                        : skills.filter((s) => s.category === cat.key).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Skill Grid */}
                    <div className={styles.inventoryGrid}>
                        {filteredSkills.map((skill) => (
                            <div
                                key={skill.name}
                                className={`${styles.inventorySlot} ${styles[`rarity_${skill.rarity}`]} ${selectedSkill?.name === skill.name ? styles.slotSelected : ""
                                    }`}
                                onMouseEnter={() => setHoveredSkill(skill)}
                                onMouseLeave={() => setHoveredSkill(null)}
                                onClick={() => handleSlotClick(skill)}
                            >
                                <div className={`card-skill ${styles.slotInner}`}>
                                    <div className={styles.slotRarityBar} />
                                    <span className={styles.slotIcon}>{skill.abbr}</span>
                                    <span className={styles.slotName}>{skill.label}</span>
                                    <div className={styles.slotBar}>
                                        <div
                                            className={styles.slotBarFill}
                                            style={{ width: animatedBars ? `${skill.value}%` : "0%" }}
                                        />
                                    </div>
                                    <span className={styles.slotXP}>{skill.value} XP</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Detailed Tooltip — fixed panel below grid */}
                    {(hoveredSkill || selectedSkill) && (
                        <div className={styles.detailPanel}>
                            <SkillDetailPanel skill={selectedSkill || hoveredSkill!} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

// ── Skill Detail Panel ──
function SkillDetailPanel({ skill }: { skill: Skill }) {
    return (
        <div className={`${styles.panelInner} ${styles[`rarity_${skill.rarity}`]}`}>
            <div className={styles.panelHeader}>
                <div className={styles.panelTitle}>
                    <span className={styles.panelIcon}>
                        <PixelIcon name={categoryIcons[skill.category]} size={18} color="currentColor" />
                    </span>
                    <div>
                        <span className={styles.panelName}>{skill.label}</span>
                        <span className={`${styles.panelRarity} ${styles[`rarityText_${skill.rarity}`]}`}>
                            {rarityLabels[skill.rarity]}
                        </span>
                    </div>
                </div>
                <div className={styles.panelStars}>
                    {"★".repeat(Math.round(skill.value / 20))}
                    {"☆".repeat(5 - Math.round(skill.value / 20))}
                </div>
            </div>

            <div className={styles.panelBody}>
                <div className={styles.panelStat}>
                    <span className={styles.panelStatLabel}>POWER</span>
                    <div className={styles.panelBar}>
                        <div
                            className={`${styles.panelBarFill} ${styles[`rarityBar_${skill.rarity}`]}`}
                            style={{ width: `${skill.value}%` }}
                        />
                    </div>
                    <span className={styles.panelStatValue}>{skill.value}/100</span>
                </div>
                <div className={styles.panelMeta}>
                    <span>{skill.years}+ years</span>
                    <span className={styles.panelCategory}>{skill.category.toUpperCase()}</span>
                </div>
                <p className={styles.panelFlavor}>&quot;{skill.flavor}&quot;</p>
            </div>
        </div>
    );
}
