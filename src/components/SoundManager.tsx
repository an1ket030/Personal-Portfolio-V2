"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./SoundManager.module.css";
import PixelIcon from "./PixelIcon";

// Web Audio API-based retro sound synthesizer
function createAudioCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
        return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
        return null;
    }
}

function playTone(
    ctx: AudioContext,
    freq: number,
    duration: number,
    type: OscillatorType = "square",
    volume = 0.08,
    delay = 0
) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
}

// ── SFX Presets ──

function sfxBoot(ctx: AudioContext) {
    // Classic Game Boy boot chime melody
    const melody = [
        { freq: 262, dur: 0.15, delay: 0 },
        { freq: 330, dur: 0.15, delay: 0.15 },
        { freq: 392, dur: 0.15, delay: 0.3 },
        { freq: 523, dur: 0.25, delay: 0.45 },
        { freq: 659, dur: 0.15, delay: 0.75 },
        { freq: 784, dur: 0.3, delay: 0.9 },
    ];
    melody.forEach(({ freq, dur, delay }) => {
        playTone(ctx, freq, dur, "square", 0.06, delay);
    });
}

function sfxNavigate(ctx: AudioContext) {
    playTone(ctx, 880, 0.08, "square", 0.06);
    setTimeout(() => playTone(ctx, 1100, 0.06, "square", 0.04), 50);
}

function sfxClick(ctx: AudioContext) {
    playTone(ctx, 660, 0.06, "square", 0.05);
    setTimeout(() => playTone(ctx, 880, 0.06, "square", 0.04), 40);
}

function sfxCoin(ctx: AudioContext) {
    playTone(ctx, 988, 0.08, "square", 0.06);
    setTimeout(() => playTone(ctx, 1319, 0.12, "square", 0.05), 60);
}

function sfxScroll(ctx: AudioContext) {
    playTone(ctx, 200, 0.15, "triangle", 0.03);
}

function sfxSubmit(ctx: AudioContext) {
    playTone(ctx, 523, 0.1, "square", 0.06);
    setTimeout(() => playTone(ctx, 659, 0.1, "square", 0.06), 100);
    setTimeout(() => playTone(ctx, 784, 0.15, "square", 0.06), 200);
}

function sfxKonami(ctx: AudioContext) {
    const notes = [523, 587, 659, 784, 880, 1047];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(ctx, freq, 0.12, "square", 0.05), i * 80);
    });
}

export type SfxType = "navigate" | "scroll" | "submit" | "konami" | "boot" | "click" | "coin";

const SFX_EVENT = "portfolio-sfx";

export function triggerSfx(type: SfxType) {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(SFX_EVENT, { detail: type }));
    }
}

export default function SoundManager() {
    const [enabled, setEnabled] = useState(true); // ON by default
    const ctxRef = useRef<AudioContext | null>(null);
    const lastScrollSection = useRef("");
    const bootPlayed = useRef(false);

    // Load preference (defaults to on)
    useEffect(() => {
        const saved = localStorage.getItem("portfolio-sound");
        if (saved === "off") setEnabled(false);
    }, []);

    // Init AudioContext on enable
    useEffect(() => {
        if (enabled && !ctxRef.current) {
            ctxRef.current = createAudioCtx();
        }
        localStorage.setItem("portfolio-sound", enabled ? "on" : "off");
    }, [enabled]);

    // Boot sound is now handled by BootSequence directly

    // Global button click SFX
    useEffect(() => {
        if (!enabled) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Play click sfx for buttons and links
            if (
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a")
            ) {
                if (ctxRef.current) sfxClick(ctxRef.current);
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [enabled]);

    // Listen for SFX events from other components
    useEffect(() => {
        const handler = (e: Event) => {
            const ctx = ctxRef.current;
            if (!ctx || !enabled) return;

            const type = (e as CustomEvent).detail as SfxType;
            switch (type) {
                case "navigate": sfxNavigate(ctx); break;
                case "scroll": sfxScroll(ctx); break;
                case "submit": sfxSubmit(ctx); break;
                case "konami": sfxKonami(ctx); break;
                case "boot": sfxBoot(ctx); break;
                case "click": sfxClick(ctx); break;
                case "coin": sfxCoin(ctx); break;
            }
        };

        window.addEventListener(SFX_EVENT, handler);
        return () => window.removeEventListener(SFX_EVENT, handler);
    }, [enabled]);

    // Section scroll sfx
    useEffect(() => {
        if (!enabled) return;

        const handleScroll = () => {
            const sections = ["hero", "projects", "skills", "about", "contact"];
            for (let i = sections.length - 1; i >= 0; i--) {
                const el = document.getElementById(sections[i]);
                if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
                    if (lastScrollSection.current !== sections[i]) {
                        lastScrollSection.current = sections[i];
                        if (ctxRef.current) sfxScroll(ctxRef.current);
                    }
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [enabled]);

    const toggle = useCallback(() => {
        setEnabled((prev) => {
            const next = !prev;
            if (next) {
                if (!ctxRef.current) {
                    ctxRef.current = createAudioCtx();
                }
                ctxRef.current?.resume();
                if (ctxRef.current) {
                    playTone(ctxRef.current, 660, 0.08, "square", 0.05);
                    setTimeout(() => {
                        if (ctxRef.current) playTone(ctxRef.current, 880, 0.1, "square", 0.05);
                    }, 80);
                }
            }
            return next;
        });
    }, []);

    return (
        <button
            className={`${styles.toggle} ${enabled ? styles.toggleOn : ""}`}
            onClick={toggle}
            aria-label={enabled ? "Mute sound" : "Enable sound"}
            title={enabled ? "Sound ON — Click to mute" : "Sound OFF — Click to enable"}
        >
            <PixelIcon
                name={enabled ? "music" : "music"}
                size={14}
                color={enabled ? "var(--gbc-gold)" : "var(--color-text-muted)"}
            />
            {enabled && <span className={styles.pulse} />}
        </button>
    );
}
