"use client";

import { useEffect, useRef, useCallback } from "react";
import { triggerSfx } from "./SoundManager";

/**
 * Easter Eggs Component — Light, fun hidden interactions:
 * 1. Konami Code (↑↑↓↓←→←→BA) → Screen glitch + secret message
 * 2. Click the page title/name 7 times → Retro "Level Up!" toast
 * 3. Console ASCII art greeting
 */

export default function EasterEggs() {
    const konamiProgress = useRef(0);
    const nameClickCount = useRef(0);
    const nameClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── 1. Konami Code ──
    const konamiCode = [
        "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
        "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
        "b", "a",
    ];

    const triggerKonamiEffect = useCallback(() => {
        triggerSfx("konami");

        // Screen glitch
        document.body.style.animation = "none";
        const glitch = document.createElement("div");
        glitch.style.cssText = `
            position: fixed; inset: 0; z-index: 99999;
            background: transparent; pointer-events: none;
            animation: easterGlitch 0.6s ease-out forwards;
        `;
        document.body.appendChild(glitch);

        // Secret message toast
        const toast = document.createElement("div");
        toast.style.cssText = `
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0.5);
            z-index: 100000; padding: 24px 40px;
            background: rgba(10, 10, 20, 0.95);
            border: 2px solid #8bac0f;
            border-radius: 12px;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.7rem; color: #9bbc0f;
            text-align: center; line-height: 2;
            box-shadow: 0 0 40px rgba(139, 172, 15, 0.3);
            opacity: 0;
            transition: all 0.3s ease-out;
        `;
        toast.innerHTML = `
            ★ SECRET UNLOCKED ★<br>
            <span style="color: #f0b429; font-size: 0.5rem;">
                You found the Konami Code!<br>
                +30 XP • Achievement Unlocked
            </span>
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translate(-50%, -50%) scale(1)";
        });

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translate(-50%, -50%) scale(0.8)";
            setTimeout(() => { toast.remove(); glitch.remove(); }, 400);
        }, 3000);
    }, []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === konamiCode[konamiProgress.current]) {
                konamiProgress.current++;
                if (konamiProgress.current === konamiCode.length) {
                    konamiProgress.current = 0;
                    triggerKonamiEffect();
                }
            } else {
                konamiProgress.current = 0;
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [triggerKonamiEffect]);

    // ── 2. Name click → Level Up ──
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if user clicked on the hero name (h1)
            if (target.closest("h1") && target.closest("#hero")) {
                nameClickCount.current++;

                if (nameClickTimer.current) clearTimeout(nameClickTimer.current);
                nameClickTimer.current = setTimeout(() => {
                    nameClickCount.current = 0;
                }, 2000);

                if (nameClickCount.current >= 7) {
                    nameClickCount.current = 0;
                    triggerSfx("submit");

                    const toast = document.createElement("div");
                    toast.style.cssText = `
                        position: fixed; bottom: 40px; left: 50%;
                        transform: translateX(-50%) translateY(20px);
                        z-index: 100000; padding: 12px 24px;
                        background: linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(20, 184, 166, 0.9));
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 8px;
                        font-family: 'Press Start 2P', monospace;
                        font-size: 0.5rem; color: white;
                        text-align: center;
                        box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
                        opacity: 0;
                        transition: all 0.3s ease-out;
                    `;
                    toast.textContent = "🎮 LEVEL UP! You found an easter egg!";
                    document.body.appendChild(toast);

                    requestAnimationFrame(() => {
                        toast.style.opacity = "1";
                        toast.style.transform = "translateX(-50%) translateY(0)";
                    });

                    setTimeout(() => {
                        toast.style.opacity = "0";
                        toast.style.transform = "translateX(-50%) translateY(20px)";
                        setTimeout(() => toast.remove(), 400);
                    }, 2500);
                }
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    // ── 3. Console ASCII art ──
    useEffect(() => {
        const style = "color: #8bac0f; font-family: monospace; font-size: 12px;";
        const accent = "color: #f0b429; font-family: monospace; font-size: 10px;";

        console.log(
            `%c
 ╔═══════════════════════════════════╗
 ║   ★ ANIKET'S PORTFOLIO v2.0 ★    ║
 ║                                   ║
 ║   Crafted with 🎮 & ☕            ║
 ║   Next.js • GSAP • Web Audio     ║
 ║                                   ║
 ║   Try the Konami Code! ;)         ║
 ╚═══════════════════════════════════╝
`, style);
        console.log(
            "%c   ↑↑↓↓←→←→BA for a surprise...",
            accent
        );
    }, []);

    // Inject keyframe for glitch effect
    useEffect(() => {
        const styleEl = document.createElement("style");
        styleEl.textContent = `
            @keyframes easterGlitch {
                0% { box-shadow: inset 0 0 0 2px #8bac0f; }
                10% { box-shadow: inset -3px 0 0 2px #ff0000, inset 3px 0 0 2px #00ffff; }
                20% { box-shadow: inset 2px 0 0 2px #ff0000, inset -2px 0 0 2px #00ffff; }
                30% { box-shadow: inset 0 0 0 2px #8bac0f; }
                40% { box-shadow: inset -1px 0 0 2px #ff0000, inset 1px 0 0 2px #00ffff; }
                50% { box-shadow: inset 0 0 0 0 transparent; }
                100% { box-shadow: inset 0 0 0 0 transparent; }
            }
        `;
        document.head.appendChild(styleEl);
        return () => styleEl.remove();
    }, []);

    return null; // No visual output — all effects are injected via DOM
}
