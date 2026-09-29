/**
 * CampusPilot – Marwadi University 3D Digital Twin Map
 * Clean, architectural spatial canvas with zero visual noise.
 */

import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { CAMPUS_BUILDINGS, CAMPUS_NODES, CAMPUS_EDGES } from '../data/campusData';
import { Building, RoutePreference, RouteOptimizer } from '../types';
import {
  Layers,
  Box,
  Plus,
  Minus,
  Crosshair,
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Accessibility,
  Navigation,
  Info,
  X,
  DoorClosed,
  Moon,
  Sun,
  MapPin,
} from 'lucide-react';

export const Map3DView: React.FC = () => {
  const {
    selectedBuilding,
    setSelectedBuilding,
    activeAlgorithm,
    setActiveAlgorithm,
    activePreference,
    setActivePreference,
    currentRoute,
    userLocation,
    isEmergencyActive,
    blockedEdgeIds,
    isNavigating,
    setIsNavigating,
    navigationStepIndex,
    setNavigationStepIndex,
    setActiveScreen,
  } = useCampus();

  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showNightGlow, setShowNightGlow] = useState<boolean>(false);
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(false);
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  const algorithms: RouteOptimizer[] = ['A*', 'Dijkstra'];
  const preferences: {
    type: RoutePreference;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    time: string;
  }[] = [
    { type: 'FASTEST', label: 'Fastest', icon: Zap, time: '5 min' },
    { type: 'SAFEST', label: 'Safest', icon: ShieldCheck, time: '7 min' },
    { type: 'ACCESSIBLE', label: 'Step-Free', icon: Accessibility, time: '8 min' },
  ];

  const handleBuildingClick = (b: Building) => {
    setSelectedBuilding(b);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const activeStep = currentRoute?.steps[navigationStepIndex] || currentRoute?.steps[0];

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#090d15] text-slate-100 select-none">
      {/* Top Floating Controls Capsule */}
      <div className="absolute top-3 inset-x-4 z-30 flex items-center justify-between pointer-events-none">
        {/* Left: View & Theme Mode */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0e1320]/80 backdrop-blur-md border border-white/[0.08] shadow-sm pointer-events-auto">
          <button
            onClick={() => setIs3DMode(true)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              is3DMode
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3D View
          </button>
          <button
            onClick={() => setIs3DMode(false)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              !is3DMode
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2D Plan
          </button>
          <div className="w-[1px] h-3.5 bg-white/[0.08] mx-0.5" />
          <button
            onClick={() => setShowNightGlow(!showNightGlow)}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Toggle Night Mode"
          >
            {showNightGlow ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right: Minimal Solver Selection */}
        <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-[#0e1320]/80 backdrop-blur-md border border-white/[0.08] shadow-sm pointer-events-auto text-xs text-slate-400">
          <span className="px-2 text-[11px] text-slate-500 font-mono">Routing:</span>
          {algorithms.map((algo) => (
            <button
              key={algo}
              onClick={() => setActiveAlgorithm(algo)}
              className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                activeAlgorithm === algo
                  ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {algo}
            </button>
          ))}
        </div>
      </div>

      {/* Turn-by-Turn Navigation Minimalist HUD */}
      {isNavigating && activeStep && (
        <div className="absolute top-14 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 max-w-sm w-full p-3 rounded-xl bg-[#0e1320]/90 backdrop-blur-md border border-white/[0.1] shadow-xl flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0">
              {activeStep.direction === 'right' ? (
                <CornerUpRight className="w-4 h-4" />
              ) : activeStep.direction === 'left' ? (
                <CornerUpLeft className="w-4 h-4" />
              ) : activeStep.direction === 'arrive' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">{activeStep.instruction}</div>
              <div className="text-[10px] text-slate-400">
                Step {activeStep.stepIndex} of {currentRoute?.steps.length} · {activeStep.distanceMeters} m
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              disabled={navigationStepIndex === 0}
              onClick={() => setNavigationStepIndex(Math.max(0, navigationStepIndex - 1))}
              className="p-1 rounded bg-white/[0.05] disabled:opacity-30 hover:bg-white/[0.1] text-slate-300 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              disabled={!currentRoute || navigationStepIndex >= currentRoute.steps.length - 1}
              onClick={() => setNavigationStepIndex(navigationStepIndex + 1)}
              className="p-1 rounded bg-white/[0.05] disabled:opacity-30 hover:bg-white/[0.1] text-slate-300 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsNavigating(false)}
              className="ml-1 px-2 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 text-xs cursor-pointer"
            >
              End
            </button>
          </div>
        </div>
      )}

      {/* Emergency Active Quiet Banner */}
      {isEmergencyActive && (
        <div className="absolute top-14 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-30 max-w-md w-full p-2.5 rounded-lg bg-red-950/80 border border-red-800/80 text-white backdrop-blur-md shadow-lg flex items-center justify-between text-xs">
          <span className="font-medium text-red-200 truncate">
            Safety protocol: Campus paths rerouted to Highway Gate 1
          </span>
          <button
            onClick={() => setActiveScreen('emergency')}
            className="ml-2 px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white font-semibold shrink-0 cursor-pointer text-xs"
          >
            View Evacuation
          </button>
        </div>
      )}

      {/* 3D Map Canvas */}
      <div
        className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full max-w-[1300px] max-h-[850px] object-contain transition-transform duration-200"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel}) ${
              is3DMode ? 'rotateX(24deg) rotateZ(-4deg)' : ''
            }`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            <filter id="cleanShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.4" />
            </filter>

            {/* Subtle building roofs */}
            <linearGradient id="roofAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="roofFoe" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e2d42" />
              <stop offset="100%" stopColor="#121b29" />
            </linearGradient>

            <linearGradient id="roofLib" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#132e35" />
              <stop offset="100%" stopColor="#0c1d22" />
            </linearGradient>

            <linearGradient id="roofFood" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a2638" />
              <stop offset="100%" stopColor="#101824" />
            </linearGradient>
          </defs>

          {/* Clean Dark Campus Ground */}
          <rect
            x="40"
            y="40"
            width="920"
            height="620"
            rx="20"
            fill={showNightGlow ? '#060910' : '#0b0f19'}
            stroke="#1a2233"
            strokeWidth="1.5"
          />

          {/* Central Courtyard & Green Quad */}
          <rect
            x="370"
            y="325"
            width="220"
            height="140"
            rx="12"
            fill="#061a14"
            stroke="#0a2e23"
            strokeWidth="1"
          />
          <ellipse cx="480" cy="395" rx="35" ry="20" fill="#0c2e3d" opacity="0.5" />

          {/* Subtle Ground Pathways */}
          <g stroke="#1a2436" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {CAMPUS_EDGES.map((e) => {
              const fromN = CAMPUS_NODES.find((n) => n.id === e.from);
              const toN = CAMPUS_NODES.find((n) => n.id === e.to);
              if (!fromN || !toN) return null;
              return <line key={e.id} x1={fromN.x} y1={fromN.y} x2={toN.x} y2={toN.y} />;
            })}
          </g>

          {/* Walkways Inner Subtle Guide Line */}
          <g stroke="#26344d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {CAMPUS_EDGES.map((e) => {
              const fromN = CAMPUS_NODES.find((n) => n.id === e.from);
              const toN = CAMPUS_NODES.find((n) => n.id === e.to);
              if (!fromN || !toN) return null;
              const isBlocked = blockedEdgeIds.includes(e.id);
              return (
                <line
                  key={'inner-' + e.id}
                  x1={fromN.x}
                  y1={fromN.y}
                  x2={toN.x}
                  y2={toN.y}
                  stroke={isBlocked ? '#ef4444' : '#26344d'}
                  strokeDasharray={isBlocked ? '4 4' : undefined}
                />
              );
            })}
          </g>

          {/* Active Route Ribbon - Clean, Non-noisy */}
          {currentRoute && currentRoute.nodes.length > 1 && (
            <g>
              <polyline
                points={currentRoute.nodes.map((n) => `${n.x},${n.y}`).join(' ')}
                fill="none"
                stroke={isEmergencyActive ? '#10b981' : '#0284c7'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.25"
              />
              <polyline
                points={currentRoute.nodes.map((n) => `${n.x},${n.y}`).join(' ')}
                fill="none"
                stroke={isEmergencyActive ? '#34d399' : '#38bdf8'}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* Foliage (Subtle Minimal Trees) */}
          <g fill="#0b291d" opacity="0.6">
            <circle cx="430" cy="380" r="10" />
            <circle cx="510" cy="380" r="11" />
            <circle cx="580" cy="330" r="9" />
            <circle cx="620" cy="270" r="11" />
            <circle cx="360" cy="280" r="11" />
            <circle cx="730" cy="390" r="10" />
          </g>

          {/* ======================================================== */}
          {/* ARCHITECTURAL BUILDINGS (Subtle, Clean Prisms)           */}
          {/* ======================================================== */}

          {/* 1. Main Admin Building */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[0])}
            onMouseEnter={() => setHoveredBuilding(CAMPUS_BUILDINGS[0].id)}
            onMouseLeave={() => setHoveredBuilding(null)}
            filter="url(#cleanShadow)"
          >
            <path d="M 390 150 L 550 150 L 570 210 L 410 210 Z" fill="#0d1422" stroke="#1e293b" strokeWidth="1" />
            <polygon
              points="390,110 550,110 570,170 410,170"
              fill="url(#roofAdmin)"
              stroke={selectedBuilding?.id === CAMPUS_BUILDINGS[0].id ? '#38bdf8' : '#334155'}
              strokeWidth={selectedBuilding?.id === CAMPUS_BUILDINGS[0].id ? 2 : 1}
            />
            <ellipse cx="480" cy="135" rx="22" ry="12" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            <g transform="translate(480, 88)">
              <rect x="-65" y="-12" width="130" height="18" rx="4" fill="#0a0d14" fillOpacity="0.85" stroke="#1e293b" strokeWidth="1" />
              <text x="0" y="1" fill="#cbd5e1" fontSize="9.5" fontWeight="600" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">
                Main Admin (MU-MB)
              </text>
            </g>
          </g>

          {/* 2. FOE Engineering Block */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[1])}
            onMouseEnter={() => setHoveredBuilding(CAMPUS_BUILDINGS[1].id)}
            onMouseLeave={() => setHoveredBuilding(null)}
            filter="url(#cleanShadow)"
          >
            <path d="M 140 260 L 300 260 L 320 325 L 160 325 Z" fill="#0d1422" stroke="#1e293b" strokeWidth="1" />
            <polygon
              points="140,220 300,220 320,285 160,285"
              fill="url(#roofFoe)"
              stroke={selectedBuilding?.id === CAMPUS_BUILDINGS[1].id ? '#38bdf8' : '#334155'}
              strokeWidth={selectedBuilding?.id === CAMPUS_BUILDINGS[1].id ? 2 : 1}
            />
            <g transform="translate(230, 198)">
              <rect x="-65" y="-12" width="130" height="18" rx="4" fill="#0a0d14" fillOpacity="0.85" stroke="#1e293b" strokeWidth="1" />
              <text x="0" y="1" fill="#cbd5e1" fontSize="9.5" fontWeight="600" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">
                FOE Engineering (MU-FOE)
              </text>
            </g>
          </g>

          {/* 3. Central Digital Library */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[2])}
            onMouseEnter={() => setHoveredBuilding(CAMPUS_BUILDINGS[2].id)}
            onMouseLeave={() => setHoveredBuilding(null)}
            filter="url(#cleanShadow)"
          >
            <path d="M 620 270 L 780 270 L 800 335 L 640 335 Z" fill="#0d1422" stroke="#1e293b" strokeWidth="1" />
            <polygon
              points="620,230 780,230 800,295 640,295"
              fill="url(#roofLib)"
              stroke={selectedBuilding?.id === CAMPUS_BUILDINGS[2].id ? '#38bdf8' : '#334155'}
              strokeWidth={selectedBuilding?.id === CAMPUS_BUILDINGS[2].id ? 2 : 1}
            />
            <g transform="translate(710, 208)">
              <rect x="-65" y="-12" width="130" height="18" rx="4" fill="#0a0d14" fillOpacity="0.85" stroke="#1e293b" strokeWidth="1" />
              <text x="0" y="1" fill="#cbd5e1" fontSize="9.5" fontWeight="600" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">
                Central Library (MU-CL)
              </text>
            </g>
          </g>

          {/* 4. Faculty of Management Studies & Law */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[3])}
            onMouseEnter={() => setHoveredBuilding(CAMPUS_BUILDINGS[3].id)}
            onMouseLeave={() => setHoveredBuilding(null)}
            filter="url(#cleanShadow)"
          >
            <polygon
              points="665,125 795,125 815,175 685,175"
              fill="#102322"
              stroke={selectedBuilding?.id === CAMPUS_BUILDINGS[3].id ? '#38bdf8' : '#27433f'}
              strokeWidth={selectedBuilding?.id === CAMPUS_BUILDINGS[3].id ? 2 : 1}
            />
            <g transform="translate(740, 106)">
              <rect x="-55" y="-11" width="110" height="17" rx="4" fill="#0a0d14" fillOpacity="0.85" stroke="#1e293b" strokeWidth="1" />
              <text x="0" y="1" fill="#cbd5e1" fontSize="9" fontWeight="600" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">
                FMS & Law (MU-FMS)
              </text>
            </g>
          </g>

          {/* 5. Food Court & Amul */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[4])}
            onMouseEnter={() => setHoveredBuilding(CAMPUS_BUILDINGS[4].id)}
            onMouseLeave={() => setHoveredBuilding(null)}
            filter="url(#cleanShadow)"
          >
            <polygon
              points="215,475 345,475 365,525 235,525"
              fill="url(#roofFood)"
              stroke={selectedBuilding?.id === CAMPUS_BUILDINGS[4].id ? '#38bdf8' : '#334155'}
              strokeWidth={selectedBuilding?.id === CAMPUS_BUILDINGS[4].id ? 2 : 1}
            />
            <g transform="translate(290, 456)">
              <rect x="-60" y="-11" width="120" height="17" rx="4" fill="#0a0d14" fillOpacity="0.85" stroke="#1e293b" strokeWidth="1" />
              <text x="0" y="1" fill="#cbd5e1" fontSize="9" fontWeight="600" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">
                Food Court & Amul (MU-FC)
              </text>
            </g>
          </g>

          {/* 6. Sports Pavilion */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[5])}
            onMouseEnter={() => setHoveredBuilding(CAMPUS_BUILDINGS[5].id)}
            onMouseLeave={() => setHoveredBuilding(null)}
            filter="url(#cleanShadow)"
          >
            <polygon
              points="710,485 850,485 870,540 730,540"
              fill="#13231f"
              stroke={selectedBuilding?.id === CAMPUS_BUILDINGS[5].id ? '#38bdf8' : '#27443d'}
              strokeWidth={selectedBuilding?.id === CAMPUS_BUILDINGS[5].id ? 2 : 1}
            />
            <g transform="translate(790, 466)">
              <rect x="-60" y="-11" width="120" height="17" rx="4" fill="#0a0d14" fillOpacity="0.85" stroke="#1e293b" strokeWidth="1" />
              <text x="0" y="1" fill="#cbd5e1" fontSize="9" fontWeight="600" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">
                Sports Complex (MU-SP)
              </text>
            </g>
          </g>

          {/* 7. Hostel Towers */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[6])}
            onMouseEnter={() => setHoveredBuilding(CAMPUS_BUILDINGS[6].id)}
            onMouseLeave={() => setHoveredBuilding(null)}
            filter="url(#cleanShadow)"
          >
            <polygon
              points="450,570 575,570 595,620 470,620"
              fill="#191c2e"
              stroke={selectedBuilding?.id === CAMPUS_BUILDINGS[6].id ? '#38bdf8' : '#333857'}
              strokeWidth={selectedBuilding?.id === CAMPUS_BUILDINGS[6].id ? 2 : 1}
            />
            <g transform="translate(520, 551)">
              <rect x="-55" y="-11" width="110" height="17" rx="4" fill="#0a0d14" fillOpacity="0.85" stroke="#1e293b" strokeWidth="1" />
              <text x="0" y="1" fill="#cbd5e1" fontSize="9" fontWeight="600" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">
                Hostels & Clinic (MU-HST)
              </text>
            </g>
          </g>

          {/* 8. Highway Gate 1 (Safe Assembly Point) */}
          <g
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[7])}
            onMouseEnter={() => setHoveredBuilding(CAMPUS_BUILDINGS[7].id)}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <circle cx="470" cy="65" r="14" fill="#059669" stroke="#ffffff" strokeWidth="1.5" />
            <text x="470" y="69" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              ✓
            </text>
            <g transform="translate(470, 36)">
              <rect x="-60" y="-11" width="120" height="17" rx="4" fill="#0a0d14" fillOpacity="0.85" stroke="#059669" strokeWidth="1" />
              <text x="0" y="1" fill="#6ee7b7" fontSize="8.5" fontWeight="600" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">
                Highway Gate 1 (Muster)
              </text>
            </g>
          </g>

          {/* User Location Marker */}
          <g>
            <circle cx={userLocation.x} cy={userLocation.y} r="16" fill="#38bdf8" opacity="0.2" />
            <circle cx={userLocation.x} cy={userLocation.y} r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Floating Canvas Controls (Right) */}
      <div className="absolute right-4 top-14 z-30 flex flex-col gap-1.5">
        <button
          onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))}
          className="w-8 h-8 rounded-lg bg-[#0e1320]/80 backdrop-blur-md border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.15))}
          className="w-8 h-8 rounded-lg bg-[#0e1320]/80 backdrop-blur-md border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            setZoomLevel(1);
            setPanOffset({ x: 0, y: 0 });
            setIs3DMode(true);
          }}
          className="w-8 h-8 rounded-lg bg-[#0e1320]/80 backdrop-blur-md border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          title="Reset Camera"
        >
          <Crosshair className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Floating Route & Landmark Card (Linear / Apple Maps style) */}
      {!isNavigating && (
        <div className="absolute bottom-4 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-30 max-w-xl w-full p-4 rounded-xl bg-[#0e1320]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-sky-400 font-semibold">
                  {selectedBuilding?.code || 'MU-CL'}
                </span>
                <span>·</span>
                <span>{selectedBuilding?.category || 'Library'}</span>
                <span>·</span>
                <span>{selectedBuilding?.floors || 4} Floors</span>
              </div>
              <h2 className="text-base font-semibold text-white truncate mt-0.5">
                {selectedBuilding?.name || 'MU Central Knowledge Resource Center'}
              </h2>
            </div>

            <button
              onClick={() => setInspectorOpen(true)}
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Building Details"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Clean Segmented Route Mode */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/30 border border-white/[0.04]">
            {preferences.map((p) => {
              const isSelected = activePreference === p.type;
              return (
                <button
                  key={p.type}
                  onClick={() => setActivePreference(p.type)}
                  className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p.icon className="w-3.5 h-3.5" />
                  <span>{p.label}</span>
                  <span className="text-[11px] text-slate-500 font-mono">({p.time})</span>
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-0.5">
            <button
              onClick={() => {
                setIsNavigating(true);
                setNavigationStepIndex(0);
              }}
              className="flex-1 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Start Navigation</span>
            </button>
            <button
              onClick={() => setActiveScreen('facilities')}
              className="px-3.5 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Directory
            </button>
          </div>
        </div>
      )}

      {/* Building Slide-Out Inspector Modal */}
      {inspectorOpen && selectedBuilding && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0e1320] border border-white/[0.1] rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-mono text-sky-400">
                  {selectedBuilding.code} · {selectedBuilding.category}
                </div>
                <h3 className="text-base font-semibold text-white mt-0.5">
                  {selectedBuilding.name}
                </h3>
              </div>
              <button
                onClick={() => setInspectorOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedBuilding.description}
            </p>

            {/* Entrances */}
            <div className="p-3 rounded-lg bg-black/30 border border-white/[0.05] space-y-2">
              <div className="text-xs font-medium text-slate-300">
                Entrances & Access Points
              </div>
              <div className="space-y-1">
                {selectedBuilding.entrances.map((e) => (
                  <div key={e.id} className="flex items-center gap-2 text-xs text-slate-400">
                    {e.isAccessible ? (
                      <Accessibility className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <DoorClosed className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    )}
                    <span>{e.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setInspectorOpen(false);
                setIsNavigating(true);
                setNavigationStepIndex(0);
              }}
              className="w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Route to this Landmark</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
