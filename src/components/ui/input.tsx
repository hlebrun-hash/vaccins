"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
    value: string;
    className?: string;
}

const containerVariants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const letterVariants = {
    initial: {
        y: 0,
        color: "inherit",
    },
    animate: {
        y: "-120%",
        color: "#059669", // emerald-600
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 20,
        },
    },
};

export const Input = ({
    label,
    icon,
    className = "",
    value,
    ...props
}: InputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const showLabel = isFocused || value.length > 0;

    return (
        <div className={cn("relative", className)}>
            <motion.div

                variants={containerVariants}
                initial="initial"
                animate={showLabel ? "animate" : "initial"}
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none text-slate-700 font-medium flex items-center text-sm"
            >
                {icon && (
                    <motion.span
                        className="mr-2 flex items-center -mb-0.5"
                        variants={letterVariants}
                    >
                        {icon}
                    </motion.span>
                )}
                {label.split("").map((char, index) => (
                    <motion.span
                        key={index}
                        className="inline-block"
                        variants={letterVariants}
                        style={{ willChange: "transform" }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </motion.div>

            <input
                type="text"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                value={value}
                {...props}
                className="outline-none border-b-2 border-slate-300 dark:border-slate-700 py-2 w-full text-base font-medium text-slate-700 bg-transparent placeholder-transparent focus:border-emerald-500 transition-colors"
            />
        </div>
    );
};
