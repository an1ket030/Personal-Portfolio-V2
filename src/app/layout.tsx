import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Press_Start_2P, Silkscreen } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-body",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

const pressStart2P = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-pixel",
    display: "swap",
});

const silkscreen = Silkscreen({
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--font-pixel-small",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Game Boy Portfolio | Full-Stack Developer",
    description:
        "A vintage Game Boy-themed creative portfolio showcasing projects, skills, and experience through an interactive retro gaming experience.",
    keywords: ["portfolio", "developer", "game boy", "retro", "creative", "full-stack"],
    authors: [{ name: "Developer" }],
    openGraph: {
        title: "Game Boy Portfolio | Full-Stack Developer",
        description:
            "A vintage Game Boy-themed creative portfolio showcasing projects, skills, and experience.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${inter.variable} ${jetbrainsMono.variable} ${pressStart2P.variable} ${silkscreen.variable}`}
        >
            <body>{children}</body>
        </html>
    );
}
