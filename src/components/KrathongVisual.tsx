import React from 'react';
import { CANDLE_COLORS } from '../data/krathongOptions';

interface KrathongVisualProps {
  baseId: string;
  candleColorId: string;
  flowers?: string[];
  includeCoins?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
  waterReflection?: boolean;
}

export const KrathongVisual: React.FC<KrathongVisualProps> = ({
  baseId,
  candleColorId,
  flowers = ['marigold'],
  includeCoins = true,
  size = 'md',
  animated = true,
  className = '',
  waterReflection = true,
}) => {
  const candleConfig = CANDLE_COLORS.find((c) => c.id === candleColorId) || CANDLE_COLORS[0];

  const sizeDimensions = {
    xs: { width: 52, height: 44, scale: 0.26 },
    sm: { width: 88, height: 74, scale: 0.44 },
    md: { width: 160, height: 135, scale: 0.8 },
    lg: { width: 220, height: 185, scale: 1.1 },
    xl: { width: 280, height: 235, scale: 1.4 },
  }[size];

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${
        animated ? 'animate-water-bob' : ''
      } ${className}`}
      style={{
        width: `${sizeDimensions.width}px`,
        height: `${sizeDimensions.height}px`,
      }}
    >
      <svg
        viewBox="0 0 200 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
      >
        <defs>
          {/* Flame Glow Radial */}
          <radialGradient id={`flame-glow-${candleConfig.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={candleConfig.candleColor} stopOpacity="0.9" />
            <stop offset="40%" stopColor={candleConfig.flameColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={candleConfig.flameColor} stopOpacity="0" />
          </radialGradient>

          {/* Candle Body Linear */}
          <linearGradient id={`candle-body-${candleConfig.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="50%" stopColor={candleConfig.candleColor} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </linearGradient>

          {/* Banana Leaf Gradients */}
          <linearGradient id="leaf-dark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e3a1f" />
            <stop offset="100%" stopColor="#0f2910" />
          </linearGradient>
          <linearGradient id="leaf-mid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
          <linearGradient id="leaf-fold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          {/* Lotus Petal Gradients */}
          <linearGradient id="lotus-pink-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="40%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
          <linearGradient id="lotus-light-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fdf2f8" />
            <stop offset="60%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>

          {/* Ice Gradients */}
          <linearGradient id="ice-crystal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
          </linearGradient>

          {/* Coconut Gradients */}
          <linearGradient id="coconut-shell-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#573318" />
            <stop offset="50%" stopColor="#3d1f08" />
            <stop offset="100%" stopColor="#271203" />
          </linearGradient>

          {/* Bread Gradients */}
          <linearGradient id="bread-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="40%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>

          {/* Royal Gold Gradients */}
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>

          {/* Water reflection filter */}
          <radialGradient id="water-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={candleConfig.candleColor} stopOpacity="0.35" />
            <stop offset="60%" stopColor="#0284c7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Water Ripple Shadow / Glow Underneath */}
        {waterReflection && (
          <g opacity="0.85">
            <ellipse cx="100" cy="148" rx="82" ry="14" fill="#030712" opacity="0.6" />
            <ellipse cx="100" cy="146" rx="68" ry="10" fill="url(#water-glow)" />
            <ellipse cx="100" cy="149" rx="42" ry="4" fill={candleConfig.flameColor} opacity="0.3" />
          </g>
        )}

        {/* 1. KRATHONG BASE LAYER */}
        {baseId === 'banana-leaf' && (
          <g id="base-banana">
            {/* Outer banana leaf base disc */}
            <ellipse cx="100" cy="132" rx="75" ry="24" fill="url(#leaf-dark)" />
            <ellipse cx="100" cy="130" rx="72" ry="22" fill="url(#leaf-mid)" />

            {/* Pleated Triangular Leaves (กลีบผกา) Ring 1 (Back/Side) */}
            <path d="M26 130 Q16 110 32 98 Q50 115 54 130 Z" fill="url(#leaf-fold)" stroke="#14532d" strokeWidth="0.8" />
            <path d="M48 132 Q38 100 62 90 Q78 112 80 132 Z" fill="url(#leaf-fold)" stroke="#14532d" strokeWidth="0.8" />
            <path d="M72 135 Q70 94 98 84 Q116 108 116 135 Z" fill="url(#leaf-fold)" stroke="#14532d" strokeWidth="0.8" />
            <path d="M120 135 Q130 94 102 84 Q146 108 128 135 Z" fill="url(#leaf-fold)" stroke="#14532d" strokeWidth="0.8" />
            <path d="M146 132 Q162 100 138 90 Q122 112 120 132 Z" fill="url(#leaf-fold)" stroke="#14532d" strokeWidth="0.8" />
            <path d="M174 130 Q184 110 168 98 Q150 115 146 130 Z" fill="url(#leaf-fold)" stroke="#14532d" strokeWidth="0.8" />

            {/* Pleated Leaves Ring 2 (Front facing petals) */}
            <path d="M36 136 Q30 120 48 110 Q64 124 66 138 Z" fill="url(#leaf-fold)" stroke="#166534" strokeWidth="0.8" />
            <path d="M62 139 Q60 114 85 106 Q100 125 96 142 Z" fill="url(#leaf-fold)" stroke="#166534" strokeWidth="0.8" />
            <path d="M104 142 Q100 125 115 106 Q140 114 138 139 Z" fill="url(#leaf-fold)" stroke="#166534" strokeWidth="0.8" />
            <path d="M134 138 Q136 124 152 110 Q170 120 164 136 Z" fill="url(#leaf-fold)" stroke="#166534" strokeWidth="0.8" />

            {/* Center banana slice disc */}
            <ellipse cx="100" cy="134" rx="46" ry="14" fill="#14532d" stroke="#22c55e" strokeWidth="1" />
          </g>
        )}

        {baseId === 'lotus-pink' && (
          <g id="base-lotus">
            {/* Lotus outer petal wreath */}
            <ellipse cx="100" cy="132" rx="76" ry="24" fill="#831843" opacity="0.6" />
            {/* Back petals */}
            <path d="M30 125 C15 95 45 80 62 115 Z" fill="url(#lotus-pink-grad)" stroke="#be185d" strokeWidth="0.8" />
            <path d="M60 125 C50 85 85 75 96 115 Z" fill="url(#lotus-pink-grad)" stroke="#be185d" strokeWidth="0.8" />
            <path d="M104 115 C115 75 150 85 140 125 Z" fill="url(#lotus-pink-grad)" stroke="#be185d" strokeWidth="0.8" />
            <path d="M138 115 C155 80 185 95 170 125 Z" fill="url(#lotus-pink-grad)" stroke="#be185d" strokeWidth="0.8" />

            {/* Mid layered petals */}
            <path d="M42 132 C35 105 68 95 76 128 Z" fill="url(#lotus-light-grad)" stroke="#db2777" strokeWidth="0.8" />
            <path d="M72 135 C70 98 105 92 104 132 Z" fill="url(#lotus-light-grad)" stroke="#db2777" strokeWidth="0.8" />
            <path d="M96 132 C95 92 130 98 128 135 Z" fill="url(#lotus-light-grad)" stroke="#db2777" strokeWidth="0.8" />
            <path d="M124 128 C132 95 165 105 158 132 Z" fill="url(#lotus-light-grad)" stroke="#db2777" strokeWidth="0.8" />

            {/* Front petals */}
            <path d="M58 138 C54 118 84 110 88 138 Z" fill="#fdf2f8" stroke="#f472b6" strokeWidth="0.8" />
            <path d="M84 140 C86 112 114 112 116 140 Z" fill="#fff" stroke="#f472b6" strokeWidth="0.8" />
            <path d="M112 138 C116 110 146 118 142 138 Z" fill="#fdf2f8" stroke="#f472b6" strokeWidth="0.8" />

            {/* Lotus center pistil */}
            <ellipse cx="100" cy="135" rx="32" ry="10" fill="#fef08a" stroke="#eab308" strokeWidth="1.2" />
          </g>
        )}

        {baseId === 'ice-zero-waste' && (
          <g id="base-ice">
            {/* Ice translucent faceted bowl */}
            <ellipse cx="100" cy="134" rx="72" ry="22" fill="url(#ice-crystal)" />
            {/* Crystal facets */}
            <polygon points="35,128 65,105 100,120 70,140" fill="#bae6fd" opacity="0.6" stroke="#ffffff" strokeWidth="1" />
            <polygon points="65,105 100,95 135,105 100,120" fill="#e0f2fe" opacity="0.8" stroke="#ffffff" strokeWidth="1.2" />
            <polygon points="100,120 135,105 165,128 130,140" fill="#7dd3fc" opacity="0.5" stroke="#ffffff" strokeWidth="1" />
            <polygon points="70,140 100,120 130,140 100,146" fill="#38bdf8" opacity="0.7" stroke="#ffffff" strokeWidth="1" />
            {/* Frozen flower accents inside ice */}
            <circle cx="80" cy="124" r="5" fill="#f43f5e" opacity="0.75" />
            <circle cx="120" cy="124" r="5" fill="#facc15" opacity="0.75" />
            <circle cx="100" cy="130" r="4" fill="#a855f7" opacity="0.75" />
            {/* Shimmer sparkle */}
            <path d="M60 115 L63 118 L60 121 L57 118 Z" fill="#fff" />
            <path d="M140 115 L143 118 L140 121 L137 118 Z" fill="#fff" />
          </g>
        )}

        {baseId === 'coconut-shell' && (
          <g id="base-coconut">
            {/* Deep rustic coconut half shell */}
            <ellipse cx="100" cy="135" rx="72" ry="22" fill="url(#coconut-shell-grad)" stroke="#78350f" strokeWidth="1.5" />
            {/* Coconut inner edge */}
            <ellipse cx="100" cy="132" rx="66" ry="17" fill="#f5ebe0" stroke="#d5bdaf" strokeWidth="1.2" />
            <ellipse cx="100" cy="133" rx="62" ry="14" fill="#2d1502" />
            {/* Carved rim decorative pattern */}
            <path d="M42 128 Q48 124 54 128 Q60 124 66 128 Q72 124 78 128 Q84 124 90 128 Q96 124 102 128 Q108 124 114 128 Q120 124 126 128 Q132 124 138 128 Q144 124 150 128 Q156 124 162 128" stroke="#fef08a" strokeWidth="1" fill="none" opacity="0.8" />
          </g>
        )}

        {baseId === 'fish-bread' && (
          <g id="base-bread">
            {/* Fish-friendly bread loaf base */}
            <ellipse cx="100" cy="134" rx="74" ry="23" fill="url(#bread-grad)" stroke="#9a3412" strokeWidth="1.5" />
            {/* Bread braid swirls */}
            <circle cx="50" cy="130" r="14" fill="#fb923c" stroke="#c2410c" strokeWidth="1" />
            <circle cx="75" cy="126" r="14" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
            <circle cx="100" cy="124" r="15" fill="#ea580c" stroke="#c2410c" strokeWidth="1" />
            <circle cx="125" cy="126" r="14" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
            <circle cx="150" cy="130" r="14" fill="#fb923c" stroke="#c2410c" strokeWidth="1" />
            {/* Sesame seed details */}
            <ellipse cx="65" cy="124" rx="1.5" ry="3" fill="#fff" transform="rotate(20 65 124)" />
            <ellipse cx="95" cy="120" rx="1.5" ry="3" fill="#fff" transform="rotate(-15 95 120)" />
            <ellipse cx="130" cy="122" rx="1.5" ry="3" fill="#fff" transform="rotate(30 130 122)" />
            <ellipse cx="108" cy="122" rx="1.5" ry="3" fill="#fff" transform="rotate(-30 108 122)" />
          </g>
        )}

        {baseId === 'royal-gold' && (
          <g id="base-gold">
            {/* Golden Royal Base */}
            <ellipse cx="100" cy="134" rx="74" ry="24" fill="url(#gold-grad)" stroke="#713f12" strokeWidth="1.5" />
            {/* Ornate Gold Crown Petals */}
            <path d="M28 130 Q22 102 44 94 Q58 116 58 132 Z" fill="url(#gold-grad)" stroke="#ca8a04" strokeWidth="1" />
            <path d="M52 133 Q50 96 74 88 Q88 112 86 135 Z" fill="url(#gold-grad)" stroke="#ca8a04" strokeWidth="1" />
            <path d="M80 136 Q86 92 100 82 Q114 92 120 136 Z" fill="url(#gold-grad)" stroke="#ca8a04" strokeWidth="1" />
            <path d="M114 135 Q112 112 126 88 Q150 96 148 133 Z" fill="url(#gold-grad)" stroke="#ca8a04" strokeWidth="1" />
            <path d="M142 132 Q142 116 156 94 Q178 102 172 130 Z" fill="url(#gold-grad)" stroke="#ca8a04" strokeWidth="1" />
            {/* Ruby Gem in center rim */}
            <circle cx="100" cy="136" r="4" fill="#dc2626" stroke="#fef08a" strokeWidth="1.2" />
            <circle cx="70" cy="136" r="3" fill="#16a34a" stroke="#fef08a" strokeWidth="1" />
            <circle cx="130" cy="136" r="3" fill="#16a34a" stroke="#fef08a" strokeWidth="1" />
          </g>
        )}

        {/* 2. FLOWERS & LUCKY COINS DECORATION */}
        <g id="flowers-layer">
          {/* Marigold (ดอกดาวเรือง) */}
          {flowers.includes('marigold') && (
            <g id="flower-marigold">
              {/* Left Marigold */}
              <circle cx="70" cy="126" r="10" fill="#ca8a04" />
              <circle cx="70" cy="126" r="8.5" fill="#eab308" />
              <circle cx="70" cy="126" r="6" fill="#facc15" />
              <circle cx="70" cy="126" r="3.5" fill="#fef08a" />
              {/* Right Marigold */}
              <circle cx="130" cy="126" r="10" fill="#ca8a04" />
              <circle cx="130" cy="126" r="8.5" fill="#eab308" />
              <circle cx="130" cy="126" r="6" fill="#facc15" />
              <circle cx="130" cy="126" r="3.5" fill="#fef08a" />
            </g>
          )}

          {/* Lotus Flower Accent (ดอกบัวหลวง) */}
          {flowers.includes('sacred-lotus') && (
            <g id="flower-lotus-center">
              <path d="M85 130 C80 120 90 115 95 125 Z" fill="#f472b6" />
              <path d="M115 130 C120 120 110 115 105 125 Z" fill="#f472b6" />
              <path d="M92 132 C95 118 105 118 108 132 Z" fill="#fbcfe8" stroke="#db2777" strokeWidth="0.6" />
            </g>
          )}

          {/* Jasmine buds (ดอกมะลิสด) */}
          {flowers.includes('jasmine') && (
            <g id="flower-jasmine">
              <circle cx="58" cy="132" r="3.2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
              <circle cx="62" cy="135" r="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
              <circle cx="138" cy="135" r="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
              <circle cx="142" cy="132" r="3.2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
            </g>
          )}

          {/* Orchid (ดอกกล้วยไม้) */}
          {flowers.includes('orchid') && (
            <g id="flower-orchid">
              <ellipse cx="82" cy="130" rx="4.5" ry="3" fill="#c084fc" stroke="#7e22ce" strokeWidth="0.5" />
              <ellipse cx="118" cy="130" rx="4.5" ry="3" fill="#c084fc" stroke="#7e22ce" strokeWidth="0.5" />
              <circle cx="82" cy="130" r="1.5" fill="#fef08a" />
              <circle cx="118" cy="130" r="1.5" fill="#fef08a" />
            </g>
          )}

          {/* Globe Amaranth (ดอกบานไม่รู้โรย) */}
          {flowers.includes('globe-amaranth') && (
            <g id="flower-amaranth">
              <circle cx="72" cy="134" r="4.2" fill="#e11d48" stroke="#fda4af" strokeWidth="0.5" />
              <circle cx="128" cy="134" r="4.2" fill="#e11d48" stroke="#fda4af" strokeWidth="0.5" />
            </g>
          )}

          {/* Lucky Coins (เหรียญบาทนำโชค) */}
          {includeCoins && (
            <g id="coins-sparkle">
              <circle cx="94" cy="135" r="4.5" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
              <circle cx="94" cy="135" r="3.2" fill="#fef08a" />
              <circle cx="106" cy="135" r="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
              <circle cx="106" cy="135" r="2.8" fill="#f8fafc" />
            </g>
          )}
        </g>

        {/* 3. INCENSE STICKS & SMOKE */}
        <g id="incense-group">
          {/* Incense Stick 1 */}
          <line x1="88" y1="126" x2="84" y2="60" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <line x1="84" y1="60" x2="84" y2="52" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="84" cy="52" r="1.2" fill="#fbbf24" />

          {/* Incense Stick 2 */}
          <line x1="92" y1="126" x2="91" y2="55" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <line x1="91" y1="55" x2="91" y2="47" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="91" cy="47" r="1.2" fill="#fbbf24" />

          {/* Incense Stick 3 */}
          <line x1="96" y1="126" x2="98" y2="58" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <line x1="98" y1="58" x2="98" y2="50" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="98" cy="50" r="1.2" fill="#fbbf24" />

          {/* Animated Incense Smoke */}
          {animated && (
            <g className="animate-smoke" opacity="0.6">
              <path
                d="M84 48 Q80 38 86 30 Q92 22 88 12"
                stroke="#cbd5e1"
                strokeWidth="1.2"
                fill="none"
                strokeDasharray="2 3"
              />
              <path
                d="M91 44 Q96 34 90 26 Q85 18 92 10"
                stroke="#cbd5e1"
                strokeWidth="1.2"
                fill="none"
                strokeDasharray="2 3"
              />
            </g>
          )}
        </g>

        {/* 4. CANDLE & CANDLE FLAME (Heart of Krathong) */}
        <g id="candle-group">
          {/* Candle Taper Body */}
          <rect
            x="96.5"
            y="65"
            width="7"
            height="58"
            rx="2"
            fill={`url(#candle-body-${candleConfig.id})`}
            stroke={candleConfig.candleColor}
            strokeWidth="0.6"
          />

          {/* Candle Wax Drop Accent */}
          <path d="M96.5 76 Q95 80 96.5 84 Z" fill={candleConfig.candleColor} opacity="0.7" />

          {/* Wick */}
          <line x1="100" y1="65" x2="100" y2="57" stroke="#1f2937" strokeWidth="1.6" strokeLinecap="round" />

          {/* FLAME & GLOW */}
          <g className={animated ? 'animate-flame' : ''}>
            {/* Giant soft radial aura around flame */}
            <circle cx="100" cy="46" r="34" fill={`url(#flame-glow-${candleConfig.id})`} />

            {/* Outer Flame */}
            <path
              d="M100 24 C104 34 111 44 107 54 C104 59 96 59 93 54 C89 44 96 34 100 24 Z"
              fill={candleConfig.flameColor}
            />

            {/* Inner Golden Core */}
            <path
              d="M100 32 C102 38 106 46 104 52 C102 56 98 56 96 52 C94 46 98 38 100 32 Z"
              fill="#fef08a"
            />

            {/* Blue base of flame (realistic candle flame physics) */}
            <ellipse cx="100" cy="55" rx="3.5" ry="1.8" fill="#38bdf8" opacity="0.75" />
          </g>
        </g>
      </svg>
    </div>
  );
};
