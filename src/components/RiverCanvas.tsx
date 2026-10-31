import React, { useState } from 'react';
import { FloatingKrathong } from '../types/krathong';
import { KrathongVisual } from './KrathongVisual';
import { WISH_CATEGORIES } from '../data/krathongOptions';
import { playThaiChime } from '../utils/audio';
import { Heart, Sparkles, Filter, X, Eye } from 'lucide-react';

interface RiverCanvasProps {
  floatingKrathongs: FloatingKrathong[];
  onBlessKrathong: (id: string) => void;
  highlightKrathongId?: string | null;
}

interface FloatingPetal {
  id: number;
  x: number;
  y: number;
  color: string;
}

export const RiverCanvas: React.FC<RiverCanvasProps> = ({
  floatingKrathongs,
  onBlessKrathong,
  highlightKrathongId,
}) => {
  const [selectedKrathong, setSelectedKrathong] = useState<FloatingKrathong | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [petals, setPetals] = useState<FloatingPetal[]>([]);

  const filteredKrathongs = floatingKrathongs.filter((k) => {
    if (filterCategory === 'all') return true;
    return k.wishCategory === filterCategory;
  });

  const handleScatterPetals = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const colors = ['#f472b6', '#facc15', '#ffffff', '#c084fc', '#fb7185'];
    const newPetals: FloatingPetal[] = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.min(95, Math.max(5, x + (Math.random() * 8 - 4))),
      y: Math.min(92, Math.max(30, y + (Math.random() * 8 - 4))),
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setPetals((prev) => [...prev.slice(-20), ...newPetals]);
    playThaiChime('gentle');
  };

  const handleBlessClick = (krathong: FloatingKrathong) => {
    onBlessKrathong(krathong.id);
    playThaiChime('bless');
    if (selectedKrathong && selectedKrathong.id === krathong.id) {
      setSelectedKrathong({
        ...selectedKrathong,
        blessCount: selectedKrathong.blessCount + 1,
      });
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-amber-500/20 bg-slate-950 shadow-2xl">
      {/* 1. Header toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-500/15 bg-slate-900/80 px-6 py-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-wide text-amber-300 font-prompt">
              แม่น้ำแห่งสายธารใจ (สายน้ำออนไลน์)
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ลอยอยู่ {floatingKrathongs.length} กระทง
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            คลิกที่กระทงเพื่ออ่านคำอธิษฐานและร่วมส่งใจอนุโมทนา หรือคลิกบนผิวน้ำเพื่อโปรยกลีบดอกไม้
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-all ${
              filterCategory === 'all'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ทั้งหมด ({floatingKrathongs.length})
          </button>
          {WISH_CATEGORIES.map((cat) => {
            const count = floatingKrathongs.filter((k) => k.wishCategory === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-all flex items-center gap-1 ${
                  filterCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive River Viewport */}
      <div
        onClick={handleScatterPetals}
        className="relative h-[480px] sm:h-[560px] md:h-[620px] w-full cursor-crosshair overflow-hidden select-none"
        style={{
          background: 'linear-gradient(180deg, #020617 0%, #03132e 35%, #051d42 60%, #02122b 100%)',
        }}
      >
        {/* Full Moon & Stars Atmosphere */}
        <div className="absolute top-6 right-10 sm:right-20 pointer-events-none">
          {/* Luminous Moon */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-100 via-amber-200 to-amber-50 shadow-[0_0_50px_rgba(253,230,138,0.7)] flex items-center justify-center">
            {/* Soft moon surface craters */}
            <div className="absolute top-3 left-4 w-3.5 h-3.5 rounded-full bg-amber-200/50 blur-[0.5px]"></div>
            <div className="absolute bottom-4 right-5 w-5 h-5 rounded-full bg-amber-200/40 blur-[0.5px]"></div>
            <div className="absolute top-7 right-3 w-2.5 h-2.5 rounded-full bg-amber-200/40"></div>
          </div>
          {/* Moon vertical reflection column on water */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-8 h-80 bg-gradient-to-b from-amber-200/25 via-amber-300/10 to-transparent blur-md pointer-events-none"></div>
        </div>

        {/* Starfield particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-1/4 w-1 h-1 bg-amber-100 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-16 left-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
          <div className="absolute top-12 left-10 w-1 h-1 bg-white rounded-full opacity-70"></div>
          <div className="absolute top-24 left-1/2 w-1.5 h-1.5 bg-amber-200 rounded-full opacity-80"></div>
          <div className="absolute top-6 left-3/4 w-1 h-1 bg-white rounded-full opacity-50"></div>
        </div>

        {/* Floating Sky Lanterns (โคมลอย) drifting upward in the background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-14 left-[15%] animate-lantern"
            style={{ animationDuration: '9s' }}
          >
            <div className="w-5 h-7 rounded-sm bg-gradient-to-t from-amber-500 via-amber-400 to-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.9)] opacity-85 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
            </div>
          </div>
          <div
            className="absolute top-24 left-[35%] animate-lantern"
            style={{ animationDuration: '11s', animationDelay: '1.5s' }}
          >
            <div className="w-4 h-6 rounded-sm bg-gradient-to-t from-amber-600 via-amber-400 to-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.8)] opacity-75"></div>
          </div>
          <div
            className="absolute top-10 left-[55%] animate-lantern"
            style={{ animationDuration: '8s', animationDelay: '0.8s' }}
          >
            <div className="w-6 h-8 rounded-sm bg-gradient-to-t from-amber-500 via-amber-300 to-amber-100 shadow-[0_0_20px_rgba(251,191,36,0.95)] opacity-90 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            </div>
          </div>
          <div
            className="absolute top-20 left-[78%] animate-lantern"
            style={{ animationDuration: '13s', animationDelay: '2.2s' }}
          >
            <div className="w-3.5 h-5 rounded-sm bg-gradient-to-t from-amber-600 via-amber-400 to-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.7)] opacity-70"></div>
          </div>
        </div>

        {/* Distant Temple Silhouette & Riverside Glow */}
        <div className="absolute top-[28%] sm:top-[25%] left-0 right-0 h-16 pointer-events-none opacity-40">
          <svg viewBox="0 0 1000 60" preserveAspectRatio="none" className="w-full h-full fill-slate-900">
            <path d="M0 60 L0 45 Q80 43 140 45 L145 35 L150 15 L155 35 L160 45 Q260 42 340 45 L410 40 L415 20 L420 5 L425 20 L430 40 Q550 43 650 45 L720 38 L725 18 L730 38 Q850 44 1000 45 L1000 60 Z" />
          </svg>
        </div>

        {/* Water Surface Waves & Ambient Reflections */}
        <div className="absolute top-[32%] inset-x-0 bottom-0 pointer-events-none">
          {/* Subtle horizontal animated water current lines */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0369a1_0%,transparent_70%)] opacity-20"></div>
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent blur-sm"></div>
          <div className="absolute top-12 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400/15 to-transparent blur-[1px]"></div>
          <div className="absolute top-28 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent"></div>
          <div className="absolute top-48 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400/15 to-transparent"></div>
        </div>

        {/* Scattered Interactive Petals */}
        {petals.map((petal) => (
          <div
            key={petal.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000"
            style={{
              left: `${petal.x}%`,
              top: `${petal.y}%`,
            }}
          >
            <div
              className="w-3.5 h-2.5 rounded-full rotate-45 opacity-85 shadow-[0_0_6px_rgba(255,255,255,0.4)] animate-water-bob"
              style={{ backgroundColor: petal.color }}
            ></div>
          </div>
        ))}

        {/* 3. Floating Krathongs on the River */}
        {filteredKrathongs.map((krathong) => {
          const isHighlighted = highlightKrathongId === krathong.id;
          const size = krathong.scale > 0.95 ? 'md' : krathong.scale > 0.8 ? 'sm' : 'xs';

          return (
            <div
              key={krathong.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedKrathong(krathong);
                playThaiChime('gentle');
              }}
              className={`absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group transition-transform duration-300 hover:scale-110 ${
                isHighlighted ? 'z-30 ring-2 ring-amber-400 rounded-full p-2 bg-amber-500/10' : 'z-10'
              }`}
              style={{
                left: `${krathong.xPercent}%`,
                top: `${krathong.yPercent}%`,
              }}
            >
              {/* Highlight badge if it's the user's newly floated Krathong */}
              {isHighlighted && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-bold text-slate-950 shadow-lg animate-bounce">
                  กระทงของคุณ ✨
                </div>
              )}

              {/* Krathong visual render */}
              <KrathongVisual
                baseId={krathong.baseId}
                candleColorId={krathong.candleColorId}
                flowers={krathong.flowers}
                includeCoins={krathong.includeCoins}
                size={size}
                animated={true}
              />

              {/* Hover Quick Tooltip */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900/90 border border-slate-700 px-2 py-0.5 text-[11px] text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm z-40 flex items-center gap-1.5">
                <span className="font-medium text-amber-300">{krathong.senderName}</span>
                <span className="text-slate-400">·</span>
                <span className="text-rose-400 flex items-center gap-0.5">
                  <Heart className="w-2.5 h-2.5 fill-rose-400" /> {krathong.blessCount}
                </span>
              </div>
            </div>
          );
        })}

        {/* River bottom instructional hint */}
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-slate-400 pointer-events-none">
          <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            สัมผัสหรือคลิกบนผิวน้ำเพื่อร่วมโปรยกลีบดอกไม้
          </span>
          <span className="hidden sm:inline-block bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 backdrop-blur-sm">
            สายน้ำแห่งพระแม่คงคาวันเพ็ญเดือน ๑๒
          </span>
        </div>
      </div>

      {/* 4. MODAL: Detailed Wish & Blessing Popup */}
      {selectedKrathong && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-amber-500/30 bg-slate-900 p-6 shadow-2xl text-slate-100">
            {/* Close button */}
            <button
              onClick={() => setSelectedKrathong(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Krathong Preview in Modal */}
            <div className="flex flex-col items-center justify-center pt-2 pb-4">
              <KrathongVisual
                baseId={selectedKrathong.baseId}
                candleColorId={selectedKrathong.candleColorId}
                flowers={selectedKrathong.flowers}
                includeCoins={selectedKrathong.includeCoins}
                size="md"
              />
              <div className="mt-2 text-xs font-medium text-amber-300">
                {WISH_CATEGORIES.find((c) => c.id === selectedKrathong.wishCategory)?.name || 'คำอธิษฐาน'}
              </div>
            </div>

            {/* Sender Name */}
            <div className="border-t border-slate-800 pt-4 text-center">
              <div className="text-xs text-slate-400">ผู้ร่วมลอยกระทง</div>
              <h3 className="text-lg font-bold text-amber-200 font-prompt">
                {selectedKrathong.senderName}
              </h3>
            </div>

            {/* Wish Message */}
            <div className="my-4 rounded-xl bg-slate-950/80 border border-slate-800 p-4 text-sm leading-relaxed text-slate-200 text-center italic">
              "{selectedKrathong.wishMessage}"
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-400">
                มีผู้ร่วมอนุโมทนา{' '}
                <span className="font-semibold text-rose-400 tabular-nums">
                  {selectedKrathong.blessCount}
                </span>{' '}
                คน
              </div>

              <button
                onClick={() => handleBlessClick(selectedKrathong)}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:from-rose-600 hover:to-amber-600 active:scale-95 transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                อนุโมทนา สาธุ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
