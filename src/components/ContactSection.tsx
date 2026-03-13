"use client";

import { useState, useEffect, useRef, type FormEvent, useCallback } from "react";
import styles from "./ContactSection.module.css";
import PixelIcon from "./PixelIcon";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const socialLinks = [
    { name: "GitHub", icon: "github", url: "https://github.com", handle: "@aniket" },
    { name: "LinkedIn", icon: "linkedin", url: "https://linkedin.com", handle: "/in/aniket" },
    { name: "Email", icon: "mail", url: "mailto:contactwaniket@gmail.com", handle: "contactwaniket@gmail.com" },
    { name: "Instagram", icon: "instagram", url: "https://instagram.com/aniket", handle: "@aniket" },
];

export default function ContactSection() {
    const [formState, setFormState] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [coinInserted, setCoinInserted] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const loadGsap = () => {
            gsap.registerPlugin(ScrollTrigger);

            const section = sectionRef.current;
            if (!section) return;

            // GAME OVER text — dramatic entrance
            const gameOver = section.querySelector(`.${styles.gameOverText}`);
            if (gameOver) {
                gsap.fromTo(
                    gameOver,
                    { opacity: 0, scale: 0.3, rotationX: 90, y: -30 },
                    {
                        opacity: 1, scale: 1, rotationX: 0, y: 0,
                        duration: 1.2, ease: "elastic.out(1, 0.4)",
                        scrollTrigger: { trigger: gameOver, start: "top 80%" },
                    }
                );
            }

            // Continue prompt slide in
            const continuePrompt = section.querySelector(`.${styles.continuePrompt}`);
            if (continuePrompt) {
                gsap.fromTo(continuePrompt, { opacity: 0, y: 20 }, {
                    opacity: 1, y: 0,
                    duration: 0.6, ease: "power2.out",
                    scrollTrigger: { trigger: continuePrompt, start: "top 85%" },
                    delay: 0.3,
                });
            }

            // Form card entrance
            const form = section.querySelector(`.${styles.form}`);
            if (form) {
                gsap.fromTo(form, { opacity: 0, y: 40, scale: 0.95 }, {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.7, ease: "power3.out",
                    scrollTrigger: { trigger: form, start: "top 80%" },
                });
            }

            // Social links stagger
            const socials = section.querySelectorAll(`.${styles.socialItem}`);
            socials.forEach((item, i) => {
                gsap.fromTo(
                    item,
                    { opacity: 0, y: 25, scale: 0.8 },
                    {
                        opacity: 1, y: 0, scale: 1,
                        duration: 0.5, ease: "back.out(2.5)",
                        scrollTrigger: { trigger: item, start: "top 90%" },
                        delay: i * 0.1,
                    }
                );
            });

            // Footer credits fade-up
            const footer = section.querySelector(`.${styles.footer}`);
            if (footer) {
                gsap.fromTo(footer, { opacity: 0, y: 20 }, {
                    opacity: 1, y: 0,
                    duration: 0.6, ease: "power2.out",
                    scrollTrigger: { trigger: footer, start: "top 95%" },
                });
            }
        };

        loadGsap();
    }, []);

    const validate = useCallback(() => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "PLAYER NAME REQUIRED!";
        if (!formData.email.trim()) newErrors.email = "EMAIL REQUIRED!";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "INVALID EMAIL FORMAT!";
        if (!formData.message.trim()) newErrors.message = "MESSAGE REQUIRED!";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setCoinInserted(true);
        setFormState("sending");

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setFormState("success");
            setFormData({ name: "", email: "", message: "" });
            
            setTimeout(() => {
                setFormState("idle");
                setCoinInserted(false);
            }, 4000);
        } catch (error) {
            console.error("Email error:", error);
            setFormState("error");
            setCoinInserted(false);
            
            setTimeout(() => {
                setFormState("idle");
            }, 4000);
        }
    }, [formData, validate]);

    return (
        <section id="contact" className={`section ${styles.contact}`} ref={sectionRef}>
            <div className="section-content">
                <span className="section-world">World 5</span>

                {/* Game Over Banner */}
                <div className={styles.gameOver}>
                    <h2 className={styles.gameOverText}>GAME OVER</h2>
                    <div className={styles.gameOverSub}>
                        <span className={styles.scoreText}>FINAL SCORE: 999,999</span>
                    </div>
                </div>

                <div className={styles.continuePrompt}>
                    <p className={styles.continueText}>CONTINUE?</p>
                    <div className={styles.continueOptions}>
                        <span className={styles.optionActive}>▶ YES</span>
                        <span className={styles.optionInactive}>&nbsp;&nbsp;NO</span>
                    </div>
                </div>

                <p className={styles.insertCoin}>
                    INSERT COIN TO CONTINUE ↓
                </p>

                {/* Coin Slot Animation */}
                {coinInserted && (
                    <div className={styles.coinSlot}>
                        <div className={styles.coin}>
                            <PixelIcon name="star" size={16} color="var(--gbc-gold)" />
                        </div>
                    </div>
                )}

                {/* Contact Form */}
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formHeader}>
                        <span className={styles.formTitle}>
                            <PixelIcon name="mail" size={14} color="var(--gbc-gold)" /> SEND MESSAGE
                        </span>
                        <span className={styles.formCredits}>CREDITS: ∞</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            NAME:
                        </label>
                        <input
                            id="name"
                            type="text"
                            className={`form-input ${errors.name ? "error" : ""}`}
                            placeholder="Enter your name..."
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                        {errors.name && (
                            <span className="form-error">
                                <PixelIcon name="crosshair" size={10} color="var(--gbc-red)" /> {errors.name}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            EMAIL:
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={`form-input ${errors.email ? "error" : ""}`}
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                        {errors.email && (
                            <span className="form-error">
                                <PixelIcon name="crosshair" size={10} color="var(--gbc-red)" /> {errors.email}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="message" className="form-label">
                            MESSAGE:
                        </label>
                        <textarea
                            id="message"
                            className={`form-input ${errors.message ? "error" : ""}`}
                            placeholder="Write your message..."
                            value={formData.message}
                            onChange={(e) =>
                                setFormData({ ...formData, message: e.target.value })
                            }
                            rows={5}
                        />
                        {errors.message && (
                            <span className="form-error">
                                <PixelIcon name="crosshair" size={10} color="var(--gbc-red)" /> {errors.message}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`btn btn-primary ${styles.submitBtn} ${formState === "success" ? styles.submitSuccess : ""
                            }`}
                        disabled={formState === "sending"}
                    >
                        {formState === "sending" ? (
                            <><PixelIcon name="hourglass" size={14} color="currentColor" /> TRANSMITTING...</>
                        ) : formState === "success" ? (
                            <><PixelIcon name="star" size={14} color="currentColor" /> MESSAGE SENT! +100 XP</>
                        ) : (
                            <><PixelIcon name="play" size={14} color="currentColor" /> INSERT COIN TO SEND</>
                        )}
                    </button>

                    {formState === "error" && (
                        <p className={styles.errorMsg}>CONNECTION FAILED. TRY AGAIN?</p>
                    )}

                    {formState === "success" && (
                        <div className={styles.successMsg}>
                            <span>QUEST COMPLETE! Your message has been transmitted.</span>
                        </div>
                    )}
                </form>

                {/* Social Links */}
                <div className={styles.socials}>
                    <span className={styles.socialsLabel}>OR FIND ME AT:</span>
                    <div className={styles.socialLinks}>
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialItem}
                                aria-label={link.name}
                            >
                                <span className={styles.socialIcon}>
                                    <PixelIcon name={link.icon} size={22} color="var(--gb-light)" />
                                </span>
                                <span className={styles.socialName}>{link.name}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer className={styles.footer}>
                    <div className={styles.credits}>
                        <p className={styles.creditsTitle}>CREDITS</p>
                        <p className={styles.creditLine}>
                            Designed & Developed by Aniket Kumar Singh
                        </p>
                        <p className={styles.creditLine}>
                            Powered by caffeine, pixels, and nostalgia
                        </p>
                        <p className={styles.creditLine}>© 2026 — All Rights Reserved</p>
                    </div>
                    <div className={styles.konami}>
                        <span>↑ ↑ ↓ ↓ ← → ← → B A START</span>
                        <span className={styles.konamiHint}>(Try the Konami code)</span>
                    </div>
                </footer>
            </div>
        </section>
    );
}
