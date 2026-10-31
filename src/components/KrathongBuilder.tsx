import React, { useState } from 'react';
import {
  KrathongCustomization,
  KrathongBaseOption,
  CandleColorOption,
  FlowerOption,
  IncenseOption,
  WishCategory,
} from '../types/krathong';
import {
  KRATHONG_BASES,
  CANDLE_COLORS,
  INCENSE_OPTIONS,
  FLOWER_OPTIONS,
  WISH_CATEGORIES,
} from '../data/krathongOptions';
import { KrathongVisual } from './KrathongVisual';
import { playThaiChime } from '../utils/audio';
import {
  Sparkles,
  Flame,
  Flower2,
  ScrollText,
  Dices,
  BookOpen,
  Send,
  Check,
  Leaf,
  HeartHandshake,
} from 'lucide-react';

interface KrathongBuilderProps {
  onFloatKrathong: (customization: KrathongCustomization) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
}

export const KrathongBuilder: React.FC<KrathongBuilderProps> = ({
  onFloatKrathong,
  fontSize,
}) => {
  // Current customization state
  const [baseId, setBaseId] = useState<string>('banana-leaf');
  const [candleColorId, setCandleColorId] = useState<string>('amber-gold');
  const [incenseId, setIncenseId] = useState<string>('thai-jasmine');
  const [flowers, setFlowers] = useState<string[]>(['marigold', 'sacred-lotus']);
  const [includeCoins, setIncludeCoins] = useState<boolean>(true);
  const [senderName, setSenderName] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [wishCategory, setWishCategory] = useState<string>('goddess-water');
  const [wishMessage, setWishMessage] = useState<string>(
    'ขอขมาพระแม่คงคาที่ได้ใช้น้ำอุปโภคบริโภค ขออภัยหากเคยทำให้สายน้ำหมองมัว ขอพระแม่คงคาประทานพรให้ชีวิตร่มเย็นเป็นสุข ปราศจากทุกข์โศกโรคภัยทั้งปวง'
  );

  // Active sub-tab
  const [activeStep, setActiveStep] = useState<'base' | 'decor' | 'wish'>('base');
  // Chanting prayer modal
  const [showChantModal, setShowChantModal] = useState<boolean>(false);
  // Error prompt
  const [formError, setFormError] = useState<string>('');

  // Toggle flower selection (up to 3)
  const handleToggleFlower = (flowerId: string) => {
    if (flowers.includes(flowerId)) {
      if (flowers.length > 1) {
        setFlowers(flowers.filter((f) => f !== flowerId));
      }
    } else {
      if (flowers.length < 3) {
        setFlowers([...flowers, flowerId]);
      } else {
        // replace last
        setFlowers([...flowers.slice(1), flowerId]);
      }
    }
    playThaiChime('gentle');
  };

  // Preset wish selection
  const handleSelectPresetWish = (preset: string) => {
    setWishMessage(preset);
    playThaiChime('gentle');
  };

  // Randomize lucky Krathong
  const handleRandomize = () => {
    const randomBase = KRATHONG_BASES[Math.floor(Math.random() * KRATHONG_BASES.length)].id;
    const randomCandle = CANDLE_COLORS[Math.floor(Math.random() * CANDLE_COLORS.length)].id;
    const randomIncense = INCENSE_OPTIONS[Math.floor(Math.random() * INCENSE_OPTIONS.length)].id;
    const shuffledFlowers = [...FLOWER_OPTIONS].sort(() => 0.5 - Math.random());
    const randomFlowers = shuffledFlowers.slice(0, 2).map((f) => f.id);
    const randomCat = WISH_CATEGORIES[Math.floor(Math.random() * WISH_CATEGORIES.length)];
    const randomPreset = randomCat.presets[Math.floor(Math.random() * randomCat.presets.length)];

    setBaseId(randomBase);
    setCandleColorId(randomCandle);
    setIncenseId(randomIncense);
    setFlowers(randomFlowers);
    setWishCategory(randomCat.id);
    setWishMessage(randomPreset);

    playThaiChime('bless');
  };

  // Submit & Float
  const handleFloatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishMessage.trim()) {
      setFormError('กรุณากรอกคำอธิษฐานหรือเลือกข้อความขอพร');
      setActiveStep('wish');
      return;
    }

    setFormError('');
    onFloatKrathong({
      baseId,
      candleColorId,
      incenseId,
      flowers,
      includeCoins,
      senderName: isAnonymous ? 'ผู้ไม่ประสงค์ออกนาม' : (senderName.trim() || 'พนักงานใจดี'),
      wishCategory,
      wishMessage: wishMessage.trim(),
      isAnonymous,
    });
  };

  const selectedBase = KRATHONG_BASES.find((b) => b.id === baseId) || KRATHONG_BASES[0];
  const selectedCandle = CANDLE_COLORS.find((c) => c.id === candleColorId) || CANDLE_COLORS[0];
  const selectedCategory = WISH_CATEGORIES.find((c) => c.id === wishCategory) || WISH_CATEGORIES[0];

  const textSizeClass =
    fontSize === 'xlarge' ? 'text-lg' : fontSize === 'large' ? 'text-base' : 'text-sm';

  return (
    <div
      id="krathong-builder-section"
      className="relative rounded-3xl border border-amber-500/25 bg-slate-900/90 shadow-2xl backdrop-blur-xl p-6 sm:p-8"
    >
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            ขั้นตอนการประดิษฐ์และอธิษฐาน
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-prompt mt-1">
            สร้างกระทงออนไลน์ของคุณ
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            เลือกรูปแบบกระทง ตกแต่งดอกไม้ จุดแสงประทีป และส่งคำอธิษฐานสู่พระแม่คงคา
          </p>
        </div>

        {/* Action Buttons: Randomize & Thai Prayer Chanting helper */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRandomize}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/20 transition-all active:scale-95 whitespace-nowrap"
            title="สุ่มรูปแบบกระทงและคำอธิษฐานมงคล"
          >
            <Dices className="w-4 h-4 text-amber-400" />
            <span>สุ่มกระทงมงคล</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowChantModal(true);
              playThaiChime('prayer');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all active:scale-95 whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>บทสวดขอขมา</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Builder Tabs / Right Sticky Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Step Navigation Tabs */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveStep('base');
                playThaiChime('gentle');
              }}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeStep === 'base'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Leaf className="w-4 h-4" />
              <span>๑. รูปแบบกระทง</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveStep('decor');
                playThaiChime('gentle');
              }}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeStep === 'decor'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>๒. เทียน ธูป ดอกไม้</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveStep('wish');
                playThaiChime('gentle');
              }}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeStep === 'wish'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ScrollText className="w-4 h-4" />
              <span>๓. คำอธิษฐาน</span>
            </button>
          </div>

          {/* STEP 1: CHOOSE KRATHONG BASE */}
          {activeStep === 'base' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">
                  เลือกฐานกระทงที่ชื่นชอบ (ทั้งหมด {KRATHONG_BASES.length} รูปแบบ)
                </span>
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" /> เป็นมิตรต่อสิ่งแวดล้อม 100%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {KRATHONG_BASES.map((b) => {
                  const isSelected = baseId === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => {
                        setBaseId(b.id);
                        playThaiChime('gentle');
                      }}
                      className={`relative cursor-pointer rounded-2xl p-4 transition-all border ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
                          {b.tag}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <h4 className="font-bold text-white font-prompt">{b.name}</h4>
                        <p className="text-xs text-amber-200/80 mt-0.5">{b.subtitle}</p>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          {b.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span>คะแนนรักษ์โลก:</span>
                        <span className="text-emerald-400 font-semibold">⭐⭐⭐⭐⭐ 100% ย่อยสลาย</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setActiveStep('decor');
                    playThaiChime('gentle');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-95"
                >
                  ถัดไป: เลือกแสงเทียนและดอกไม้ &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CANDLE, INCENSE & FLOWERS */}
          {activeStep === 'decor' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Candle Colors */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  สีเปลวเทียนและแสงประทีป
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CANDLE_COLORS.map((c) => {
                    const isSelected = candleColorId === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          setCandleColorId(c.id);
                          playThaiChime('gentle');
                        }}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500/10'
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-inner"
                          style={{
                            backgroundColor: c.candleColor,
                            boxShadow: `0 0 12px ${c.glowColor}`,
                          }}
                        >
                          <Flame className="w-4 h-4 text-white drop-shadow" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-xs text-white flex items-center justify-between">
                            <span>{c.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {c.meaning}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Incense Sticks */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  ธูปบูชา ๓ ดอก
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {INCENSE_OPTIONS.map((inc) => {
                    const isSelected = incenseId === inc.id;
                    return (
                      <div
                        key={inc.id}
                        onClick={() => {
                          setIncenseId(inc.id);
                          playThaiChime('gentle');
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500/10'
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>{inc.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <p className="text-[11px] text-amber-300/80 mt-1">{inc.scent}</p>
                        <p className="text-[10px] text-slate-400 mt-1 leading-snug">{inc.meaning}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Flower Accents */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-200">
                    ดอกไม้มงคลประดับกระทง (เลือกได้สูงสุด ๓ ชนิด)
                  </label>
                  <span className="text-xs text-amber-400">เลือกแล้ว {flowers.length}/3 ชนิด</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FLOWER_OPTIONS.map((fl) => {
                    const isChecked = flowers.includes(fl.id);
                    return (
                      <div
                        key={fl.id}
                        onClick={() => handleToggleFlower(fl.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                          isChecked
                            ? 'border-amber-400 bg-amber-500/10 text-white'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full shrink-0 border border-white/20"
                          style={{ backgroundColor: fl.color }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">{fl.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{fl.meaning}</div>
                        </div>
                        {isChecked && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lucky Coins Option */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
                <div>
                  <div className="text-sm font-semibold text-white">
                    ใส่เหรียญบาทสิริมงคลในกระทง
                  </div>
                  <div className="text-xs text-slate-400">
                    ตามคติความเชื่อเพื่อความมั่งคั่งและสะเดาะเคราะห์
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIncludeCoins(!includeCoins);
                    playThaiChime('gentle');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    includeCoins ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      includeCoins ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveStep('base');
                    playThaiChime('gentle');
                  }}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
                >
                  &larr; ย้อนกลับ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveStep('wish');
                    playThaiChime('gentle');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-95"
                >
                  ถัดไป: เขียนคำอธิษฐาน &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PRAYER & WISH FORM */}
          {activeStep === 'wish' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Sender Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                  ชื่อผู้ร่วมลอยกระทง / แผนกงาน
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    disabled={isAnonymous}
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="เช่น สมชาย ใจดี หรือ ทีมการตลาด"
                    className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 disabled:opacity-50"
                  />
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-slate-700 text-amber-500 focus:ring-0 w-4 h-4"
                    />
                    <span>ไม่ระบุชื่อ</span>
                  </label>
                </div>
              </div>

              {/* Wish Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  หมวดหมู่คำอธิษฐาน
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {WISH_CATEGORIES.map((cat) => {
                    const isSelected = wishCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setWishCategory(cat.id);
                          if (cat.presets.length > 0) {
                            setWishMessage(cat.presets[0]);
                          }
                          playThaiChime('gentle');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500/10 text-white'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-base">{cat.icon}</span>
                        <span className="text-xs font-medium truncate">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Preset Wish Buttons */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-amber-300">
                    คำอวยพรและคำขอขมาแนะนำ (คลิกเพื่อเลือกทันที)
                  </label>
                </div>
                <div className="space-y-1.5">
                  {selectedCategory.presets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPresetWish(preset)}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 text-xs text-slate-300 hover:text-white transition-all line-clamp-2"
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Wish Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-slate-200">
                    ข้อความคำขออธิษฐานของคุณ
                  </label>
                  <span className="text-xs text-slate-500">{wishMessage.length}/300 ตัวอักษร</span>
                </div>
                <textarea
                  rows={4}
                  maxLength={300}
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                  placeholder="เขียนคำขอขมาพระแม่คงคา หรือคำอธิษฐานขอพรที่ต้องการ..."
                  className={`w-full rounded-xl bg-slate-950 border border-slate-700 p-3.5 ${textSizeClass} text-white placeholder-slate-500 focus:outline-none focus:border-amber-400`}
                ></textarea>
                {formError && (
                  <p className="text-xs text-rose-400 mt-1 font-medium">{formError}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Sticky Krathong Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between rounded-2xl border border-amber-500/20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 shadow-xl relative overflow-hidden">
          {/* Subtle water ripples in preview backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0284c7_0%,transparent_75%)] opacity-10 pointer-events-none"></div>

          {/* Preview Badge */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="text-xs font-medium text-amber-300 flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              ภาพจำลองกระทงสด
            </span>
            <span className="text-xs text-slate-400">
              {selectedBase.name}
            </span>
          </div>

          {/* Central Animated Krathong */}
          <div className="my-6 flex flex-col items-center justify-center min-h-[220px]">
            <KrathongVisual
              baseId={baseId}
              candleColorId={candleColorId}
              flowers={flowers}
              includeCoins={includeCoins}
              size="lg"
              animated={true}
              waterReflection={true}
            />
          </div>

          {/* Live Wish Summary Snippet */}
          <div className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 text-center z-10">
            <div className="text-xs text-amber-400/90 font-medium">
              {isAnonymous ? 'ผู้ไม่ประสงค์ออกนาม' : senderName || 'ระบุชื่อของคุณ'}
            </div>
            <div className="text-xs text-slate-300 italic line-clamp-2 mt-1">
              "{wishMessage || 'กำลังเขียนคำอธิษฐาน...'}"
            </div>
          </div>

          {/* BIG FLOAT BUTTON (Accessible for all ages) */}
          <div className="w-full mt-6 z-10">
            <button
              type="button"
              onClick={handleFloatSubmit}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-base sm:text-lg shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-3 font-prompt"
            >
              <Send className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              <span>ลอยกระทงลงสู่สายน้ำ</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              คลิกเพื่อเริ่มแอนิเมชันลอยกระทงและรับการ์ดอธิษฐานมงคล
            </p>
          </div>
        </div>
      </div>

      {/* PRAYER CHANTING MODAL (บทสวดขอขมาพระแม่คงคา) */}
      {showChantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-amber-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-amber-300 font-prompt">
                  บทสวดขอขมาพระแม่คงคา
                </h3>
              </div>
              <button
                onClick={() => setShowChantModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ปิด ✕
              </button>
            </div>

            <div className="my-5 space-y-4 text-center">
              <p className="text-xs text-amber-200/80">
                (ตั้งนะโม ๓ จบ แล้วกล่าวดังนี้)
              </p>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/20 text-amber-100 font-medium leading-relaxed sm:text-base">
                "สัพพัง อะปะราธัง ขะมะถะ เม ภันเต อุกาสะ ขะมามิ ภันเต"
              </div>
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed text-left space-y-2 bg-slate-950/40 p-4 rounded-xl">
                <p>
                  <strong>คำแปล:</strong> ข้าแต่พระแม่คงคา ผู้ทรงคุณอันประเสริฐ ข้าพเจ้าทั้งหลาย ขอกราบไหว้นอบน้อม
                  และขอขมาต่อพระแม่คงคา ที่ได้ใช้น้ำดื่มกินและอาบชำระ หากมีสิ่งหนึ่งสิ่งใดที่ข้าพเจ้าได้ล่วงเกิน
                  ทำให้สายน้ำต้องเศร้าหมอง ขอพระแม่คงคาได้โปรดยกโทษและอโหสิกรรมนั้นแก่ข้าพเจ้าด้วยเทอญ
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setWishMessage(
                    'สัพพัง อะปะราธัง ขะมะถะ เม ภันเต ขอขมาพระแม่คงคา ขอสายน้ำพัดพาสิ่งไม่ดีออกไป และประทานความสุขความร่มเย็นแก่ชีวิต'
                  );
                  setShowChantModal(false);
                  playThaiChime('gentle');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                ใช้ข้อความนี้ในกระทงของฉัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
