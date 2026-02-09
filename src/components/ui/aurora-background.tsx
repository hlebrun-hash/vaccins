"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children: ReactNode;
    showRadialGradient?: boolean;
}

export const AuroraBackground = ({
    className,
    children,
    showRadialGradient = true,
    ...props
}: AuroraBackgroundProps) => {
    return (
        <main className="w-full">
            <div
                className={cn(
                    "relative flex flex-col min-h-screen min-h-[100dvh] items-center justify-center bg-cream dark:bg-ink text-ink transition-bg overflow-hidden",
                    className
                )}
                {...props}
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className={cn(
                            `
            [--white-gradient:repeating-linear-gradient(100deg,var(--color-cream)_0%,var(--color-cream)_7%,transparent_10%,transparent_12%,var(--color-cream)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[12px]
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:mix-blend-multiply dark:after:mix-blend-difference
            absolute -inset-[10px] opacity-70 will-change-transform transform-gpu`,

                            showRadialGradient &&
                            `[mask-image:radial-gradient(ellipse_at_100%_0%,black_30%,var(--transparent)_70%)] [webkit-mask-image:radial-gradient(ellipse_at_100%_0%,black_30%,var(--transparent)_70%)]`
                        )}
                    ></div>
                </div>
                <div className="relative z-10 w-full flex flex-col items-center">
                    {children}
                </div>
            </div>
        </main>
    );
};
