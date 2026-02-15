"use client";

import {
    Heart, Sword, Shield, Zap, Crosshair, Clover,
    Package, Wand2, Backpack,
    Github, Linkedin, Mail, Phone, Instagram,
    Trophy, Star, Gamepad2, Rocket,
    Palette, Music, Coffee, BookOpen,
    Lock, Play, Code, Hourglass, Save,
    Home, FolderKanban, User, Send,
    Film, Dribbble, PenTool, Camera, Puzzle, Flame,
    type LucideProps,
} from "lucide-react";
import { type FC } from "react";

const iconMap: Record<string, FC<LucideProps>> = {
    // RPG stats
    heart: Heart,
    sword: Sword,
    shield: Shield,
    bolt: Zap,
    crosshair: Crosshair,
    clover: Clover,
    // Categories
    chest: Package,
    wand: Wand2,
    backpack: Backpack,
    // Social
    github: Github,
    linkedin: Linkedin,
    mail: Mail,
    phone: Phone,
    instagram: Instagram,
    // Achievements
    trophy: Trophy,
    star: Star,
    gamepad: Gamepad2,
    rocket: Rocket,
    // Hobbies
    palette: Palette,
    music: Music,
    coffee: Coffee,
    book: BookOpen,
    film: Film,
    football: Dribbble,
    writing: PenTool,
    camera: Camera,
    puzzle: Puzzle,
    flame: Flame,
    // UI
    lock: Lock,
    play: Play,
    code: Code,
    hourglass: Hourglass,
    save: Save,
    // Nav
    home: Home,
    folder: FolderKanban,
    user: User,
    send: Send,
};

interface PixelIconProps {
    name: string;
    size?: number;
    color?: string;
    className?: string;
    strokeWidth?: number;
}

export default function PixelIcon({
    name,
    size = 16,
    color = "currentColor",
    className = "",
    strokeWidth = 1.75,
}: PixelIconProps) {
    const IconComponent = iconMap[name];

    if (!IconComponent) {
        return (
            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: size,
                    height: size,
                    fontSize: size * 0.6,
                    color,
                    fontFamily: "monospace",
                }}
                className={className}
            >
                {name.slice(0, 2).toUpperCase()}
            </span>
        );
    }

    return (
        <IconComponent
            size={size}
            color={color}
            strokeWidth={strokeWidth}
            className={className}
            style={{ flexShrink: 0 }}
        />
    );
}
