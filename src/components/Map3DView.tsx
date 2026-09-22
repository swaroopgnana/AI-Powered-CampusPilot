/**
 * CampusPilot 3D Digital Twin Map View
 * Interactive isometric canvas with real-time routing paths, CCTV coverage,
 * algorithm switching (A*, Dijkstra, BFS, DFS), and turn-by-turn guidance.
 */

import React, { useState } from 'react';
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
  const [activeBuildingModal, setActiveBuildingModal] = useState<Building | null>(null);

  const algorithms: RouteOptimizer[] = ['A*', 'Dijkstra', 'BFS', 'DFS'];
  const preferences: {
    type: RoutePreference;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    time: string;
    dist: string;
  }[] = [
    { type: 'SAFEST', label: 'Safest Route', icon: ShieldCheck, time: '11 min', dist: '800 m' },
    { type: 'FASTEST', label: 'Fastest Route', icon: Zap, time: '9 min', dist: '720 m' },
    { type: 'ACCESSIBLE', label: 'Accessible', icon: Accessibility, time: '14 min', dist: '880 m' },
  ];

  const handleBuildingClick = (b: Building) => {
    setSelectedBuilding(b);
    setActiveBuildingModal(b);
  };

  // Turn-by-turn navigation handling
  const activeStep = currentRoute?.steps[navigationStepIndex] || currentRoute?.steps[0];

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-surface-container-high/30 select-none">
      {/* Top Routing Engine Header Bar */}
      <div className="z-20 px-space-md py-2.5 bg-surface-container-lowest/90 backdrop-blur-md border-b border-surface-container flex flex-wrap items-center justify-between gap-space-sm shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-fixed-variant text-xs font-semibold border border-secondary/20">
            <Cpu className="w-4 h-4 text-secondary" />
            <span>
              Engine: {activeAlgorithm} {activeAlgorithm === 'A*' ? 'Heuristic (Dist + Safety)' : 'Cost Graph'}
            </span>
          </div>

          {/* Algorithm selector pills */}
          <div className="flex items-center gap-1 bg-surface-container p-0.5 rounded-lg">
            {algorithms.map((algo) => (
              <button
                key={algo}
                onClick={() => setActiveAlgorithm(algo)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeAlgorithm === algo
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        {/* Telemetry ping badge */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-code-telemetry text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            Campus Mesh: 12ms ping
          </span>
        </div>
      </div>

      {/* Emergency Alert Banner Overlay on Map if Active */}
      {isEmergencyActive && (
        <div className="z-20 px-space-md py-2 bg-error text-on-error flex items-center justify-between text-xs sm:text-sm shadow-md animate-pulse">
          <div className="flex items-center gap-2 truncate min-w-0">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold truncate">
              Corridor 2B Obstruction Active. Tactical safe route re-computed toward North Gate.
            </span>
          </div>
          <button
            onClick={() => setActiveScreen('emergency')}
            className="px-2.5 py-0.5 rounded-full bg-white text-error font-bold text-xs flex-shrink-0 cursor-pointer hover:bg-slate-100"
          >
            Evac HUD
          </button>
        </div>
      )}

      {/* Interactive 3D Canvas Map Area */}
      <div className="relative flex-1 w-full overflow-hidden bg-[#e6ebf5] flex items-center justify-center">
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full object-contain cursor-grab active:cursor-grabbing transition-transform duration-300"
          style={{
            transform: `scale(${zoomLevel}) ${is3DMode ? 'rotateX(24deg) rotateZ(-6deg)' : ''}`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            {/* Gradients for 3D Building Facets */}
            <linearGradient id="lawnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e3ede5" />
              <stop offset="100%" stopColor="#d5e4d9" />
            </linearGradient>
            <linearGradient id="bldgLibraryRoof" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#007bb9" />
              <stop offset="100%" stopColor="#004b73" />
            </linearGradient>
            <linearGradient id="bldgTuringRoof" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00687a" />
              <stop offset="100%" stopColor="#004e5c" />
            </linearGradient>
            <linearGradient id="bldgScienceRoof" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00855b" />
              <stop offset="100%" stopColor="#005236" />
            </linearGradient>
            <linearGradient id="bldgAdminRoof" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3f4850" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="bldgCafeRoof" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="bldgSportsRoof" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Campus Base Green Grounds */}
          <rect x="20" y="20" width="960" height="660" rx="24" fill="url(#lawnGrad)" />

          {/* Campus Arterial Pedestrian Pathways */}
          <g stroke="#cbd5e1" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {CAMPUS_EDGES.map((e) => {
              const fromN = CAMPUS_NODES.find((n) => n.id === e.from);
              const toN = CAMPUS_NODES.find((n) => n.id === e.to);
              if (!fromN || !toN) return null;
              return <line key={e.id} x1={fromN.x} y1={fromN.y} x2={toN.x} y2={toN.y} />;
            })}
          </g>

          {/* Pathway Inner Walkway Concrete lines */}
          <g stroke="#ffffff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none">
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
                  stroke={isBlocked ? '#ffdad6' : '#ffffff'}
                  strokeDasharray={isBlocked ? '6 6' : undefined}
                />
              );
            })}
          </g>

          {/* Blocked Path Hazard Warning Markers */}
          {CAMPUS_EDGES.filter((e) => blockedEdgeIds.includes(e.id)).map((e) => {
            const fromN = CAMPUS_NODES.find((n) => n.id === e.from);
            const toN = CAMPUS_NODES.find((n) => n.id === e.to);
            if (!fromN || !toN) return null;
            const midX = (fromN.x + toN.x) / 2;
            const midY = (fromN.y + toN.y) / 2;
            return (
              <g key={'hazard-' + e.id} className="animate-pulse">
                <circle cx={midX} cy={midY} r="16" fill="#ba1a1a" opacity="0.85" />
                <line x1={midX - 7} y1={midY - 7} x2={midX + 7} y2={midY + 7} stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                <line x1={midX + 7} y1={midY - 7} x2={midX - 7} y2={midY + 7} stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
              </g>
            );
          })}

          {/* Active Navigation Ribbon Path */}
          {currentRoute && currentRoute.nodes.length > 1 && (
            <g>
              {/* Outer Glow Ribbon */}
              <polyline
                points={currentRoute.nodes.map((n) => `${n.x},${n.y}`).join(' ')}
                fill="none"
                stroke={isEmergencyActive ? '#00c853' : '#57dffe'}
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
                filter="url(#glowEffect)"
              />
              {/* Animated Core Vector */}
              <polyline
                points={currentRoute.nodes.map((n) => `${n.x},${n.y}`).join(' ')}
                fill="none"
                stroke={isEmergencyActive ? '#006947' : '#006194'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="10 8"
                className="animate-dash"
              />
            </g>
          )}

          {/* Campus Decorative Trees */}
          <g fill="#9bc4a5" opacity="0.7">
            <circle cx="430" cy="400" r="16" />
            <circle cx="460" cy="380" r="14" />
            <circle cx="580" cy="380" r="18" />
            <circle cx="610" cy="270" r="16" />
            <circle cx="420" cy="280" r="20" />
            <circle cx="520" cy="180" r="22" />
            <circle cx="750" cy="310" r="16" />
          </g>

          {/* 3D Isometric Buildings */}
          {/* 1. Central Library (Hero Building) */}
          <g
            className="cursor-pointer transition-all hover:scale-105 origin-center"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[0])}
          >
            <ellipse cx="680" cy="370" rx="90" ry="45" fill="#000000" opacity="0.15" />
            <path d="M 590 320 L 750 320 L 770 380 L 610 380 Z" fill="#b0c4de" />
            <path d="M 590 320 L 610 380 L 610 340 L 590 280 Z" fill="#90a4ae" />
            <polygon points="590,280 750,280 770,340 610,340" fill="url(#bldgLibraryRoof)" stroke="#57dffe" strokeWidth="2" />
            <line x1="620" y1="350" x2="750" y2="350" stroke="#fdfcff" strokeWidth="4" strokeDasharray="12 6" />
            <line x1="625" y1="365" x2="755" y2="365" stroke="#fdfcff" strokeWidth="4" strokeDasharray="12 6" />
            <rect x="615" y="245" width="130" height="26" rx="6" fill="#131b2e" opacity="0.9" />
            <text x="680" y="262" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              Central Library
            </text>
            <circle cx="605" cy="258" r="4" fill="#57dffe" />
          </g>

          {/* 2. Alan Turing Academic Complex */}
          <g
            className="cursor-pointer transition-all hover:scale-105 origin-center"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[1])}
          >
            <ellipse cx="230" cy="330" rx="80" ry="40" fill="#000000" opacity="0.14" />
            <path d="M 150 270 L 290 270 L 310 320 L 170 320 Z" fill="#94a3b8" />
            <polygon points="150,240 290,240 310,290 170,290" fill="url(#bldgTuringRoof)" stroke="#57dffe" strokeWidth="1.5" />
            <line x1="180" y1="305" x2="295" y2="305" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="10 5" />
            <rect x="155" y="205" width="150" height="26" rx="6" fill="#131b2e" opacity="0.9" />
            <text x="230" y="222" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              Alan Turing Complex (CS)
            </text>
          </g>

          {/* 3. Administration & Grand Auditorium */}
          <g
            className="cursor-pointer transition-all hover:scale-105 origin-center"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[2])}
          >
            <ellipse cx="320" cy="210" rx="75" ry="38" fill="#000000" opacity="0.12" />
            <path d="M 240 160 L 380 160 L 400 205 L 260 205 Z" fill="#94a3b8" />
            <polygon points="240,135 380,135 400,180 260,180" fill="url(#bldgAdminRoof)" />
            <rect x="250" y="105" width="140" height="24" rx="6" fill="#1e293b" opacity="0.9" />
            <text x="320" y="121" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              Admin & Auditorium
            </text>
          </g>

          {/* 4. Science Laboratories */}
          <g
            className="cursor-pointer transition-all hover:scale-105 origin-center"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[3])}
          >
            <ellipse cx="730" cy="180" rx="70" ry="35" fill="#000000" opacity="0.12" />
            <polygon points="660,120 780,120 800,165 680,165" fill="url(#bldgScienceRoof)" />
            <rect x="665" y="92" width="135" height="24" rx="6" fill="#005236" opacity="0.9" />
            <text x="732" y="108" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              Science Laboratories
            </text>
          </g>

          {/* 5. Student Cafeteria */}
          <g
            className="cursor-pointer transition-all hover:scale-105 origin-center"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[4])}
          >
            <ellipse cx="280" cy="500" rx="65" ry="32" fill="#000000" opacity="0.12" />
            <polygon points="210,450 330,450 345,490 225,490" fill="url(#bldgCafeRoof)" />
            <rect x="220" y="420" width="115" height="24" rx="6" fill="#0369a1" opacity="0.9" />
            <text x="277" y="436" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              Student Cafeteria
            </text>
          </g>

          {/* 6. Sports Complex */}
          <g
            className="cursor-pointer transition-all hover:scale-105 origin-center"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[5])}
          >
            <ellipse cx="810" cy="520" rx="75" ry="36" fill="#000000" opacity="0.12" />
            <polygon points="730,465 860,465 880,510 750,510" fill="url(#bldgSportsRoof)" />
            <rect x="745" y="435" width="125" height="24" rx="6" fill="#047857" opacity="0.9" />
            <text x="807" y="451" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              Sports & Athletic Hub
            </text>
          </g>

          {/* 7. North Gate Safe Zone (Muster Lawn B) */}
          <g
            className="cursor-pointer transition-all hover:scale-105 origin-center"
            onClick={() => handleBuildingClick(CAMPUS_BUILDINGS[6])}
          >
            <circle cx="500" cy="70" r="32" fill="#00855b" opacity="0.25" className="animate-ping" />
            <circle cx="500" cy="70" r="22" fill="#00855b" stroke="#ffffff" strokeWidth="2.5" />
            <text x="500" y="74" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              ✓
            </text>
            <rect x="420" y="24" width="160" height="22" rx="5" fill="#006947" />
            <text x="500" y="39" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              North Gate Safe Zone
            </text>
          </g>

          {/* CCTV Posts */}
          {showCctvLayer && (
            <g>
              {[
                { x: 500, y: 410, id: 'cctv-1' },
                { x: 530, y: 370, id: 'cctv-2' },
                { x: 610, y: 340, id: 'cctv-3' },
                { x: 650, y: 210, id: 'cctv-4' },
                { x: 720, y: 460, id: 'cctv-5' },
              ].map((c) => (
                <g key={c.id}>
                  <circle cx={c.x} cy={c.y} r="8" fill="#57dffe" opacity="0.3" className="animate-pulse" />
                  <circle cx={c.x} cy={c.y} r="3.5" fill="#006194" />
                </g>
              ))}
            </g>
          )}

          {/* User Location Marker */}
          <g>
            <circle cx={userLocation.x} cy={userLocation.y} r="24" fill="#57dffe" opacity="0.3" className="animate-ping" />
            <circle cx={userLocation.x} cy={userLocation.y} r="14" fill="#006194" stroke="#ffffff" strokeWidth="3" />
            <circle cx={userLocation.x} cy={userLocation.y} r="5" fill="#57dffe" />
            <rect x={userLocation.x - 45} y={userLocation.y - 42} width="90" height="20" rx="4" fill="#006194" />
            <text
              x={userLocation.x}
              y={userLocation.y - 28}
              fill="#ffffff"
              fontSize="9.5"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              You (Zone B)
            </text>
          </g>
        </svg>

        {/* Floating HUD Controls on Right Edge */}
        <div className="absolute right-4 top-4 flex flex-col gap-2 z-20">
          <button
            onClick={() => setIs3DMode((v) => !v)}
            title="Toggle 2.5D Isometric Tilt"
            className="w-10 h-10 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-md flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
          >
            {is3DMode ? <Box className="w-5 h-5 text-secondary" /> : <Layers className="w-5 h-5 text-on-surface" />}
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.2))}
            title="Zoom In"
            className="w-10 h-10 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-md flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
            title="Zoom Out"
            className="w-10 h-10 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-md flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
          >
            <Minus className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setZoomLevel(1);
              setIs3DMode(true);
            }}
            title="Reset Campus View"
            className="w-10 h-10 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-md flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
          >
            <Crosshair className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowCctvLayer((v) => !v)}
            title="Toggle CCTV Monitored Sensors"
            className={`w-10 h-10 rounded-xl backdrop-blur-md shadow-md flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
              showCctvLayer ? 'bg-secondary text-on-secondary' : 'bg-surface-container-lowest text-on-surface-variant'
            }`}
          >
            <Video className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Turn-by-Turn Navigation Overlay if Active */}
      {isNavigating && activeStep && (
        <div className="z-30 px-space-md py-3 bg-inverse-surface text-inverse-on-surface flex flex-col gap-2 shadow-lg border-t border-surface-container-high/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
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
                <p className="font-headline-sm text-sm sm:text-base font-bold truncate">{activeStep.instruction}</p>
                <p className="font-body-sm text-xs text-surface-variant">
                  Step {activeStep.stepIndex} of {currentRoute?.steps.length} • {activeStep.distanceMeters}m
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                disabled={navigationStepIndex === 0}
                onClick={() => setNavigationStepIndex(Math.max(0, navigationStepIndex - 1))}
                className="w-8 h-8 rounded-full bg-surface-container/20 flex items-center justify-center disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={!currentRoute || navigationStepIndex >= currentRoute.steps.length - 1}
                onClick={() => setNavigationStepIndex(navigationStepIndex + 1)}
                className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsNavigating(false)}
                className="px-2.5 py-1 rounded-lg bg-surface/20 text-on-surface-variant text-xs font-semibold hover:bg-surface/30 cursor-pointer"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sheet Routing Controller matching Stitch UI */}
      {!isNavigating && (
        <div className="z-20 p-space-md bg-surface-container-lowest/95 backdrop-blur-xl border-t border-surface-container shadow-2xl rounded-t-3xl max-w-4xl mx-auto w-full">
          {/* Destination Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-code-telemetry text-xs text-secondary font-bold uppercase">
                  {selectedBuilding?.code || 'Destination'}
                </span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="font-body-sm text-xs text-on-surface-variant">
                  {isEmergencyActive ? 'Muster Point Assembly' : '3D Spatial Path'}
                </span>
              </div>
              <h2 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface truncate">
                {selectedBuilding?.name || 'Central Library — East Entrance'}
              </h2>
            </div>

            {/* Quick change destination shortcut button */}
            <button
              onClick={() => setActiveScreen('facilities')}
              className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-xs hover:text-on-surface flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find</span>
            </button>
          </div>

          {/* Route Preference Tabs: Safest | Fastest | Accessible */}
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
                      ? 'border-primary bg-primary/5 text-primary shadow-xs font-semibold'
                      : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:border-outline-variant'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon className="w-4 h-4" />
                    <span className="font-code-telemetry text-xs font-bold">{p.time}</span>
                  </div>
                  <span className="font-label-md text-xs font-bold truncate">{p.label}</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant truncate">{p.dist}</span>
                </button>
              );
            })}
          </div>

          {/* Micro Wayfinding Telemetry Bar */}
          {currentRoute && (
            <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between text-body-sm mb-3">
              <div className="flex items-center gap-1.5 text-on-surface-variant truncate min-w-0">
                <Compass className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="font-code-telemetry text-xs font-semibold truncate">
                  Via {currentRoute.waypointsHud.via} • {currentRoute.turnsCount} turns • {currentRoute.elevationMeters}m elev
                </span>
              </div>
              <div className="flex items-center gap-1 text-tertiary font-code-telemetry text-xs font-bold flex-shrink-0 ml-2">
                <Video className="w-3.5 h-3.5" />
                <span>{currentRoute.cctvPostsCount} CCTV</span>
              </div>
            </div>
          )}

          {/* Primary Action Button: Start Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsNavigating(true);
                setNavigationStepIndex(0);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-primary text-on-primary font-headline-sm text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary/95 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Start Turn-by-Turn Navigation</span>
            </button>

            <button
              onClick={() => {
                if (selectedBuilding) setActiveBuildingModal(selectedBuilding);
              }}
              className="p-3 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              title="Building Details"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Building Details Modal if opened */}
      {activeBuildingModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-surface-container animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="font-code-telemetry text-xs text-secondary font-bold">
                  {activeBuildingModal.code} • {activeBuildingModal.category}
                </span>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                  {activeBuildingModal.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveBuildingModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="font-body-md text-sm text-on-surface-variant mb-4 leading-relaxed">
              {activeBuildingModal.description}
            </p>

            <div className="space-y-3 mb-5">
              <div className="p-3 rounded-xl bg-surface-container-low">
                <span className="font-label-sm text-xs font-bold text-on-surface block mb-1.5">
                  Accessible Entrances
                </span>
                <ul className="text-body-sm text-on-surface-variant space-y-1.5">
                  {activeBuildingModal.entrances.map((e) => (
                    <li key={e.id} className="flex items-center gap-2 text-xs">
                      {e.isAccessible ? (
                        <Accessibility className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <DoorClosed className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      )}
                      <span>{e.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-xs text-on-surface-variant p-2">
                <span>Floors: {activeBuildingModal.floors}</span>
                <span>Category: {activeBuildingModal.category}</span>
                <span className="text-tertiary font-bold">Sensors Live</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedBuilding(activeBuildingModal);
                setActiveBuildingModal(null);
                setIsNavigating(true);
                setNavigationStepIndex(0);
              }}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Navigate Here Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
