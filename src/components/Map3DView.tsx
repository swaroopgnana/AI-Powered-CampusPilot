/**
 * CampusPilot – Marwadi University 3D Digital Twin Map View
 * High-clarity interactive digital twin of Marwadi University (Rajkot campus).
 * Features 3D architectural models with lighting & shadows, glass facades,
 * tree foliage, digital twin telemetry sensors, CCTV optical feeds,
 * routing algorithm selector (A*, Dijkstra, BFS, DFS), and turn-by-turn guidance.
 */

import React, { useState, useMemo } from 'react';
import { useCampus } from '../context/CampusContext';
import { CAMPUS_BUILDINGS, CAMPUS_NODES, CAMPUS_EDGES } from '../data/campusData';
import { Building, RoutePreference, RouteOptimizer } from '../types';
import {
  Cpu,
  AlertTriangle,
  Layers,
  Box,
  Plus,
  Minus,
  Crosshair,
  Video,
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldCheck,
  Zap,
  Accessibility,
  Compass,
  Navigation,
  Info,
  X,
  DoorClosed,
  Activity,
  Maximize2,
  Radio,
  Sliders,
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
  const [showCctvLayer, setShowCctvLayer] = useState<boolean>(true);
  const [showMeshSensors, setShowMeshSensors] = useState<boolean>(true);
  const [activeBuildingModal, setActiveBuildingModal] = useState<Building | null>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  const algorithms: RouteOptimizer[] = ['A*', 'Dijkstra', 'BFS', 'DFS'];
  const preferences: {
    type: RoutePreference;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    time: string;
    dist: string;
  }[] = [
    { type: 'SAFEST', label: 'Safest Route', icon: ShieldCheck, time: '7 min', dist: '620 m' },
    { type: 'FASTEST', label: 'Fastest Route', icon: Zap, time: '5 min', dist: '510 m' },
    { type: 'ACCESSIBLE', label: 'Accessible', icon: Accessibility, time: '8 min', dist: '680 m' },
  ];

  const handleBuildingClick = (b: Building) => {
    setSelectedBuilding(b);
    setActiveBuildingModal(b);
  };

  const activeStep = currentRoute?.steps[navigationStepIndex] || currentRoute?.steps[0];

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* Top Digital Twin Telemetry & Engine Header */}
      <div className="z-20 px-3 sm:px-4 py-2 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2 flex-wrap">
          {/* University Twin Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 text-xs font-semibold border border-cyan-700/50 shadow-xs">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="tracking-wide">MU Digital Twin • Rajkot Campus</span>
          </div>

          {/* Algorithm selector pills */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-0.5 rounded-lg border border-slate-700/60">
            {algorithms.map((algo) => (
              <button
                key={algo}
                onClick={() => setActiveAlgorithm(algo)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeAlgorithm === algo
                    ? 'bg-cyan-500 text-slate-950 shadow-xs font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        {/* Telemetry live status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Spatial Mesh: 8ms latency</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            <span>22.368° N, 70.800° E</span>
          </div>
        </div>
      </div>

      {/* Emergency Active Warning Banner */}
      {isEmergencyActive && (
        <div className="z-20 px-3 sm:px-4 py-2 bg-red-600 text-white flex items-center justify-between text-xs sm:text-sm shadow-md animate-pulse">
          <div className="flex items-center gap-2 truncate min-w-0">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold truncate">
              FOE Corridor 2B Hazard Active! Tactical safe evacuation path rerouted via Highway Gate 1.
            </span>
          </div>
          <button
            onClick={() => setActiveScreen('emergency')}
            className="px-2.5 py-1 rounded-full bg-white text-red-600 font-bold text-xs flex-shrink-0 cursor-pointer hover:bg-slate-100 shadow-sm"
          >
            Evac HUD
          </button>
        </div>
      )}

      {/* 3D Digital Twin SVG Canvas Area */}
      <div className="relative flex-1 w-full overflow-hidden bg-[#0d1424] flex items-center justify-center">
        {/* Subtle coordinate grid lines overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #38bdf8 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
            backgroundSize: '40px 40px, 40px 40px, 40px 40px',
          }}
        />

        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full object-contain cursor-grab active:cursor-grabbing transition-transform duration-300"
          style={{
            transform: `scale(${zoomLevel}) ${is3DMode ? 'rotateX(26deg) rotateZ(-6deg)' : ''}`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            {/* Soft Ambient Shadow Filter */}
            <filter id="twinShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="8" dy="16" stdDeviation="12" floodColor="#000000" floodOpacity="0.45" />
            </filter>

            {/* Glowing Route Filter */}
            <filter id="glowRoute" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Campus Grounds & Block Linear Gradients */}
            <radialGradient id="campusGroundGrad" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#152238" />
              <stop offset="60%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#090d16" />
            </radialGradient>

            {/* FOE Engineering Block Roof */}
            <linearGradient id="foeRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Main Admin Monolith Roof */}
            <linearGradient id="mainAdminRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>

            {/* Central Library Roof */}
            <linearGradient id="libraryRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="100%" stopColor="#0e7490" />
            </linearGradient>

            {/* FMS Management & Law Roof */}
            <linearGradient id="fmsRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Food Court Roof */}
            <linearGradient id="foodRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Sports Complex Roof */}
            <linearGradient id="sportsRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Hostel Towers Roof */}
            <linearGradient id="hostelRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>

          {/* Marwadi University Campus Ground Base (Digital Twin Mat) */}
          <rect x="25" y="25" width="950" height="650" rx="32" fill="url(#campusGroundGrad)" stroke="#1e293b" strokeWidth="3" />

          {/* Surrounding Ring Road (Rajkot-Morbi Highway & Campus Ring) */}
          <rect x="45" y="45" width="910" height="610" rx="26" fill="none" stroke="#334155" strokeWidth="8" strokeDasharray="16 12" opacity="0.6" />

          {/* Lush Greenery Lawns & Courtyards */}
          <rect x="360" y="320" width="220" height="150" rx="16" fill="#132e22" stroke="#10b981" strokeWidth="1" opacity="0.8" />
          <ellipse cx="470" cy="390" rx="35" ry="24" fill="#0284c7" opacity="0.4" />
          <circle cx="470" cy="390" r="14" fill="#38bdf8" opacity="0.6" className="animate-pulse" />

          {/* Pedestrian Pathways Network */}
          <g stroke="#334155" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {CAMPUS_EDGES.map((e) => {
              const fromN = CAMPUS_NODES.find((n) => n.id === e.from);
              const toN = CAMPUS_NODES.find((n) => n.id === e.to);
              if (!fromN || !toN) return null;
              return <line key={e.id} x1={fromN.x} y1={fromN.y} x2={toN.x} y2={toN.y} />;
            })}
          </g>

          {/* Inner Illuminated Pathway Lines */}
          <g stroke="#64748b" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none">
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
                  stroke={isBlocked ? '#f43f5e' : '#94a3b8'}
                  strokeDasharray={isBlocked ? '6 6' : undefined}
                />
              );
            })}
          </g>

          {/* Hazard Blinking Markers on Blocked Paths */}
          {CAMPUS_EDGES.filter((e) => blockedEdgeIds.includes(e.id)).map((e) => {
            const fromN = CAMPUS_NODES.find((n) => n.id === e.from);
            const toN = CAMPUS_NODES.find((n) => n.id === e.to);
            if (!fromN || !toN) return null;
            const midX = (fromN.x + toN.x) / 2;
            const midY = (fromN.y + toN.y) / 2;
            return (
              <g key={'hazard-' + e.id} className="animate-pulse">
                <circle cx={midX} cy={midY} r="18" fill="#e11d48" opacity="0.9" />
                <circle cx={midX} cy={midY} r="26" fill="#e11d48" opacity="0.3" className="animate-ping" />
                <line x1={midX - 7} y1={midY - 7} x2={midX + 7} y2={midY + 7} stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                <line x1={midX + 7} y1={midY - 7} x2={midX - 7} y2={midY + 7} stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
              </g>
            );
          })}

          {/* Active Navigation Path (Neon Cyan / Emergency Emerald Ribbon) */}
          {currentRoute && currentRoute.nodes.length > 1 && (
            <g>
              <polyline
                points={currentRoute.nodes.map((n) => `${n.x},${n.y}`).join(' ')}
                fill="none"
                stroke={isEmergencyActive ? '#10b981' : '#38bdf8'}
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
                filter="url(#glowRoute)"
              />
              <polyline
                points={currentRoute.nodes.map((n) => `${n.x},${n.y}`).join(' ')}
                fill="none"
                stroke={isEmergencyActive ? '#34d399' : '#0284c7'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="12 8"
                className="animate-dash"
              />
            </g>
          )}

          {/* Campus Decorative Landscaping Foliage / Trees */}
          <g fill="#15803d" opacity="0.85">
            <circle cx="430" cy="380" r="14" />
            <circle cx="510" cy="380" r="15" />
            <circle cx="580" cy="330" r="13" />
            <circle cx="620" cy="270" r="16" />
            <circle cx="360" cy="280" r="16" />
            <circle cx="510" cy="220" r="15" />
            <circle cx="730" cy="390" r="14" />
            <circle cx="270" cy="450" r="14" />
          </g>

          {/* ======================================================== */}
          {/* 3D DIGITAL TWIN BUILDINGS (Isometrically Modeled)         */}
          {/* ======================================================== */}

          {/* 1. Main Admin Building & Grand Central Atrium (Center-Top) */}
          <g
            className="cursor-pointer transition-transform duration-200 hover:scale-105 origin-center"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[0])}
            onMouseEnter={() => setHoveredBuilding(CAMPUS_BUILDINGS[0].id)}
            onMouseLeave={() => setHoveredBuilding(null)}
            filter="url(#twinShadow)"
          >
            {/* Ground Shadow */}
            <ellipse cx="480" cy="210" rx="95" ry="42" fill="#000000" opacity="0.5" />
            {/* Front Extrusion Facet */}
            <path d="M 390 150 L 550 150 L 570 210 L 410 210 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            {/* Side Facet */}
            <path d="M 390 150 L 410 210 L 410 170 L 390 110 Z" fill="#0f172a" />
            {/* Top Roof with Blueprint Grid */}
            <polygon points="390,110 550,110 570,170 410,170" fill="url(#mainAdminRoofGrad)" stroke="#38bdf8" strokeWidth="2" />
            {/* Iconic Admin Dome */}
            <ellipse cx="480" cy="135" rx="30" ry="16" fill="#38bdf8" opacity="0.75" />
            {/* Architectural Glass Ribbon Windows */}
            <line x1="420" y1="180" x2="550" y2="180" stroke="#bae6fd" strokeWidth="3" strokeDasharray="10 4" />
            <line x1="425" y1="195" x2="555" y2="195" stroke="#bae6fd" strokeWidth="3" strokeDasharray="10 4" />
            {/* Tag Badge */}
            <rect x="400" y="80" width="160" height="24" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
            <text x="480" y="96" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              Main Admin Building (MU)
            </text>
          </g>

          {/* 2. Faculty of Engineering & Technology (FOE Block) (West) */}
          <g
            className="cursor-pointer transition-transform duration-200 hover:scale-105 origin-center"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[1])}
            onMouseEnter={() => setHoveredBuilding(CAMPUS_BUILDINGS[1].id)}
            onMouseLeave={() => setHoveredBuilding(null)}
            filter="url(#twinShadow)"
          >
            <ellipse cx="230" cy="335" rx="90" ry="40" fill="#000000" opacity="0.45" />
            <path d="M 140 260 L 300 260 L 320 325 L 160 325 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <polygon points="140,220 300,220 320,285 160,285" fill="url(#foeRoofGrad)" stroke="#38bdf8" strokeWidth="2" />
            {/* Tech Wing Solar Panels */}
            <rect x="175" y="235" width="40" height="20" rx="3" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1" />
            <rect x="235" y="235" width="40" height="20" rx="3" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1" />
            <line x1="170" y1="300" x2="305" y2="300" stroke="#bae6fd" strokeWidth="3" strokeDasharray="8 4" />
            <line x1="175" y1="315" x2="310" y2="315" stroke="#bae6fd" strokeWidth="3" strokeDasharray="8 4" />
            <rect x="150" y="190" width="160" height="24" rx="6" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
            <text x="230" y="206" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              FOE Engineering Block
            </text>
          </g>

          {/* 3. Central Knowledge Resource Center & Digital Library (East) */}
          <g
            className="cursor-pointer transition-transform duration-200 hover:scale-105 origin-center"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[2])}
            onMouseEnter={() => setHoveredBuilding(CAMPUS_BUILDINGS[2].id)}
            onMouseLeave={() => setHoveredBuilding(null)}
            filter="url(#twinShadow)"
          >
            <ellipse cx="710" cy="340" rx="90" ry="42" fill="#000000" opacity="0.45" />
            <path d="M 620 270 L 780 270 L 800 335 L 640 335 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <polygon points="620,230 780,230 800,295 640,295" fill="url(#libraryRoofGrad)" stroke="#38bdf8" strokeWidth="2" />
            <ellipse cx="710" cy="260" rx="32" ry="14" fill="#0891b2" opacity="0.8" />
            <line x1="650" y1="310" x2="785" y2="310" stroke="#e0f2fe" strokeWidth="3" strokeDasharray="8 4" />
            <line x1="655" y1="325" x2="790" y2="325" stroke="#e0f2fe" strokeWidth="3" strokeDasharray="8 4" />
            <rect x="630" y="200" width="160" height="24" rx="6" fill="#0891b2" stroke="#38bdf8" strokeWidth="1" />
            <text x="710" y="216" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              MU Central Digital Library
            </text>
          </g>

          {/* 4. Faculty of Management Studies & Law (FMS Block) (Northeast) */}
          <g
            className="cursor-pointer transition-transform duration-200 hover:scale-105 origin-center"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[3])}
            onMouseEnter={() => setHoveredBuilding(CAMPUS_BUILDINGS[3].id)}
            onMouseLeave={() => setHoveredBuilding(null)}
            filter="url(#twinShadow)"
          >
            <ellipse cx="740" cy="185" rx="75" ry="36" fill="#000000" opacity="0.4" />
            <polygon points="665,125 795,125 815,175 685,175" fill="url(#fmsRoofGrad)" stroke="#34d399" strokeWidth="1.5" />
            <rect x="670" y="95" width="145" height="24" rx="6" fill="#047857" stroke="#34d399" strokeWidth="1" />
            <text x="742" y="111" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              FMS & Law Block
            </text>
          </g>

          {/* 5. Student Food Court & Cafeteria (Southwest) */}
          <g
            className="cursor-pointer transition-transform duration-200 hover:scale-105 origin-center"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[4])}
            onMouseEnter={() => setHoveredBuilding(CAMPUS_BUILDINGS[4].id)}
            onMouseLeave={() => setHoveredBuilding(null)}
            filter="url(#twinShadow)"
          >
            <ellipse cx="290" cy="535" rx="75" ry="35" fill="#000000" opacity="0.4" />
            <polygon points="215,475 345,475 365,525 235,525" fill="url(#foodRoofGrad)" stroke="#38bdf8" strokeWidth="1.5" />
            <rect x="220" y="445" width="140" height="24" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
            <text x="290" y="461" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              MU Food Court & Amul
            </text>
          </g>

          {/* 6. Marwadi Sports Complex & Indoor Arena (Southeast) */}
          <g
            className="cursor-pointer transition-transform duration-200 hover:scale-105 origin-center"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[5])}
            onMouseEnter={() => setHoveredBuilding(CAMPUS_BUILDINGS[5].id)}
            onMouseLeave={() => setHoveredBuilding(null)}
            filter="url(#twinShadow)"
          >
            <ellipse cx="790" cy="545" rx="85" ry="40" fill="#000000" opacity="0.4" />
            <polygon points="710,485 850,485 870,540 730,540" fill="url(#sportsRoofGrad)" stroke="#34d399" strokeWidth="1.5" />
            {/* Running Track Strip */}
            <ellipse cx="790" cy="520" rx="55" ry="20" fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.7" />
            <rect x="720" y="455" width="145" height="24" rx="6" fill="#047857" stroke="#34d399" strokeWidth="1" />
            <text x="792" y="471" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              MU Sports Pavilion
            </text>
          </g>

          {/* 7. Hostel Towers & Medical Health Center (South) */}
          <g
            className="cursor-pointer transition-transform duration-200 hover:scale-105 origin-center"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[6])}
            onMouseEnter={() => setHoveredBuilding(CAMPUS_BUILDINGS[6].id)}
            onMouseLeave={() => setHoveredBuilding(null)}
            filter="url(#twinShadow)"
          >
            <ellipse cx="520" cy="625" rx="75" ry="34" fill="#000000" opacity="0.4" />
            <polygon points="450,570 575,570 595,620 470,620" fill="url(#hostelRoofGrad)" stroke="#818cf8" strokeWidth="1.5" />
            <rect x="450" y="540" width="140" height="24" rx="6" fill="#4f46e5" stroke="#818cf8" strokeWidth="1" />
            <text x="520" y="556" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              Hostel & Health Clinic
            </text>
          </g>

          {/* 8. Main Highway Gate 1 & Safe Assembly Lawn 1 (North) */}
          <g
            className="cursor-pointer transition-transform duration-200 hover:scale-105 origin-center"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[7])}
            onMouseEnter={() => setHoveredBuilding(CAMPUS_BUILDINGS[7].id)}
            onMouseLeave={() => setHoveredBuilding(null)}
          >
            <circle cx="470" cy="65" r="34" fill="#10b981" opacity="0.25" className="animate-ping" />
            <circle cx="470" cy="65" r="22" fill="#059669" stroke="#ffffff" strokeWidth="2.5" />
            <text x="470" y="70" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              ✓
            </text>
            <rect x="375" y="16" width="190" height="24" rx="6" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
            <text x="470" y="32" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              Highway Gate 1 Safe Assembly
            </text>
          </g>

          {/* CCTV Optical Sensors Mesh */}
          {showCctvLayer && (
            <g>
              {[
                { x: 470, y: 390, id: 'cctv-1' },
                { x: 490, y: 320, id: 'cctv-2' },
                { x: 640, y: 340, id: 'cctv-3' },
                { x: 380, y: 240, id: 'cctv-4' },
                { x: 710, y: 480, id: 'cctv-5' },
                { x: 340, y: 470, id: 'cctv-6' },
                { x: 500, y: 550, id: 'cctv-7' },
              ].map((c) => (
                <g key={c.id}>
                  <circle cx={c.x} cy={c.y} r="9" fill="#38bdf8" opacity="0.25" className="animate-pulse" />
                  <circle cx={c.x} cy={c.y} r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
                </g>
              ))}
            </g>
          )}

          {/* User Live Location Beacon (Zone B - Central Quad) */}
          <g>
            <circle cx={userLocation.x} cy={userLocation.y} r="26" fill="#38bdf8" opacity="0.3" className="animate-ping" />
            <circle cx={userLocation.x} cy={userLocation.y} r="14" fill="#0284c7" stroke="#ffffff" strokeWidth="3" />
            <circle cx={userLocation.x} cy={userLocation.y} r="5" fill="#38bdf8" />
            <rect x={userLocation.x - 55} y={userLocation.y - 44} width="110" height="22" rx="5" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
            <text
              x={userLocation.x}
              y={userLocation.y - 29}
              fill="#ffffff"
              fontSize="9.5"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              You (Zone B Quad)
            </text>
          </g>
        </svg>

        {/* Floating HUD Map Canvas Controls (Right Side) */}
        <div className="absolute right-4 top-4 flex flex-col gap-2 z-20">
          <button
            onClick={() => setIs3DMode((v) => !v)}
            title="Toggle 2.5D Isometric Tilt"
            className="w-10 h-10 rounded-xl bg-slate-900/90 backdrop-blur-md shadow-md border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
          >
            {is3DMode ? <Box className="w-5 h-5 text-cyan-400" /> : <Layers className="w-5 h-5 text-slate-300" />}
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.2))}
            title="Zoom In"
            className="w-10 h-10 rounded-xl bg-slate-900/90 backdrop-blur-md shadow-md border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
            title="Zoom Out"
            className="w-10 h-10 rounded-xl bg-slate-900/90 backdrop-blur-md shadow-md border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
          >
            <Minus className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setZoomLevel(1);
              setIs3DMode(true);
            }}
            title="Recenter Campus View"
            className="w-10 h-10 rounded-xl bg-slate-900/90 backdrop-blur-md shadow-md border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
          >
            <Crosshair className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowCctvLayer((v) => !v)}
            title="Toggle CCTV Coverage"
            className={`w-10 h-10 rounded-xl backdrop-blur-md shadow-md border border-slate-700 flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
              showCctvLayer ? 'bg-cyan-600 text-white' : 'bg-slate-900/90 text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Turn-by-Turn Navigation HUD Overlay */}
      {isNavigating && activeStep && (
        <div className="z-30 px-3 sm:px-4 py-3 bg-slate-900 text-white flex flex-col gap-2 shadow-2xl border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 border border-cyan-500/40">
                {activeStep.direction === 'right' ? (
                  <CornerUpRight className="w-5 h-5" />
                ) : activeStep.direction === 'left' ? (
                  <CornerUpLeft className="w-5 h-5" />
                ) : activeStep.direction === 'arrive' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ArrowUp className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm sm:text-base truncate text-cyan-200">{activeStep.instruction}</p>
                <p className="text-xs text-slate-400">
                  Step {activeStep.stepIndex} of {currentRoute?.steps.length} • {activeStep.distanceMeters}m
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                disabled={navigationStepIndex === 0}
                onClick={() => setNavigationStepIndex(Math.max(0, navigationStepIndex - 1))}
                className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center disabled:opacity-30 cursor-pointer text-slate-300 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={!currentRoute || navigationStepIndex >= currentRoute.steps.length - 1}
                onClick={() => setNavigationStepIndex(navigationStepIndex + 1)}
                className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center disabled:opacity-30 cursor-pointer font-bold"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsNavigating(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer border border-slate-700"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sheet Routing Controller for Marwadi University */}
      {!isNavigating && (
        <div className="z-20 p-3 sm:p-4 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl rounded-t-3xl max-w-4xl mx-auto w-full">
          {/* Destination Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-cyan-400 font-bold uppercase">
                  {selectedBuilding?.code || 'Destination'}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                <span className="text-xs text-slate-400">
                  {isEmergencyActive ? 'Muster Point Assembly' : '3D Spatial Path'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                {selectedBuilding?.name || 'MU Central Knowledge Resource Center'}
              </h2>
            </div>

            <button
              onClick={() => setActiveScreen('facilities')}
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Change</span>
            </button>
          </div>

          {/* Route Preferences Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {preferences.map((p) => {
              const isSelected = activePreference === p.type;
              const Icon = p.icon;
              return (
                <button
                  key={p.type}
                  onClick={() => setActivePreference(p.type)}
                  className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-sm font-semibold'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon className="w-4 h-4" />
                    <span className="font-mono text-xs font-bold">{p.time}</span>
                  </div>
                  <span className="text-xs font-bold truncate text-white">{p.label}</span>
                  <span className="text-[11px] text-slate-400 truncate">{p.dist}</span>
                </button>
              );
            })}
          </div>

          {/* Micro Wayfinding Telemetry Bar */}
          {currentRoute && (
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs mb-3">
              <div className="flex items-center gap-1.5 text-slate-300 truncate min-w-0">
                <Compass className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="font-mono text-xs truncate">
                  Via {currentRoute.waypointsHud.via} • {currentRoute.turnsCount} turns • {currentRoute.elevationMeters}m elev
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold flex-shrink-0 ml-2">
                <Video className="w-3.5 h-3.5" />
                <span>{currentRoute.cctvPostsCount} CCTV</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsNavigating(true);
                setNavigationStepIndex(0);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Start Turn-by-Turn Navigation</span>
            </button>

            <button
              onClick={() => {
                if (selectedBuilding) setActiveBuildingModal(selectedBuilding);
              }}
              className="p-3 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
              title="Building Details"
            >
              <Info className="w-5 h-5 text-cyan-400" />
            </button>
          </div>
        </div>
      )}

      {/* Building Details Modal */}
      {activeBuildingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="font-mono text-xs text-cyan-400 font-bold">
                  {activeBuildingModal.code} • {activeBuildingModal.category}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {activeBuildingModal.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveBuildingModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              {activeBuildingModal.description}
            </p>

            <div className="space-y-3 mb-5">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs font-bold text-slate-200 block mb-1.5">
                  Accessible Entrances
                </span>
                <ul className="space-y-1.5">
                  {activeBuildingModal.entrances.map((e) => (
                    <li key={e.id} className="flex items-center gap-2 text-xs text-slate-300">
                      {e.isAccessible ? (
                        <Accessibility className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <DoorClosed className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      )}
                      <span>{e.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 p-1">
                <span>Floors: {activeBuildingModal.floors}</span>
                <span>Category: {activeBuildingModal.category}</span>
                <span className="text-emerald-400 font-bold">Telemetry Live</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedBuilding(activeBuildingModal);
                setActiveBuildingModal(null);
                setIsNavigating(true);
                setNavigationStepIndex(0);
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Navigate to {activeBuildingModal.code}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
