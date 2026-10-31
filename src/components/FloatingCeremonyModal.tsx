import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { KrathongCustomization } from '../types/krathong';
import { KrathongVisual } from './KrathongVisual';
import { KRATHONG_BASES, WISH_CATEGORIES } from '../data/krathongOptions';
import { playWaterRipple, playThaiChime } from '../utils/audio';
import { Sparkles, Share2, Check, Download, ArrowDown, Leaf, Award } from 'lucide-react';

interface FloatingCeremonyModalProps {
  customization: KrathongCustomization;
  onClose: () => void;
  onViewInRiver: () => void;
}

export const FloatingCeremonyModal: React.FC<FloatingCeremonyModalProps> = ({
  customization,
  onClose,
  onViewInRiver,
}) => {
  const [stage, setStage] = useState<'floating' | 'certificate'>('floating');
  const [copied, setCopied] = useState<boolean>(false);
  const certRef = useRef<HTMLDivElement>(null);

  const baseConfig =
    KRATHONG_BASES.find((b) => b.id === customization.baseId) || KRATHONG_BASES[0];
  const categoryConfig =
    WISH_CATEGORIES.find((c) => c.id === customization.wishCategory) || WISH_CATEGORIES[0];

  useEffect(() => {
    // Stage 1: Play sound and fire gentle fireworks
    playWaterRipple();
    playThaiChime('float');

    // Confetti: Golden sparks and amber embers
    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#fef08a', '#ec4899', '#38bdf8'],
      });
    } catch {}

    const timer = setTimeout(() => {
      setStage('certificate');
      try {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#fbbf24', '#fef08a'],
        });
      } catch {}
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const handleCopyShare = () => {
    const shareText = `🪷 ร่วมลอยกระทงออนไลน์ ๒๕๖๙ 🪷\nผู้ลอย: ${customization.senderName}\nคำอธิษฐาน: "${customization.wishMessage}"\nสืบสานประเพณีไทย ขอขมาพระแม่คงคา รักษ์สิ่งแวดล้อม 100% ✨`;
    navigator.clipboard?.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in duration-300 overflow-y-auto">
      {/* STAGE 1: IMMERSIVE FLOATING CEREMONY */}
      {stage === 'floating' && (
        <div className="flex flex-col items-center justify-center text-center max-w-lg p-6 space-y-6">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Soft water ripples glowing under floating krathong */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-ping opacity-60"></div>
            <div className="absolute inset-4 rounded-full bg-amber-500/20 animate-pulse"></div>

            {/* Descending Krathong animation */}
            <div className="relative z-10 transition-transform duration-1000 translate-y-3 scale-110">
              <KrathongVisual
                baseId={customization.baseId}
                candleColorId={customization.candleColorId}
                flowers={customization.flowers}
                includeCoins={customization.includeCoins}
                size="xl"
                animated={true}
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              กำลังลอยกระทงสู่สายน้ำ
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-prompt">
              ขอให้ความทุกข์โศกลอยไปกับสายน้ำ
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              ขอพระแม่คงคาประทานพรให้ชีวิตสว่างไสว ร่มเย็นเป็นสุข ปราศจากโรคภัยไข้เจ็บ
            </p>
          </div>
        </div>
      )}

      {/* STAGE 2: SHAREABLE BLESSING CERTIFICATE */}
      {stage === 'certificate' && (
        <div className="relative w-full max-w-lg rounded-3xl border border-amber-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl text-slate-100 my-6 animate-in zoom-in-95 duration-300">
          {/* Certificate Border Card */}
          <div
            ref={certRef}
            className="rounded-2xl border-2 border-amber-400/40 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 text-center shadow-inner relative overflow-hidden"
          >
            {/* Traditional Thai corner accents */}
            <div className="absolute top-2 left-2 text-amber-400/60 text-lg">❖</div>
            <div className="absolute top-2 right-2 text-amber-400/60 text-lg">❖</div>
            <div className="absolute bottom-2 left-2 text-amber-400/60 text-lg">❖</div>
            <div className="absolute bottom-2 right-2 text-amber-400/60 text-lg">❖</div>

            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/30">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                ใบอนุโมทนาบัตรลอยกระทงออนไลน์
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-amber-200 font-prompt pt-2">
                ประเพณีวันลอยกระทง ๒๕๖๙
              </h2>
              <p className="text-xs text-slate-400">
                วันเพ็ญขึ้น ๑๕ ค่ำ เดือน ๑๒ · สายน้ำแห่งความศรัทธา
              </p>
            </div>

            {/* Visual Center */}
            <div className="my-5 flex flex-col items-center justify-center">
              <KrathongVisual
                baseId={customization.baseId}
                candleColorId={customization.candleColorId}
                flowers={customization.flowers}
                includeCoins={customization.includeCoins}
                size="md"
                animated={true}
              />
              <span className="text-[11px] text-amber-300/80 mt-1">
                {baseConfig.name}
              </span>
            </div>

            {/* Sender & Wish */}
            <div className="space-y-2 border-t border-b border-amber-500/20 py-4 my-3">
              <div className="text-xs text-slate-400">ขอขมาพระแม่คงคาและอธิษฐานโดย</div>
              <div className="text-lg font-bold text-white font-prompt">
                {customization.senderName}
              </div>
              <div className="text-xs font-medium text-amber-400">
                หมวด: {categoryConfig.name}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 italic px-2 leading-relaxed">
                "{customization.wishMessage}"
              </p>
            </div>

            {/* Green Eco Badge */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-medium">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>คุณได้ร่วมลดขยะในแม่น้ำ ๑ กระทง (ไร้สารเคมี ปลอดขยะ 100%)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleCopyShare}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>คัดลอกข้อความแล้ว!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>แชร์การ์ดอวยพร</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>พิมพ์ / บันทึกการ์ด</span>
            </button>

            <button
              onClick={onViewInRiver}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 font-prompt"
            >
              <ArrowDown className="w-4 h-4 stroke-[2.5]" />
              <span>ดูในสายน้ำรวมใจ</span>
            </button>
          </div>

          {/* Close link */}
          <div className="text-center mt-3">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
            >
              สร้างกระทงใบใหม่
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
