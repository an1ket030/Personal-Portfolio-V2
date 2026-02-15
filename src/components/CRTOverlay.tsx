"use client";

import { useEffect, useState } from "react";
import styles from "./CRTOverlay.module.css";

export default function CRTOverlay() {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mq.matches);
        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    if (reducedMotion) return null;

    return (
        <div className={styles.overlay} aria-hidden="true">
            <div className={styles.scanlines} />
            <div className={styles.vignette} />
            <div className={styles.flicker} />
        </div>
    );
}
