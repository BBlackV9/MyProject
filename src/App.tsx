/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FloatingKrathong, KrathongCustomization } from './types/krathong';
import { INITIAL_COMMUNITY_KRATHONGS } from './data/krathongOptions';
import { KrathongBuilder } from './components/KrathongBuilder';
import { RiverCanvas } from './components/RiverCanvas';
import { FloatingCeremonyModal } from './components/FloatingCeremonyModal';
import {
  playThaiChime,
  toggleAmbientSound,
  isAmbientAudioRunning,
} from './utils/audio';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Type,
  Leaf,
  Moon,
  Heart,
  Droplets,
  Calendar,
  Share2,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  // Font size setting for elderly/family accessibility
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  // Audio ambient toggle
  const [audioActive, setAudioActive] = useState<boolean>(false);
  // Floating Krathongs in river
  const [floatingKrathongs, setFloatingKrathongs] = useState<FloatingKrathong[]>(() => {
    try {
      const saved = localStorage.getItem('loy_krathong_community');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return INITIAL_COMMUNITY_KRATHONGS;
  });

  // Current active ceremony modal
  const [activeCeremony, setActiveCeremony] = useState<KrathongCustomization | null>(null);
  // Highlighted Krathong in the river
  const [highlightKrathongId, setHighlightKrathongId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('loy_krathong_community', JSON.stringify(floatingKrathongs));
    } catch {}
  }, [floatingKrathongs]);

  // Audio ambient toggle handler
  const handleToggleAudio = () => {
    const running = toggleAmbientSound();
    setAudioActive(running);
  };

  // Font size cycler
  const handleCycleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xlarge');
    else setFontSize('normal');
    playThaiChime('gentle');
  };

  // Handle user floating krathong
  const handleFloatKrathong = (customization: KrathongCustomization) => {
    const newId = `user-${Date.now()}`;
    const newKrathong: FloatingKrathong = {
      id: newId,
      senderName: customization.senderName,
      wishMessage: customization.wishMessage,
      wishCategory: customization.wishCategory,
      baseId: customization.baseId,
      candleColorId: customization.candleColorId,
      incenseId: customization.incenseId,
      flowers: customization.flowers,
      includeCoins: customization.includeCoins,
      createdAt: Date.now(),
      blessCount: 1,
      // Distribute naturally in river
      xPercent: Math.floor(Math.random() * 55) + 20,
      yPercent: Math.floor(Math.random() * 40) + 40,
      scale: 1.05,
      driftSpeed: 0.04,
    };

    setFloatingKrathongs((prev) => [newKrathong, ...prev]);
    setHighlightKrathongId(newId);
    setActiveCeremony(customization);
  };

  // Handle blessing a krathong
  const handleBlessKrathong = (id: string) => {
    setFloatingKrathongs((prev) =>
      prev.map((k) => (k.id === id ? { ...k, blessCount: k.blessCount + 1 } : k))
    );
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      playThaiChime('gentle');
    }
  };

  const fontSizeClass =
    fontSize === 'xlarge'
      ? 'text-lg sm:text-xl'
      : fontSize === 'large'
      ? 'text-base sm:text-lg'
      : 'text-sm sm:text-base';

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Sarabun',sans-serif] ${fontSizeClass}`}>
      {/* 1. TOP BAR CONTRACT: Exactly 3 zones */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 border-b border-amber-500/20 bg-slate-950/90 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-base sm:text-lg font-bold tracking-tight text-amber-300 whitespace-nowrap shrink-0 font-prompt flex items-center gap-2"
        >
          <span className="text-xl">🪷</span>
          <span>ลอยกระทงออนไลน์ ๒๕๖๙</span>
        </a>

        {/* Zone 2: Single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#builder"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('builder');
            }}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            สร้างกระทง
          </a>
          <a
            href="#river"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('river');
            }}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            สายน้ำรวมใจ
          </a>
          <a
            href="#heritage"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('heritage');
            }}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            คุณค่าประเพณี
          </a>
          <a
            href="#eco"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('eco');
            }}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            รักษ์สิ่งแวดล้อม
          </a>
        </nav>

        {/* Zone 3: 1 primary action + Accessibility utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sound toggle button */}
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`p-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
              audioActive
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={audioActive ? 'ปิดเสียงบรรยากาศ' : 'เปิดเสียงสายน้ำและระฆังไทย'}
          >
            {audioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{audioActive ? 'เปิดเสียง' : 'ปิดเสียง'}</span>
          </button>

          {/* Font size cycler for all ages */}
          <button
            type="button"
            onClick={handleCycleFontSize}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1"
            title="ปรับขนาดตัวอักษรสำหรับผู้สูงวัย"
          >
            <Type className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold">
              {fontSize === 'normal' ? 'ก' : fontSize === 'large' ? 'ก+' : 'ก++'}
            </span>
          </button>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => scrollToSection('builder')}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 transition-all active:scale-95 whitespace-nowrap shrink-0 font-prompt"
          >
            ลอยกระทงทันที
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative w-full min-h-[580px] sm:min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image Asset */}
        <img
          src="/src/assets/images/hero_loy_krathong_river_1793475513657.jpg"
          alt="คืนวันเพ็ญลอยกระทงริมแม่น้ำเจ้าพระยาพร้อมโคมลอยสว่างไสว"
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />

        {/* Deep Atmospheric Contrast Scrim (ensuring WCAG AA 4.5:1 legibility) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.7)_100%)]"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-slate-950/70 px-4 py-1.5 text-xs sm:text-sm text-amber-300 shadow-lg backdrop-blur-md">
            <Moon className="w-4 h-4 text-amber-300" />
            <span>วันเพ็ญขึ้น ๑๕ ค่ำ เดือน ๑๒ · ร่วมสืบสานประเพณีไทย</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-prompt leading-tight text-balance">
            ลอยกระทงออนไลน์ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
              ขอขมาพระแม่คงคา ใต้แสงจันทร์วันเพ็ญ
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-200 text-sm sm:text-base leading-relaxed text-balance">
            ประดิษฐ์กระทงออนไลน์ตามสไตล์คุณ จุดแสงประทีปส่งคำขอขมาและคำอธิษฐานลงสู่สายน้ำ
            ปลอดภัย รักษ์โลก ๑๐๐% เหมาะสำหรับทุกคนในองค์กรและครอบครัวทุกวัย
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('builder')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 font-prompt"
            >
              <span>เริ่มสร้างกระทงของคุณ</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scrollToSection('river')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-amber-200 border border-amber-500/30 font-semibold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>ชมสายน้ำรวมใจ</span>
            </button>
          </div>

          {/* Social Proof & Eco Impact Strip */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="rounded-xl border border-amber-500/15 bg-slate-950/60 p-3 backdrop-blur-sm">
              <div className="text-xs text-slate-400">ร่วมลอยแล้ว</div>
              <div className="text-lg sm:text-xl font-bold text-amber-300 font-prompt tabular-nums">
                {floatingKrathongs.length + 1840} ใบ
              </div>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-slate-950/60 p-3 backdrop-blur-sm">
              <div className="text-xs text-slate-400">ลดขยะสู่แม่น้ำ</div>
              <div className="text-lg sm:text-xl font-bold text-emerald-400 font-prompt">
                ๑๐๐% Zero Waste
              </div>
            </div>
            <div className="rounded-xl border border-amber-500/15 bg-slate-950/60 p-3 backdrop-blur-sm">
              <div className="text-xs text-slate-400">ส่งใจอนุโมทนา</div>
              <div className="text-lg sm:text-xl font-bold text-rose-300 font-prompt tabular-nums">
                ๔,๙๕๐+ ครั้ง
              </div>
            </div>
            <div className="rounded-xl border border-amber-500/15 bg-slate-950/60 p-3 backdrop-blur-sm">
              <div className="text-xs text-slate-400">เหมาะกับ</div>
              <div className="text-lg sm:text-xl font-bold text-amber-300 font-prompt">
                พนักงานทุกวัย
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KRATHONG BUILDER SECTION */}
      <section id="builder" className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-16">
        <KrathongBuilder
          onFloatKrathong={handleFloatKrathong}
          fontSize={fontSize}
        />
      </section>

      {/* 4. THE RIVER OF WISHES SECTION */}
      <section id="river" className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-12">
        <RiverCanvas
          floatingKrathongs={floatingKrathongs}
          onBlessKrathong={handleBlessKrathong}
          highlightKrathongId={highlightKrathongId}
        />
      </section>

      {/* 5. CULTURAL HERITAGE & LEGEND */}
      <section id="heritage" className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-16 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
            คุณค่าแห่งประเพณีไทย
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-prompt">
            ความหมายอันลึกซึ้งของ "วันลอยกระทง"
          </h2>
          <p className="text-sm text-slate-400">
            ประเพณีที่สืบทอดมาแต่โบราณกาล เพื่อรำลึกถึงพระคุณของสายน้ำและสร้างความกลมเกลียว
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-300 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white font-prompt">
                ๐๑. ขอขมาพระแม่คงคา
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                มนุษย์ได้ใช้น้ำในการดื่มกิน อาบ ชำระล้าง และการเกษตร การลอยกระทงจึงเป็นการแสดงความกตัญญูกตเวทิตา
                และขอขมาต่อพระแม่คงคาหากเคยทิ้งสิ่งปฏิกูลลงสู่สายน้ำ
              </p>
            </div>
            <div className="pt-2 text-xs text-amber-300/80 font-medium">
              สืบสานความกตัญญูต่อธรรมชาติ
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-300 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white font-prompt">
                ๐๒. บูชารอยพระพุทธบาท
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                ตามคติพุทธศาสนา เป็นการลอยประทีปเพื่อบูชารอยพระพุทธบาทที่ประดิษฐาน ณ ริมฝั่งแม่น้ำนัมมทานที
                เปลวเทียนที่สว่างไสวเป็นตัวแทนแห่งแสงสว่างทางปัญญา
              </p>
            </div>
            <div className="pt-2 text-xs text-amber-300/80 font-medium">
              แสงสว่างแห่งธรรมและสติปัญญา
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-300 flex items-center justify-center">
                <Heart className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white font-prompt">
                ๐๓. ลอยทุกข์โศก รับมิ่งมงคล
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                เปรียบเสมือนการปล่อยวางความทุกข์ ความขุ่นข้องหมองใจ และเคราะห์ภัย ให้ไหลไปกับสายน้ำ
                พร้อมตั้งจิตอธิษฐานรับพลังบวกและความหวังใหม่ในชีวิต
              </p>
            </div>
            <div className="pt-2 text-xs text-amber-300/80 font-medium">
              เริ่มต้นชีวิตด้วยใจที่ผ่องใส
            </div>
          </div>
        </div>
      </section>

      {/* 6. ECO INITIATIVE & SUSTAINABILITY */}
      <section id="eco" className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-16 border-t border-slate-900">
        <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 p-6 sm:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                <Leaf className="w-3.5 h-3.5" />
                <span>โครงการลอยกระทงรักษ์โลก ๒๕๖๙</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-prompt">
                ทำไมองค์กรยุคใหม่และพวกเราทุกคน จึงควรลอยกระทงออนไลน์?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                ในแต่ละปี แม่น้ำเจ้าพระยาและลำคลองทั่วประเทศต้องรองรับกระทงจริงนับล้านใบ ซึ่งสร้างขยะและส่งผลกระทบต่อสิ่งมีชีวิตในน้ำ
                การลอยกระทงออนไลน์ช่วยรักษาแก่นแท้แห่งความกตัญญูและสืบสานประเพณีไทย โดยไม่ทิ้งรอยแผลไว้ให้แม่น้ำ
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200">ลดขยะในแม่น้ำ ๑๐๐% ไม่ต้องเก็บกู้</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200">ปลอดภัย ไร้อุบัติเหตุริมน้ำและควันไฟ</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200">ร่วมได้จากทุกที่ทั่วโลก ผ่านมือถือและคอมพิวเตอร์</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200">การ์ดอธิษฐานส่งต่อเป็นกำลังใจให้เพื่อนร่วมงาน</span>
                </div>
              </div>
            </div>

            {/* Visual Image Slot */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl max-w-sm">
                <img
                  src="/src/assets/images/thai_moonlit_water_1793475513467.jpg"
                  alt="กระทงดอกบัวชมพูสะท้อนแสงเทียนบนผิวน้ำอันสงบ"
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 text-center">
                  <span className="text-xs text-amber-300 font-medium font-prompt">
                    สืบสานคุณค่า รักษาสายน้ำอย่างยั่งยืน
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. QUIET EDITORIAL FOOTER */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 px-4 sm:px-8 py-8 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🪷</span>
            <span className="font-bold text-amber-300 font-prompt">ลอยกระทงออนไลน์ ๒๕๖๙</span>
            <span className="text-slate-600">·</span>
            <span>สืบสานประเพณีไทย คืนความใสให้แม่น้ำคงคา</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => scrollToSection('builder')}
              className="hover:text-amber-300 transition-colors"
            >
              สร้างกระทง
            </button>
            <button
              onClick={() => scrollToSection('river')}
              className="hover:text-amber-300 transition-colors"
            >
              สายน้ำรวมใจ
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-amber-300 transition-colors"
            >
              กลับสู่ด้านบน &uarr;
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center sm:text-left text-[11px] text-slate-600 mt-4">
          ขออำนาจคุณพระศรีรัตนตรัยและพระแม่คงคา ดลบันดาลให้ทุกท่านมีความสุข ความเจริญ และสุขภาพแข็งแรง
        </div>
      </footer>

      {/* 8. ACTIVE FLOATING CEREMONY & CERTIFICATE MODAL */}
      {activeCeremony && (
        <FloatingCeremonyModal
          customization={activeCeremony}
          onClose={() => setActiveCeremony(null)}
          onViewInRiver={() => {
            setActiveCeremony(null);
            scrollToSection('river');
          }}
        />
      )}
    </div>
  );
}
