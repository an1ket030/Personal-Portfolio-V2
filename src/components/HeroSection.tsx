"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const roles = [
    "Full-Stack Developer",
    "Game Developer",
    "UI/UX Designer",
    "Creative Technologist",
];

const stats = [
    { label: "Projects", value: 6 },
    { label: "Skills", value: 20 },
    { label: "XP Yrs", value: 3 },
];

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [roleIndex, setRoleIndex] = useState(0);
    const [displayRole, setDisplayRole] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // ── Pixelated World Canvas ──
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d")!;
        let animFrame: number;
        let w = 0, h = 0;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio, 2);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener("resize", resize);

        // ── Helper: draw a pixel rectangle (crisp, no anti-alias) ──
        const px = (x: number, y: number, s: number, color: string) => {
            ctx.fillStyle = color;
            ctx.fillRect(Math.floor(x), Math.floor(y), s, s);
        };

        // ── Stars (pixel dots) ──
        const stars: { x: number; y: number; s: number; a: number; speed: number }[] = [];
        for (let i = 0; i < 60; i++) {
            stars.push({
                x: Math.random() * 2000,
                y: Math.random() * 1200,
                s: Math.random() > 0.7 ? 3 : 2,
                a: 0.15 + Math.random() * 0.45,
                speed: 0.003 + Math.random() * 0.005,
            });
        }

        // ── Pixel Clouds ──
        const drawPixelCloud = (cx: number, cy: number, scale: number) => {
            const s = Math.floor(10 * scale);
            const color = "rgba(155, 188, 15, 0.12)";
            const colorLight = "rgba(155, 188, 15, 0.09)";
            // Base row (widest)
            for (let i = -5; i <= 5; i++) px(cx + i * s, cy, s, color);
            // Lower-middle row
            for (let i = -6; i <= 6; i++) px(cx + i * s, cy - s, s, color);
            // Middle row
            for (let i = -5; i <= 5; i++) px(cx + i * s, cy - s * 2, s, colorLight);
            // Upper row
            for (let i = -3; i <= 3; i++) px(cx + i * s, cy - s * 3, s, colorLight);
            // Top row
            for (let i = -2; i <= 2; i++) px(cx + i * s, cy - s * 4, s, colorLight);
            // Peak
            for (let i = -1; i <= 1; i++) px(cx + i * s, cy - s * 5, s, colorLight);
        };

        const clouds: { x: number; y: number; scale: number; speed: number }[] = [];
        for (let i = 0; i < 6; i++) {
            clouds.push({
                x: Math.random() * 2000,
                y: 50 + Math.random() * 130,
                scale: 0.8 + Math.random() * 0.6,
                speed: 0.12 + Math.random() * 0.25,
            });
        }

        // ── Question Blocks (pixelated) ──
        const drawQuestionBlock = (bx: number, by: number) => {
            const s = 5;
            const size = 5; // 5x5 pixel block = 25px
            const col = "rgba(240, 180, 41, 0.18)";
            const border = "rgba(240, 180, 41, 0.28)";
            const highlight = "rgba(240, 180, 41, 0.45)";

            // Body
            for (let row = 0; row < size; row++) {
                for (let col2 = 0; col2 < size; col2++) {
                    px(bx + col2 * s, by + row * s, s, col);
                }
            }
            // Border top/bottom
            for (let i = 0; i < size; i++) {
                px(bx + i * s, by, s, border);
                px(bx + i * s, by + (size - 1) * s, s, border);
            }
            // Border left/right
            for (let i = 0; i < size; i++) {
                px(bx, by + i * s, s, border);
                px(bx + (size - 1) * s, by + i * s, s, border);
            }
            // ? mark (pixel art)
            px(bx + 2 * s, by + 1 * s, s, highlight);
            px(bx + 3 * s, by + 1 * s, s, highlight);
            px(bx + 4 * s, by + 2 * s, s, highlight);
            px(bx + 3 * s, by + 3 * s, s, highlight);
            px(bx + 3 * s, by + 4 * s, s, highlight);
        };

        const blocks: { x: number; y: number; phase: number }[] = [];
        for (let i = 0; i < 4; i++) {
            blocks.push({
                x: 80 + i * 350 + Math.random() * 100,
                y: 180 + Math.random() * 80,
                phase: Math.random() * Math.PI * 2,
            });
        }

        // ── Pixel Coins (spinning) ──
        const drawPixelCoin = (cx: number, cy: number, frame: number) => {
            const s = 6;
            const col = "rgba(240, 180, 41, 0.3)";
            const shine = "rgba(240, 180, 41, 0.55)";
            const f = Math.floor(frame) % 4;

            if (f === 0) {
                px(cx - s, cy - 2 * s, s, col); px(cx, cy - 2 * s, s, col);
                px(cx - 2 * s, cy - s, s, col); px(cx - s, cy - s, s, shine); px(cx, cy - s, s, col); px(cx + s, cy - s, s, col);
                px(cx - 2 * s, cy, s, col); px(cx - s, cy, s, col); px(cx, cy, s, col); px(cx + s, cy, s, col);
                px(cx - s, cy + s, s, col); px(cx, cy + s, s, col);
            } else if (f === 1) {
                px(cx, cy - 2 * s, s, col);
                px(cx - s, cy - s, s, col); px(cx, cy - s, s, shine); px(cx + s, cy - s, s, col);
                px(cx - s, cy, s, col); px(cx, cy, s, col); px(cx + s, cy, s, col);
                px(cx, cy + s, s, col);
            } else if (f === 2) {
                px(cx, cy - 2 * s, s, col);
                px(cx, cy - s, s, shine);
                px(cx, cy, s, col);
                px(cx, cy + s, s, col);
            } else {
                px(cx, cy - 2 * s, s, col);
                px(cx - s, cy - s, s, col); px(cx, cy - s, s, col); px(cx + s, cy - s, s, col);
                px(cx - s, cy, s, col); px(cx, cy, s, shine); px(cx + s, cy, s, col);
                px(cx, cy + s, s, col);
            }
        };

        const coins: { x: number; y: number; phase: number; frame: number }[] = [];
        for (let i = 0; i < 8; i++) {
            coins.push({
                x: 60 + Math.random() * 1800,
                y: 100 + Math.random() * 500,
                phase: Math.random() * Math.PI * 2,
                frame: Math.random() * 4,
            });
        }

        // ── Particles (subtle floating dots) ──
        const particles: { x: number; y: number; vx: number; vy: number; s: number; a: number; hue: number }[] = [];
        for (let i = 0; i < 12; i++) {
            particles.push({
                x: Math.random() * 2000, y: Math.random() * 1200,
                vx: (Math.random() - 0.5) * 0.15,
                vy: -0.05 - Math.random() * 0.1,
                s: 2 + Math.floor(Math.random() * 2),
                a: 0.03 + Math.random() * 0.06,
                hue: Math.random() > 0.5 ? 80 : 260,
            });
        }

        let mouseX = w / 2, mouseY = h / 2;
        const handleMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
        window.addEventListener("mousemove", handleMouse);

        let time = 0;

        const draw = () => {
            time++;
            ctx.clearRect(0, 0, w, h);

            // ── Pixel Grid ──
            ctx.strokeStyle = "rgba(139, 172, 15, 0.015)";
            ctx.lineWidth = 1;
            const gridSpacing = 48;
            for (let x = 0; x < w; x += gridSpacing) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            }
            for (let y = 0; y < h; y += gridSpacing) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }

            // ── Stars (twinkling pixel dots) ──
            stars.forEach((star) => {
                // Remap star positions to viewport
                const sx = (star.x / 2000) * w;
                const sy = (star.y / 1200) * h;
                const twinkle = Math.sin(time * star.speed) * 0.3 + 0.7;
                ctx.globalAlpha = star.a * twinkle;
                const starCol = star.a > 0.35 ? "rgba(155, 188, 15, 0.8)" : "rgba(200, 200, 220, 0.5)";
                px(sx, sy, star.s, starCol);
            });
            ctx.globalAlpha = 1;

            // ── Clouds (drifting pixel art) ──
            clouds.forEach((cloud) => {
                cloud.x += cloud.speed;
                if (cloud.x > w + 100) cloud.x = -100;
                drawPixelCloud(cloud.x, cloud.y, cloud.scale);
            });

            // ── Question Blocks (bobbing) ──
            blocks.forEach((block) => {
                const bx = (block.x / 2000) * w;
                const bob = Math.floor(Math.sin(time * 0.025 + block.phase) * 5);
                drawQuestionBlock(bx, block.y + bob);
            });

            // ── Coins (spinning + bobbing) ──
            coins.forEach((coin) => {
                coin.frame += 0.03;
                const cx = (coin.x / 2000) * w;
                const bob = Math.floor(Math.sin(time * 0.03 + coin.phase) * 3);
                drawPixelCoin(cx, coin.y + bob, coin.frame);
            });

            // ── Particles ──
            particles.forEach((p) => {
                const dx = (mouseX - w / 2) * 0.003;
                const dy = (mouseY - h / 2) * 0.003;
                p.x += p.vx + dx * p.s * 0.04;
                p.y += p.vy + dy * p.s * 0.04;
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                ctx.globalAlpha = p.a;
                const color = p.hue === 80 ? "rgba(139, 172, 15, 0.5)" : "rgba(139, 92, 246, 0.5)";
                px(p.x, p.y, p.s, color);
            });
            ctx.globalAlpha = 1;

            // ── Ground platform (pixel tiles) ──
            const groundY = h - 48;
            const tileSize = 24;
            // Top line
            ctx.fillStyle = "rgba(139, 172, 15, 0.08)";
            ctx.fillRect(0, groundY, w, 3);
            // Tile grid
            for (let tx = 0; tx < w; tx += tileSize) {
                ctx.fillStyle = "rgba(139, 172, 15, 0.025)";
                ctx.fillRect(tx, groundY + 3, tileSize, tileSize);
                ctx.strokeStyle = "rgba(139, 172, 15, 0.03)";
                ctx.strokeRect(tx, groundY + 3, tileSize, tileSize);
                // Inner detail
                ctx.fillStyle = "rgba(139, 172, 15, 0.015)";
                ctx.fillRect(tx + 2, groundY + 5, tileSize - 4, tileSize - 4);
            }

            // ── Central glow ──
            const gradient = ctx.createRadialGradient(w / 2, h * 0.4, 0, w / 2, h * 0.4, w * 0.35);
            gradient.addColorStop(0, "rgba(139, 92, 246, 0.02)");
            gradient.addColorStop(0.5, "rgba(20, 184, 166, 0.01)");
            gradient.addColorStop(1, "transparent");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);

            animFrame = requestAnimationFrame(draw);
        };
        animFrame = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animFrame);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouse);
        };
    }, []);

    // ── Typewriter role cycling ──
    useEffect(() => {
        const fullRole = roles[roleIndex];
        let timeout: ReturnType<typeof setTimeout>;

        if (!isDeleting && displayRole.length < fullRole.length) {
            timeout = setTimeout(() => setDisplayRole(fullRole.slice(0, displayRole.length + 1)), 60);
        } else if (!isDeleting && displayRole.length === fullRole.length) {
            timeout = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && displayRole.length > 0) {
            timeout = setTimeout(() => setDisplayRole(displayRole.slice(0, -1)), 30);
        } else if (isDeleting && displayRole.length === 0) {
            setIsDeleting(false);
            setRoleIndex((prev) => (prev + 1) % roles.length);
        }

        return () => clearTimeout(timeout);
    }, [displayRole, isDeleting, roleIndex]);

    // ── GSAP animations ──
    useEffect(() => {
        let ctx: gsap.Context;
        const loadGsap = () => {
            ctx = gsap.context(() => {
                gsap.registerPlugin(ScrollTrigger);

                const el = contentRef.current;
                if (!el) return;

                const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

                tl.fromTo(el.querySelector(`.${styles.greeting}`), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })
                    .fromTo(el.querySelector(`.${styles.name}`), { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.7 }, "-=0.2")
                    .fromTo(el.querySelector(`.${styles.roleContainer}`), { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
                    .fromTo(el.querySelector(`.${styles.tagline}`), { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
                    .fromTo(el.querySelector(`.${styles.characterImage}`), { opacity: 0, scale: 0.5, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.5)" }, "-=0.2")
                    .fromTo(el.querySelector(`.${styles.statsRow}`), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
                    .fromTo(el.querySelector(`.${styles.actions}`), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");

                // Parallax on scroll
                if (sectionRef.current) {
                    gsap.to(el.querySelector(`.${styles.heroInner}`), {
                        y: 80, opacity: 0, ease: "none",
                        scrollTrigger: { trigger: sectionRef.current, start: "40% top", end: "bottom top", scrub: 1 },
                    });
                }
            }, sectionRef);
        };

        const timer = setTimeout(() => loadGsap(), 100);
        return () => {
            clearTimeout(timer);
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <section id="hero" className={`section ${styles.hero}`} ref={sectionRef}>
            {/* Pixelated world canvas */}
            <canvas ref={canvasRef} className={styles.bgCanvas} aria-hidden="true" />

            {/* Gradient mesh overlay */}
            <div className={styles.gradientMesh} />

            <div ref={contentRef}>
                {/* HUD */}
                <div className={styles.hud}>
                    <span>PLAYER: ANIKET</span>
                    <span>WORLD 1-1</span>
                    <span>★ 000</span>
                </div>

                <div className={styles.heroInner}>
                    {/* Greeting */}
                    <p className={styles.greeting}>Hello, World! I&apos;m</p>

                    {/* Name */}
                    <h1 className={styles.name}>
                        Aniket <span className={styles.nameAccent}>Singh</span>
                    </h1>

                    {/* Gradient underline */}
                    <div className={styles.underline}>
                        <div className={styles.underlineGlow} />
                    </div>

                    {/* Rotating role typewriter */}
                    <div className={styles.roleContainer}>
                        <span className={styles.rolePrefix}>{">"} </span>
                        <span className={styles.roleText}>{displayRole}</span>
                        <span className={styles.roleCursor}>|</span>
                    </div>

                    {/* Tagline */}
                    <p className={styles.tagline}>
                        Crafting digital experiences at the intersection of code, design,
                        and play
                    </p>

                    {/* User's Pixel Character Image */}
                    <div className={styles.characterImage}>
                        <Image
                            src="/images/hero-avatar.png"
                            alt="Pixel art character of Aniket"
                            width={200}
                            height={200}
                            priority
                            style={{ imageRendering: "pixelated" }}
                        />
                    </div>

                    {/* Stats ticker */}
                    <div className={styles.statsRow}>
                        {stats.map((stat) => (
                            <div key={stat.label} className={styles.statItem}>
                                <span className={styles.statValue}>{stat.value}+</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className={styles.actions}>
                        <a href="#projects" className="btn btn-primary">▶ VIEW PROJECTS</a>
                        <a href="#contact" className="btn btn-secondary">✉ CONTACT ME</a>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className={styles.scrollIndicator}>
                    <span className={styles.scrollArrow}>▼</span>
                    <span className={styles.scrollText}>SCROLL</span>
                </div>
            </div>
        </section>
    );
}
