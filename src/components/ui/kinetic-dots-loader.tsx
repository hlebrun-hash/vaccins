'use client';

import { cn } from "@/lib/utils";

export default function KineticDotsLoader() {
    const dots = 3; // 3 dots is usually enough for a loading state to feel snappy

    return (
        <div className='flex items-center justify-center min-h-[200px] p-8 w-full'>
            <div className='flex gap-4'>
                {[...Array(dots)].map((_, i) => (
                    <div
                        key={i}
                        className='relative flex flex-col items-center justify-end h-16 w-6'
                    >
                        {/* 1. THE BOUNCING DOT */}
                        <div
                            className='relative w-4 h-4 z-10'
                            style={{
                                animation: 'gravity-bounce 0.6s cubic-bezier(0.17, 0.67, 0.83, 0.67) infinite alternate',
                                animationDelay: `${i * 0.1}s`,
                                willChange: 'transform'
                            }}
                        >
                            <div
                                className='w-full h-full rounded-full bg-gradient-to-b from-emerald-300 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                style={{
                                    // Simplified morph for cleaner look
                                    willChange: 'transform'
                                }}
                            />
                        </div>

                        {/* 3. REFLECTIVE SHADOW */}
                        <div
                            className='absolute -bottom-1 w-4 h-1 rounded-[100%] bg-emerald-500/20 blur-[2px]'
                            style={{
                                animation: 'shadow-breathe 0.6s cubic-bezier(0.17, 0.67, 0.83, 0.67) infinite alternate',
                                animationDelay: `${i * 0.1}s`,
                            }}
                        />
                    </div>
                ))}
            </div>

            <style jsx>{`
        @keyframes gravity-bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-24px); }
        }

        @keyframes shadow-breathe {
          from { transform: scale(1); opacity: 0.6; }
          to { transform: scale(0.5); opacity: 0.2; }
        }
      `}</style>
        </div>
    )
}
