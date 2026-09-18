"use client";

import { motion } from "framer-motion";
import type { RipenessResult } from "@/lib/types";

interface Props {
  result: RipenessResult;
  size?: number;
}

export default function RipenessGauge({ result, size = 200 }: Props) {
  const { score, level, color } = result;

  const cx = size / 2;
  const cy = size / 2 + 10;
  const r = size / 2 - 20;
  const startAngle = Math.PI;
  const endAngle = 0;
  const scoreAngle = startAngle - (score / 100) * Math.PI;

  const arcPath = (angle: number) => {
    const x = cx + r * Math.cos(angle);
    const y = cy - r * Math.sin(angle);
    return `${x} ${y}`;
  };

  const bgArc = `M ${arcPath(startAngle)} A ${r} ${r} 0 0 1 ${arcPath(endAngle)}`;
  const scoreArc = `M ${arcPath(startAngle)} A ${r} ${r} 0 ${score > 50 ? 1 : 0} 1 ${arcPath(scoreAngle)}`;

  const circumference = Math.PI * r;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 40} viewBox={`0 0 ${size} ${size / 2 + 40}`}>
        {/* Background arc */}
        <path d={bgArc} fill="none" stroke="#e5e7eb" strokeWidth={14} strokeLinecap="round" />

        {/* Score arc */}
        <motion.path
          d={scoreArc}
          fill="none"
          stroke={color}
          strokeWidth={14}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Score text */}
        <text
          x={cx}
          y={cy - 15}
          textAnchor="middle"
          className="fill-gray-900 text-3xl font-bold"
          style={{ fontSize: size * 0.18 }}
        >
          {score}
        </text>

        {/* Level label */}
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fill={color}
          className="font-semibold"
          style={{ fontSize: size * 0.08 }}
        >
          {level}
        </text>

        {/* Min/Max labels */}
        <text x={20} y={cy + 25} className="fill-gray-400" style={{ fontSize: 10 }}>
          0
        </text>
        <text x={size - 28} y={cy + 25} className="fill-gray-400" style={{ fontSize: 10 }}>
          100
        </text>
      </svg>
    </div>
  );
}
