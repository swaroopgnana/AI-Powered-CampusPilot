/**
 * CampusPilot Central Application State Context
 * Configured for Marwadi University Digital Twin System
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  ScreenId,
  Building,
  Facility,
  CampusEvent,
  RouteOptimizer,
  RoutePreference,
  RouteResult,
  EmergencyIncident,
  EmergencyCategory,
  CampusTelemetry,
  ChatMessage,
  UserProfile,
  VisionAnalysis,
} from '../types';
import {
  CAMPUS_BUILDINGS,
  CAMPUS_FACILITIES,
  CAMPUS_EVENTS,
  CAMPUS_NODES,
  CAMPUS_EDGES,
  INITIAL_EMERGENCY,
  INITIAL_TELEMETRY,
  INITIAL_USER_PROFILE,
} from '../data/campusData';
import { CampusGraphService } from '../services/graphEngine';

export interface CampusNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: 'event' | 'hazard' | 'navigation' | 'system';
  unread: boolean;
}

interface CampusContextType {
  activeScreen: ScreenId;
  setActiveScreen: (screen: ScreenId) => void;

  userLocation: { name: string; nodeId: string; x: number; y: number };
  setUserLocation: (loc: { name: string; nodeId: string; x: number; y: number }) => void;

  selectedBuilding: Building | null;
  setSelectedBuilding: (b: Building | null) => void;

  selectedFacility: Facility | null;
  setSelectedFacility: (f: Facility | null) => void;

  selectedEvent: CampusEvent | null;
  setSelectedEvent: (e: CampusEvent | null) => void;

  // Routing
  activeAlgorithm: RouteOptimizer;
  setActiveAlgorithm: (algo: RouteOptimizer) => void;

  activePreference: RoutePreference;
  setActivePreference: (pref: RoutePreference) => void;

  currentRoute: RouteResult | null;
  calculateRouteTo: (targetNodeId: string, pref?: RoutePreference, algo?: RouteOptimizer) => RouteResult | null;
  isNavigating: boolean;
  setIsNavigating: (v: boolean) => void;
  navigationStepIndex: number;
  setNavigationStepIndex: (idx: number) => void;

  // Emergency
  isEmergencyActive: boolean;
  setIsEmergencyActive: (active: boolean) => void;
  activeIncident: EmergencyIncident | null;
  setActiveIncident: (inc: EmergencyIncident | null) => void;
  triggerEmergency: (category: EmergencyCategory | string) => void;
  resolveEmergency: () => void;

  // Blocked edges
  blockedEdgeIds: string[];
  blockEdge: (edgeId: string) => void;
  unblockEdge: (edgeId: string) => void;

  // AI Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  isAiThinking: boolean;
  setIsAiThinking: (thinking: boolean) => void;

  // Telemetry & Profile
  telemetry: CampusTelemetry;
  userProfile: UserProfile;
  updateUserProfile: (p: Partial<UserProfile>) => void;

  // Notifications
  notifications: CampusNotification[];
  markAllNotificationsRead: () => void;

  // Vision Modal
  isVisionModalOpen: boolean;
  setIsVisionModalOpen: (open: boolean) => void;
  applyVisionFinding: (finding: VisionAnalysis) => void;

  // Demo Scenarios
  runDemoScenario: (scenario: 'workshop' | 'emergency' | 'reset') => void;
}

const CampusContext = createContext<CampusContextType | null>(null);

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');

  // Simulated GPS Location (Zone B - Central Quad)
  const [userLocation, setUserLocation] = useState({
    name: 'Zone B - Central Quad',
    nodeId: 'node-user',
    x: 470,
    y: 440,
  });

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-library') || CAMPUS_BUILDINGS[0]
  );
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(CAMPUS_EVENTS[0]);

  const [activeAlgorithm, setActiveAlgorithm] = useState<RouteOptimizer>('A*');
  const [activePreference, setActivePreference] = useState<RoutePreference>('SAFEST');

  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(true);
  const [activeIncident, setActiveIncident] = useState<EmergencyIncident | null>(INITIAL_EMERGENCY);

  // Blocked paths
  const [blockedEdgeIds, setBlockedEdgeIds] = useState<string[]>(INITIAL_EMERGENCY.affectedPathIds);

  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [navigationStepIndex, setNavigationStepIndex] = useState<number>(0);

  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [isVisionModalOpen, setIsVisionModalOpen] = useState<boolean>(false);

  const [telemetry, setTelemetry] = useState<CampusTelemetry>(INITIAL_TELEMETRY);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);

  // Initial Chat stream matching Stitch design
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      timestamp: '10:41 AM • MU Neural Routing Agent',
      text: "Hello Swaroop! I'm CampusPilot AI for Marwadi University. I can guide you through the 3D digital twin, pinpoint academic blocks, find live summits in FOE & Central Library, locate quiet study carrels, and navigate safely during emergency scenarios.",
    },
    {
      id: 'msg-init-2',
      sender: 'user',
      timestamp: '10:42 AM • Sent',
      text: "Where is today's Marwadi AI Summit, and what is the safest route from Central Quad?",
    },
    {
      id: 'msg-init-3',
      sender: 'assistant',
      timestamp: '10:42 AM • Spatial Vector Computed',
      text: "The Marwadi AI Summit is taking place right now at the Faculty of Engineering & Technology (FOE Block), Lab 312 & Seminar Hall (2:30 PM – 5:00 PM). Here is your verified route:",
      smartCard: {
        type: 'EVENT_PATH',
        title: 'Marwadi AI Summit: Agentic Workflows & Digital Twins',
        badgeText: 'Live Now',
        destinationName: 'Faculty of Engineering (FOE Block)',
        destinationDetail: 'Lab 312 & Seminar Hall • 620m away',
        distance: '620 m',
        estWalk: '7 mins',
        optimizer: 'A* Heuristic (Safety First)',
        campusPathBadge: 'CCTV Verified • Safe Promenade',
        waypoints: {
          origin: 'Central Quad',
          via: 'Spine Blvd',
          dest: 'FOE Block',
        },
        eventData: CAMPUS_EVENTS[0],
        buildingId: 'bldg-engg',
      },
    },
  ]);

  const [notifications, setNotifications] = useState<CampusNotification[]>([
    {
      id: 'notif-1',
      title: 'Marwadi AI Summit in Session',
      body: 'Hands-on generative agent workshop is currently underway at FOE Block Room 312.',
      timestamp: '12m ago',
      type: 'event',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Corridor 2B Hazard Rerouting',
      body: 'Engineering Block Corridor 2B is under maintenance. Safest bypass via University Spine Boulevard.',
      timestamp: '25m ago',
      type: 'hazard',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Digital Library Quiet Vacancy High',
      body: 'Floors 2 & 3 have 76% quiet vacancy. Ideal study conditions detected by acoustic sensors.',
      timestamp: '1h ago',
      type: 'system',
      unread: false,
    },
  ]);

  // Graph Engine Instance
  const graphService = useMemo(() => {
    return new CampusGraphService(CAMPUS_NODES, CAMPUS_EDGES);
  }, []);

  // Recalculate route whenever target, algorithm, preference or blocked edges change
  const currentRoute = useMemo<RouteResult | null>(() => {
    let targetNodeId = 'node-lib-east';

    if (isEmergencyActive) {
      targetNodeId = 'node-northgate-safe';
    } else if (selectedBuilding) {
      const matchNode = CAMPUS_NODES.find((n) => n.buildingId === selectedBuilding.id);
      if (matchNode) {
        targetNodeId = matchNode.id;
      }
    }

    return graphService.findRoute(userLocation.nodeId, targetNodeId, {
      algorithm: activeAlgorithm,
      preference: isEmergencyActive ? 'SAFEST' : activePreference,
      emergencyActive: isEmergencyActive,
      customBlockedEdgeIds: blockedEdgeIds,
    });
  }, [
    userLocation.nodeId,
    selectedBuilding,
    activeAlgorithm,
    activePreference,
    blockedEdgeIds,
    isEmergencyActive,
    graphService,
  ]);

  const calculateRouteTo = (
    targetNodeId: string,
    pref?: RoutePreference,
    algo?: RouteOptimizer
  ): RouteResult | null => {
    return graphService.findRoute(userLocation.nodeId, targetNodeId, {
      algorithm: algo || activeAlgorithm,
      preference: pref || activePreference,
      emergencyActive: isEmergencyActive,
      customBlockedEdgeIds: blockedEdgeIds,
    });
  };

  const blockEdge = (edgeId: string) => {
    setBlockedEdgeIds((prev) => (prev.includes(edgeId) ? prev : [...prev, edgeId]));
  };

  const unblockEdge = (edgeId: string) => {
    setBlockedEdgeIds((prev) => prev.filter((id) => id !== edgeId));
  };

  const triggerEmergency = (category: EmergencyCategory | string) => {
    setIsEmergencyActive(true);
    const validCategory = (category as EmergencyCategory) || 'Fire';
    const incident: EmergencyIncident = {
      id: 'inc-' + Date.now(),
      type: validCategory,
      title: `${category.toUpperCase()} ALERT: Hazard Active in Engineering FOE Block`,
      description: `Thermal and optical IoT camera detectors triggered in Faculty of Engineering Block Level 2 corridor. Automated emergency protocol initiated.`,
      location: 'Faculty of Engineering (FOE Block) - Level 2',
      buildingId: 'bldg-engg',
      severity: 'High',
      status: 'Active',
      timestamp: 'Just now',
      affectedPathIds: ['edge-user-west', 'edge-west-engg', 'edge-west-admin'],
      recommendedSafeZoneId: 'bldg-northgate',
      recommendedDirective:
        'Evacuate toward Main Highway Gate 1 Safe Assembly Lawn 1 via Central Spine Boulevard. Engineering Corridor 2B is completely sealed off.',
    };
    setActiveIncident(incident);
    setBlockedEdgeIds(incident.affectedPathIds);

    const safeBldg = CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-northgate');
    if (safeBldg) {
      setSelectedBuilding(safeBldg);
    }

    setNotifications((prev) => [
      {
        id: 'notif-emerg-' + Date.now(),
        title: `CRITICAL: ${category} Alert Active`,
        body: 'Tactical evacuation route toward Highway Gate 1 Safe Zone is now displayed on your 3D Digital Twin HUD.',
        timestamp: 'Just now',
        type: 'hazard',
        unread: true,
      },
      ...prev,
    ]);
  };

  const resolveEmergency = () => {
    setIsEmergencyActive(false);
    setActiveIncident(null);
    setBlockedEdgeIds([]);
    const libBldg = CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-library');
    if (libBldg) setSelectedBuilding(libBldg);
  };

  const addChatMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  const updateUserProfile = (p: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...p }));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const applyVisionFinding = (finding: VisionAnalysis) => {
    if (finding.severity !== 'normal') {
      blockEdge('edge-user-west');
      blockEdge('edge-west-engg');
    }

    addChatMessage({
      id: 'msg-vision-' + Date.now(),
      sender: 'assistant',
      timestamp: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Optical AI Scan`,
      badge: 'Vision Analysis',
      text: `CV Analysis Verified: ${finding.detection}. Confidence: ${finding.confidence > 1 ? finding.confidence : Math.round(finding.confidence * 100)}%. Recommendation: ${finding.recommendedAction}`,
      smartCard: {
        type: 'TACTICAL_HUD',
        title: `Hazard Verified: ${finding.detection}`,
        badgeText: 'CV Optical Flow',
        destinationName: 'Main Highway Gate 1 Safe Zone',
        destinationDetail: finding.recommendedAction,
        distance: '480 m',
        estWalk: '3 mins',
        optimizer: 'A* Bypass',
        campusPathBadge: 'Corridor 2B Rerouted',
        waypoints: {
          origin: 'Central Quad',
          via: 'Open Promenade',
          dest: 'Highway Gate 1',
        },
        buildingId: 'bldg-northgate',
      },
    });
  };

  const runDemoScenario = (scenario: 'workshop' | 'emergency' | 'reset') => {
    if (scenario === 'workshop') {
      setIsEmergencyActive(false);
      setBlockedEdgeIds([]);
      const enggBldg = CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-engg');
      if (enggBldg) setSelectedBuilding(enggBldg);
      setSelectedEvent(CAMPUS_EVENTS[0]);
      setActiveAlgorithm('A*');
      setActivePreference('SAFEST');
      setActiveScreen('map');
    } else if (scenario === 'emergency') {
      triggerEmergency('Fire');
      setActiveScreen('emergency');
    } else if (scenario === 'reset') {
      resolveEmergency();
      setSelectedBuilding(CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-library') || CAMPUS_BUILDINGS[0]);
      setActiveAlgorithm('A*');
      setActivePreference('SAFEST');
      setTelemetry(INITIAL_TELEMETRY);
      setActiveScreen('home');
    }
  };

  return (
    <CampusContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        userLocation,
        setUserLocation,
        selectedBuilding,
        setSelectedBuilding,
        selectedFacility,
        setSelectedFacility,
        selectedEvent,
        setSelectedEvent,
        activeAlgorithm,
        setActiveAlgorithm,
        activePreference,
        setActivePreference,
        currentRoute,
        calculateRouteTo,
        isNavigating,
        setIsNavigating,
        navigationStepIndex,
        setNavigationStepIndex,
        isEmergencyActive,
        setIsEmergencyActive,
        activeIncident,
        setActiveIncident,
        triggerEmergency,
        resolveEmergency,
        blockedEdgeIds,
        blockEdge,
        unblockEdge,
        chatMessages,
        addChatMessage,
        isAiThinking,
        setIsAiThinking,
        telemetry,
        userProfile,
        updateUserProfile,
        notifications,
        markAllNotificationsRead,
        isVisionModalOpen,
        setIsVisionModalOpen,
        applyVisionFinding,
        runDemoScenario,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = (): CampusContextType => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};
