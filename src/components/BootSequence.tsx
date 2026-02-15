"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./BootSequence.module.css";

interface BootSequenceProps {
    onComplete: () => void;
}

type Phase = "black" | "power" | "logo" | "cartridge" | "ready";

export default function BootSequence({ onComplete }: BootSequenceProps) {
    const [phase, setPhase] = useState<Phase>("black");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number>(0);
    const skipRef = useRef(false);

    // Check for repeat visits
    useEffect(() => {
        if (sessionStorage.getItem("gb_boot_done")) {
            onComplete();
        }
    }, [onComplete]);

    const finishBoot = useCallback(() => {
        skipRef.current = true;
        sessionStorage.setItem("gb_boot_done", "1");
        cancelAnimationFrame(animFrameRef.current);
        onComplete();
    }, [onComplete]);

    // Handle skip
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
                finishBoot();
            }
        };
        const handleClick = () => finishBoot();

        window.addEventListener("keydown", handleKey);
        window.addEventListener("click", handleClick);
        return () => {
            window.removeEventListener("keydown", handleKey);
            window.removeEventListener("click", handleClick);
        };
    }, [finishBoot]);

    // Reduced motion check
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            finishBoot();
        }
    }, [finishBoot]);

    // Canvas boot animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size — dynamically match the actual screen frame
        const dpr = Math.min(window.devicePixelRatio, 2);
        const frame = canvas.parentElement;
        const rect = frame ? frame.getBoundingClientRect() : { width: 320, height: 288 };
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.scale(dpr, dpr);

        // Game Boy colors
        const GB_DARKEST = "#0f380f";
        const GB_DARK = "#306230";
        const GB_LIGHT = "#8bac0f";
        const GB_LIGHTEST = "#9bbc0f";

        let startTime = performance.now();
        let currentPhase: Phase = "black";

        // Helper to draw pixel text (8x8 style)
        const drawPixelText = (
            text: string,
            x: number,
            y: number,
            color: string,
            size: number = 8
        ) => {
            ctx.fillStyle = color;
            ctx.font = `${size}px monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, x, y);
        };

        // Draw a pixel-art Game Boy console logo
        const drawLogo = (y: number, alpha: number) => {
            ctx.save();
            ctx.globalAlpha = alpha;

            const cx = w / 2;
            const baseY = y - 35;

            // ── Game Boy body ──
            ctx.fillStyle = GB_DARK;
            // Outer body (rounded-ish rectangle via multiple rects)
            ctx.fillRect(cx - 30, baseY, 60, 80);
            ctx.fillRect(cx - 28, baseY - 2, 56, 84);
            // Inner body highlight
            ctx.fillStyle = GB_LIGHT;
            ctx.fillRect(cx - 26, baseY + 2, 52, 76);

            // ── Screen bezel ──
            ctx.fillStyle = GB_DARKEST;
            ctx.fillRect(cx - 20, baseY + 6, 40, 32);
            // Screen inner (lighter green - the actual "screen")
            ctx.fillStyle = GB_LIGHTEST;
            ctx.fillRect(cx - 18, baseY + 8, 36, 28);

            // Power LED dot
            ctx.fillStyle = "#e03c28";
            ctx.fillRect(cx - 22, baseY + 8, 3, 3);

            // Screen content: pixel art smiley face
            ctx.fillStyle = GB_DARKEST;
            // Eyes
            ctx.fillRect(cx - 10, baseY + 16, 4, 4);
            ctx.fillRect(cx + 6, baseY + 16, 4, 4);
            // Mouth
            ctx.fillRect(cx - 8, baseY + 26, 2, 2);
            ctx.fillRect(cx - 6, baseY + 28, 12, 2);
            ctx.fillRect(cx + 6, baseY + 26, 2, 2);

            // ── D-Pad ──
            ctx.fillStyle = GB_DARKEST;
            // Horizontal bar
            ctx.fillRect(cx - 18, baseY + 46, 14, 5);
            // Vertical bar
            ctx.fillRect(cx - 14, baseY + 42, 5, 14);

            // ── A & B Buttons ──
            ctx.fillStyle = GB_DARKEST;
            // A button
            ctx.beginPath();
            ctx.arc(cx + 14, baseY + 47, 4, 0, Math.PI * 2);
            ctx.fill();
            // B button
            ctx.beginPath();
            ctx.arc(cx + 6, baseY + 52, 4, 0, Math.PI * 2);
            ctx.fill();

            // A/B labels
            ctx.fillStyle = GB_DARK;
            ctx.font = "4px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("A", cx + 14, baseY + 41);
            ctx.fillText("B", cx + 6, baseY + 56);

            // ── Start / Select ──
            ctx.fillStyle = GB_DARKEST;
            ctx.fillRect(cx - 8, baseY + 62, 6, 2);
            ctx.fillRect(cx + 2, baseY + 62, 6, 2);

            // ── Speaker grilles ──
            ctx.fillStyle = GB_DARK;
            for (let i = 0; i < 4; i++) {
                ctx.fillRect(cx + 12, baseY + 66 + i * 3, 10, 1);
            }

            // ── "ANIKET" text below console ──
            ctx.fillStyle = GB_DARKEST;
            ctx.font = "bold 11px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("A N I K E T", cx, baseY + 92);

            // Decorative line
            ctx.fillStyle = GB_DARK;
            ctx.fillRect(cx - 50, baseY + 100, 100, 1);

            // Subtitle
            ctx.fillStyle = GB_DARK;
            ctx.font = "bold 8px monospace";
            ctx.fillText("P O R T F O L I O", cx, baseY + 110);

            // ® mark
            ctx.strokeStyle = GB_DARK;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.arc(cx + 55, baseY + 110, 4, 0, Math.PI * 2);
            ctx.stroke();
            drawPixelText("TM", cx + 55, baseY + 110, GB_DARK, 4);

            ctx.restore();
        };

        // Animated particles for power-on effect
        const particles: { x: number; y: number; vy: number; size: number; alpha: number }[] = [];

        // Scanline noise effect
        const drawScanlines = (intensity: number) => {
            ctx.save();
            ctx.globalAlpha = intensity;
            for (let i = 0; i < h; i += 2) {
                ctx.fillStyle = "rgba(0,0,0,0.15)";
                ctx.fillRect(0, i, w, 1);
            }
            ctx.restore();
        };

        const animate = (now: number) => {
            if (skipRef.current) return;

            const elapsed = (now - startTime) / 1000;
            ctx.clearRect(0, 0, w, h);

            // ── Phase: BLACK (0 – 0.5s) ──
            if (elapsed < 0.5) {
                currentPhase = "black";
                ctx.fillStyle = "#000";
                ctx.fillRect(0, 0, w, h);

                // Random static noise
                if (elapsed > 0.2) {
                    const noiseIntensity = (elapsed - 0.2) / 0.3;
                    ctx.save();
                    ctx.globalAlpha = noiseIntensity * 0.3;
                    for (let i = 0; i < 50; i++) {
                        const nx = Math.random() * w;
                        const ny = Math.random() * h;
                        ctx.fillStyle = Math.random() > 0.5 ? GB_DARKEST : "#111";
                        ctx.fillRect(nx, ny, 2, 2);
                    }
                    ctx.restore();
                }
            }
            // ── Phase: POWER ON FLASH (0.5 – 1.2s) ──
            else if (elapsed < 1.2) {
                const t = (elapsed - 0.5) / 0.7;

                if (currentPhase !== "power") {
                    currentPhase = "power";
                    setPhase("power");

                    // Play boot chime directly (no user gesture needed since animation auto-plays)
                    try {
                        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
                        const playNote = (freq: number, dur: number, delay: number) => {
                            const osc = audioCtx.createOscillator();
                            const gain = audioCtx.createGain();
                            osc.type = "square";
                            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
                            gain.gain.setValueAtTime(0.06, audioCtx.currentTime + delay);
                            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + dur);
                            osc.connect(gain);
                            gain.connect(audioCtx.destination);
                            osc.start(audioCtx.currentTime + delay);
                            osc.stop(audioCtx.currentTime + delay + dur);
                        };
                        // Classic boot melody
                        playNote(262, 0.15, 0);
                        playNote(330, 0.15, 0.15);
                        playNote(392, 0.15, 0.3);
                        playNote(523, 0.25, 0.45);
                        playNote(659, 0.15, 0.75);
                        playNote(784, 0.3, 0.9);
                    } catch { /* Audio not supported */ }

                    // Create particles for power-on effect
                    for (let i = 0; i < 30; i++) {
                        particles.push({
                            x: w / 2 + (Math.random() - 0.5) * 100,
                            y: h / 2 + (Math.random() - 0.5) * 60,
                            vy: -1 - Math.random() * 2,
                            size: 1 + Math.random() * 3,
                            alpha: 0.5 + Math.random() * 0.5,
                        });
                    }
                }

                // Green wash
                const greenAlpha = t < 0.3 ? t / 0.3 : 1;
                ctx.fillStyle = GB_DARKEST;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.globalAlpha = greenAlpha * 0.6;
                ctx.fillStyle = GB_LIGHTEST;
                ctx.fillRect(0, 0, w, h);
                ctx.restore();

                // Particles floating up
                ctx.save();
                for (const p of particles) {
                    p.y += p.vy;
                    p.alpha -= 0.008;
                    if (p.alpha > 0) {
                        ctx.globalAlpha = p.alpha * (1 - t);
                        ctx.fillStyle = GB_LIGHTEST;
                        ctx.fillRect(p.x, p.y, p.size, p.size);
                    }
                }
                ctx.restore();

                drawScanlines(0.2);
            }
            // ── Phase: LOGO DROP (1.2 – 3.5s) ──
            else if (elapsed < 3.5) {
                const t = (elapsed - 1.2) / 2.3;

                if (currentPhase !== "logo") {
                    currentPhase = "logo";
                    setPhase("logo");
                }

                // Background
                ctx.fillStyle = GB_LIGHTEST;
                ctx.fillRect(0, 0, w, h);

                // Logo drops from top to center
                const logoTargetY = h / 2 - 10;
                const dropProgress = Math.min(t * 2, 1);
                // Ease out bounce
                const eased =
                    dropProgress < 0.6
                        ? (dropProgress / 0.6) * (dropProgress / 0.6)
                        : dropProgress < 0.8
                            ? 1 - (1 - ((dropProgress - 0.6) / 0.2)) * 0.15
                            : 1;
                const logoY = -40 + (logoTargetY + 40) * Math.min(eased, 1);

                const logoAlpha = Math.min(t * 3, 1);
                drawLogo(logoY, logoAlpha);

                // ® vertical lines animation (Game Boy original effect)
                if (t > 0.4) {
                    const lineProgress = (t - 0.4) / 0.3;
                    ctx.save();
                    ctx.globalAlpha = Math.min(lineProgress, 0.5);
                    ctx.fillStyle = GB_DARK;
                    ctx.fillRect(w / 2 - 1, 0, 2, logoY - 40);
                    ctx.restore();
                }

                drawScanlines(0.15);
            }
            // ── Phase: CARTRIDGE (3.5 – 5.5s) ──
            else if (elapsed < 5.5) {
                const t = (elapsed - 3.5) / 2;

                if (currentPhase !== "cartridge") {
                    currentPhase = "cartridge";
                    setPhase("cartridge");
                }

                ctx.fillStyle = GB_LIGHTEST;
                ctx.fillRect(0, 0, w, h);

                // Fade in cartridge text
                const fadeIn = Math.min(t * 2, 1);

                ctx.save();
                ctx.globalAlpha = fadeIn;

                // Cartridge frame
                ctx.fillStyle = GB_DARK;
                ctx.fillRect(w / 2 - 100, h / 2 - 70, 200, 140);
                ctx.fillStyle = GB_LIGHTEST;
                ctx.fillRect(w / 2 - 96, h / 2 - 66, 192, 132);
                ctx.fillStyle = GB_DARK;
                ctx.fillRect(w / 2 - 92, h / 2 - 62, 184, 124);
                ctx.fillStyle = GB_DARKEST;
                ctx.fillRect(w / 2 - 88, h / 2 - 58, 176, 116);

                // Cartridge label
                ctx.fillStyle = GB_LIGHTEST;
                ctx.font = "bold 12px monospace";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("ANIKET KUMAR SINGH", w / 2, h / 2 - 30);

                ctx.fillStyle = GB_LIGHT;
                ctx.font = "9px monospace";
                ctx.fillText("PORTFOLIO v2.0", w / 2, h / 2 - 10);

                // Decorative border
                ctx.strokeStyle = GB_LIGHT;
                ctx.lineWidth = 1;
                ctx.strokeRect(w / 2 - 80, h / 2 - 48, 160, 50);

                // Credits
                ctx.fillStyle = GB_LIGHT;
                ctx.font = "7px monospace";
                ctx.fillText("FULL-STACK DEVELOPER", w / 2, h / 2 + 18);
                ctx.fillText("& GAME DEV", w / 2, h / 2 + 30);

                // Year
                ctx.fillStyle = GB_LIGHTEST;
                ctx.font = "8px monospace";
                ctx.fillText("© 2026", w / 2, h / 2 + 48);

                ctx.restore();

                drawScanlines(0.12);
            }
            // ── Phase: READY (5.5 – 7.2s) ──
            else if (elapsed < 7.2) {
                const barDuration = 1.1;
                const t = Math.min((elapsed - 5.5) / barDuration, 1);

                if (currentPhase !== "ready") {
                    currentPhase = "ready";
                    setPhase("ready");
                }

                ctx.fillStyle = "#000";
                ctx.fillRect(0, 0, w, h);

                // "PRESS START" blink
                const blink = Math.sin(elapsed * 6) > 0;
                if (blink) {
                    ctx.fillStyle = GB_LIGHTEST;
                    ctx.font = "bold 14px monospace";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText("PRESS START", w / 2, h / 2 - 10);
                }

                // Loading bar
                ctx.fillStyle = GB_DARK;
                ctx.fillRect(w / 2 - 60, h / 2 + 20, 120, 8);
                ctx.fillStyle = GB_LIGHTEST;
                ctx.fillRect(w / 2 - 58, h / 2 + 22, t * 116, 4);

                drawPixelText(t >= 1 ? "READY!" : "LOADING...", w / 2, h / 2 + 40, GB_DARK, 7);

                drawScanlines(0.1);
            }
            // ── Done ──
            else {
                finishBoot();
                return;
            }

            animFrameRef.current = requestAnimationFrame(animate);
        };

        animFrameRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animFrameRef.current);
    }, [finishBoot]);

    return (
        <div className={styles.boot} role="status" aria-label="Loading portfolio">
            <div className={styles.screenFrame}>
                <canvas
                    ref={canvasRef}
                    className={styles.canvas}
                    aria-hidden="true"
                />
                {/* CRT overlay */}
                <div className={styles.crtOverlay} />
            </div>

            <div className={styles.skipHint}>
                <span>PRESS ANY KEY or CLICK TO SKIP</span>
            </div>

            <div className={styles.powerIndicator}>
                <div className={`${styles.powerDot} ${phase !== "black" ? styles.powerOn : ""}`} />
                <span>POWER</span>
            </div>
        </div>
    );
}
