import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import "./App.css";

type BoxCfg = {
    id: number;
    src: string;
    x: number;
    size: number;
    duration: number;
    delay: number;
    rot: number;
};

const SPRITES = ["/img/boxone.png", "/img/boxtwo.png", "/img/boxthree.png"]; // in public/img/

function rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export default function BoxesRain() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [dims, setDims] = useState({ w: 0, h: 0 });

    useEffect(() => {
        const measure = () => {
            const el = wrapRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            setDims({ w: rect.width, h: rect.height });
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    const boxes: BoxCfg[] = useMemo(() => {
        const count = 10;
        return Array.from({ length: count }, (_, i) => {
            const size = Math.round(rand(64, 120));               // varied sizes
            return {
                id: i,
                src: SPRITES[Math.floor(rand(0, SPRITES.length))],
                x: Math.round(rand(0, Math.max(0, window.innerWidth - size))), // fallback; will reflow after measure
                size,
                duration: rand(2.5, 4.5),                           // different speeds
                delay: rand(0, 1.2),                                // staggered starts
                rot: rand(120, 420),                                // spin amount per fall
            };
        });
    }, []);

    const adjusted = boxes.map(b => {
        const xMax = Math.max(0, dims.w - b.size);
        return { ...b, x: Math.min(b.x, xMax) };
    });
    return (
        <div
            ref={wrapRef}
            className="relative h-screen w-full overflow-hidden"
        >
            <div className="text-[120px] font-bold">
                <p>Where are</p>
                <p>All Your</p>
                <p className="font-extrabold text-[#D4A373]">Packages</p>
                <p>at?</p>
            </div>

            {adjusted.map(b => {
                const bottomY = Math.max(0, dims.h - b.size - 8);
                const rebound = Math.min(40, Math.round(b.size * 0.25));

                return (
                    <>
                        <motion.img
                            key={b.id}
                            src={b.src}
                            alt=""
                            className="absolute select-none"
                            style={{
                                width: b.size,
                                height: b.size,
                                left: b.x,
                                top: -b.size * 1.2,
                            }}
                            initial={{ y: 0, rotate: 0, scaleY: 1 }}
                            animate={{
                                y: [0, bottomY, bottomY - rebound, bottomY],
                                rotate: [0, b.rot],
                                scaleY: [1, 1, 0.9, 1],
                            }}
                            transition={{
                                y: {
                                    duration: b.duration,
                                    ease: [0.2, 0.8, 0.2, 1],
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: b.delay,
                                },
                                rotate: {
                                    duration: b.duration,
                                    ease: "linear",
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: b.delay * 0.7,
                                },
                                scaleY: {
                                    times: [0, 0.9, 0.97, 1],
                                    duration: b.duration,
                                    ease: "easeOut",
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: b.delay,
                                },
                            }}
                            draggable={false}
                        />
                    </>
                );
            })}
        </div>
    );
}
