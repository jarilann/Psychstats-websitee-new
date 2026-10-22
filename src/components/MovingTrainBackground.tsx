import React, { useState } from 'react';
import { Play, Pause, Gauge } from 'lucide-react';

interface MovingTrainBackgroundProps {
  speedMultiplier?: number;
}

export const MovingTrainBackground: React.FC<MovingTrainBackgroundProps> = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMode, setSpeedMode] = useState<'cruising' | 'express'>('cruising');

  const speedClass = isPlaying
    ? speedMode === 'express'
      ? 'motion-express'
      : 'motion-cruising'
    : 'motion-paused';

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none skyline"
      aria-hidden="true"
    >
      {/* Pixel Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c1e] via-[#16162d] to-[#242442]" />

      {/* Pixel Stars / City Dust */}
      <div
        className="absolute inset-x-0 top-0 h-80 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 25px 35px, #f8c300, transparent), radial-gradient(1.5px 1.5px at 120px 80px, #ffffff, transparent), radial-gradient(1px 1px at 240px 45px, #f47920, transparent), radial-gradient(2px 2px at 380px 110px, #f2efeb, transparent)',
          backgroundSize: '450px 220px'
        }}
      />

      {/* Layer 1: Pixel Mountains (Moving) */}
      <div
        className={`absolute bottom-32 sm:bottom-40 inset-x-0 h-64 opacity-50 bg-repeat-x bg-bottom anim-pixel-mountains ${speedClass}`}
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20" viewBox="0 0 40 20"><path d="M0 20 L10 5 L20 15 L30 0 L40 20 Z" fill="%231a1a2e"/></svg>')`,
          backgroundSize: '600px 220px',
          imageRendering: 'pixelated'
        }}
      />

      {/* Layer 2: Midground Pixel Urban Skyline Silhouettes */}
      <div
        className={`absolute bottom-24 sm:bottom-28 inset-x-0 h-40 opacity-45 bg-repeat-x bg-bottom anim-pixel-mountains ${speedClass}`}
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="40" viewBox="0 0 80 40"><rect x="0" y="20" width="12" height="20" fill="%23121224"/><rect x="15" y="10" width="18" height="30" fill="%23141426"/><rect x="36" y="25" width="14" height="15" fill="%23121224"/><rect x="53" y="15" width="22" height="25" fill="%23141426"/></svg>')`,
          backgroundSize: '480px 180px',
          imageRendering: 'pixelated'
        }}
      />

      {/* Layer 3: Industrial PNR Rail Track */}
      <div className="absolute bottom-16 sm:bottom-20 inset-x-0 h-10 border-t-4 border-b-4 border-[#444] bg-[#161618] overflow-hidden">
        <div
          className={`w-[200%] h-full anim-pixel-track ${speedClass}`}
          style={{
            background:
              'repeating-linear-gradient(90deg, #222 0, #222 10px, transparent 10px, transparent 36px)'
          }}
        />
        {/* Steel Rails */}
        <div className="absolute inset-x-0 top-0.5 h-[2px] bg-[#f8c300] opacity-80" />
        <div className="absolute inset-x-0 bottom-0.5 h-[2px] bg-[#f47920] opacity-80" />
      </div>

      {/* Layer 4: Animated Moving Philippine PNR Train Sprite */}
      <div className={`absolute bottom-20 sm:bottom-24 inset-x-0 h-28 pointer-events-none z-10 overflow-hidden ${speedClass}`}>
        <div className="anim-pnr-train absolute bottom-0 left-0 flex items-end">
          
          {/* Headlight Beam (Yellow Glow Forward) */}
          <div
            className="absolute right-0 bottom-1 w-96 h-20 pointer-events-none z-0"
            style={{
              transform: 'translateX(99%)',
              background: 'linear-gradient(90deg, rgba(248, 195, 0, 0.6) 0%, rgba(244, 121, 32, 0.2) 50%, transparent 100%)',
              clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 70%)'
            }}
          />

          {/* Pixel Smoke Puffs */}
          <div className="absolute right-20 top-2 z-20">
            <div className="w-3 h-3 bg-[#f2efeb] opacity-80 anim-pnr-steam absolute -top-1" />
            <div className="w-4 h-4 bg-[#f8c300] opacity-60 anim-pnr-steam absolute -top-3 -left-3" />
          </div>

          {/* Authentic Philippine PNR Train Sprite (Rotem DMU / KiHa Hybrid Pixel Art) */}
          <svg
            className="h-20 w-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
            viewBox="0 0 460 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Coach 2 (Rear Car) */}
            <g id="pnr-coach-2">
              <rect x="10" y="12" width="130" height="42" fill="#003399" stroke="#002066" strokeWidth="2" />
              {/* PNR Signature Orange Stripe */}
              <rect x="10" y="28" width="130" height="8" fill="#f47920" />
              {/* Roof */}
              <rect x="12" y="8" width="126" height="5" fill="#f2efeb" opacity="0.8" />
              {/* Illuminated Windows */}
              <rect x="22" y="16" width="18" height="10" fill="#f2efeb" opacity="0.9" />
              <rect x="46" y="16" width="18" height="10" fill="#f2efeb" opacity="0.9" />
              <rect x="70" y="16" width="18" height="10" fill="#f2efeb" opacity="0.9" />
              <rect x="94" y="16" width="18" height="10" fill="#f2efeb" opacity="0.9" />
              <rect x="118" y="16" width="14" height="10" fill="#f2efeb" opacity="0.9" />
              {/* Bogies / Wheels */}
              <rect x="24" y="54" width="14" height="8" fill="#111113" />
              <rect x="42" y="54" width="14" height="8" fill="#111113" />
              <rect x="96" y="54" width="14" height="8" fill="#111113" />
              <rect x="114" y="54" width="14" height="8" fill="#111113" />
            </g>

            {/* Coupler */}
            <rect x="140" y="40" width="12" height="6" fill="#444" />

            {/* Coach 1 (Middle Car) */}
            <g id="pnr-coach-1">
              <rect x="152" y="12" width="130" height="42" fill="#003399" stroke="#002066" strokeWidth="2" />
              {/* PNR Signature Orange Stripe */}
              <rect x="152" y="28" width="130" height="8" fill="#f47920" />
              {/* Roof */}
              <rect x="154" y="8" width="126" height="5" fill="#f2efeb" opacity="0.8" />
              {/* Windows */}
              <rect x="164" y="16" width="18" height="10" fill="#f8c300" opacity="0.9" />
              <rect x="188" y="16" width="18" height="10" fill="#f8c300" opacity="0.9" />
              <rect x="212" y="16" width="18" height="10" fill="#f8c300" opacity="0.9" />
              <rect x="236" y="16" width="18" height="10" fill="#f8c300" opacity="0.9" />
              <rect x="260" y="16" width="14" height="10" fill="#f8c300" opacity="0.9" />
              {/* Bogies / Wheels */}
              <rect x="166" y="54" width="14" height="8" fill="#111113" />
              <rect x="184" y="54" width="14" height="8" fill="#111113" />
              <rect x="238" y="54" width="14" height="8" fill="#111113" />
              <rect x="256" y="54" width="14" height="8" fill="#111113" />
            </g>

            {/* Coupler */}
            <rect x="282" y="40" width="12" height="6" fill="#444" />

            {/* Lead Motor Car / Cab Engine */}
            <g id="pnr-lead-cab">
              {/* Main Body */}
              <rect x="294" y="12" width="140" height="42" fill="#003399" stroke="#002066" strokeWidth="2" />
              {/* Front Aerodynamic Nose Cut */}
              <polygon points="434,12 452,28 452,54 434,54" fill="#003399" />
              {/* Orange Racing Stripe */}
              <rect x="294" y="28" width="140" height="8" fill="#f47920" />
              <polygon points="434,28 452,36 448,36 434,36" fill="#f47920" />
              {/* Roof */}
              <rect x="296" y="8" width="136" height="5" fill="#f2efeb" opacity="0.8" />
              {/* Windshield */}
              <polygon points="426,16 444,25 444,28 426,28" fill="#f2efeb" opacity="0.95" />
              {/* Passenger Windows */}
              <rect x="306" y="16" width="18" height="10" fill="#f8c300" opacity="0.9" />
              <rect x="330" y="16" width="18" height="10" fill="#f8c300" opacity="0.9" />
              <rect x="354" y="16" width="18" height="10" fill="#f8c300" opacity="0.9" />
              <rect x="378" y="16" width="18" height="10" fill="#f8c300" opacity="0.9" />
              {/* Dual Bright Headlights */}
              <rect x="446" y="40" width="6" height="6" fill="#f8c300" />
              <rect x="448" y="42" width="2" height="2" fill="#ffffff" />
              {/* Bogies / Wheels */}
              <rect x="308" y="54" width="14" height="8" fill="#111113" />
              <rect x="326" y="54" width="14" height="8" fill="#111113" />
              <rect x="390" y="54" width="14" height="8" fill="#111113" />
              <rect x="408" y="54" width="14" height="8" fill="#111113" />
            </g>
          </svg>

        </div>
      </div>

      {/* Scrim Overlay for Content Readability */}
      <div className="absolute inset-0 bg-[#111113]/85 pointer-events-none" />

      {/* Pixel Rail Speed & Motion Toggle Pill */}
      <div className="fixed bottom-4 right-4 z-50 pointer-events-auto flex items-center gap-2 p-1.5 bg-[#18181a] border-2 border-[#f2efeb] shadow-[4px_4px_0px_#f47920] text-xs font-mono text-[#f2efeb]">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-1 px-2.5 py-1 transition-colors cursor-pointer ${
            isPlaying ? 'bg-[#f8c300] text-black font-bold' : 'bg-transparent text-white hover:bg-[#222]'
          }`}
          title={isPlaying ? 'Pause Scenery Motion' : 'Resume Scenery Motion'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="font-mono text-[11px] uppercase">{isPlaying ? 'PNR Moving' : 'Paused'}</span>
        </button>

        {isPlaying && (
          <button
            onClick={() => setSpeedMode(speedMode === 'cruising' ? 'express' : 'cruising')}
            className="flex items-center gap-1 px-2 py-1 text-[#f8c300] hover:text-white font-mono text-[11px] uppercase cursor-pointer"
            title="Toggle Train Speed"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>{speedMode}</span>
          </button>
        )}
      </div>

    </div>
  );
};
