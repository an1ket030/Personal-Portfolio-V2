"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import styles from "./KonamiEaster.module.css";

const KONAMI_CODE = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "b", "a",
];

export default function KonamiEaster() {
    const [activated, setActivated] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const inputRef = useRef<string[]>([]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (activated) return;

        inputRef.current.push(e.key);
        // Keep only last N keys
        if (inputRef.current.length > KONAMI_CODE.length) {
            inputRef.current = inputRef.current.slice(-KONAMI_CODE.length);
        }

        // Check for match
        if (
            inputRef.current.length === KONAMI_CODE.length &&
            inputRef.current.every((key, i) => key.toLowerCase() === KONAMI_CODE[i].toLowerCase())
        ) {
            setActivated(true);
            setShowBanner(true);

            // Add rainbow mode class to body
            document.body.classList.add("konami-active");

            setTimeout(() => setShowBanner(false), 6000);
        }
    }, [activated]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    if (!showBanner) return null;

    return (
        <div className={styles.banner} aria-live="polite">
            <div className={styles.bannerInner}>
                <div className={styles.bannerTitle}>★ SECRET UNLOCKED ★</div>
                <div className={styles.bannerText}>
                    You found the Konami code! +9999 XP
                </div>
                <div className={styles.bannerStars}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <span
                            key={i}
                            className={styles.floatingStar}
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`,
                            }}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
