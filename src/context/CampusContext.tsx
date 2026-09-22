/**
 * CampusPilot Central Application State Context
 * Manages routing, user location, graph recalculations, active emergency state,
 * AI chat history, notifications, and demo scenarios.
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
  triggerEmergency: (category: string) => void;
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
    x: 480,
    y: 460,
  });

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-library') || null
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
      timestamp: '10:41 AM • Neural Routing Agent',
      text: "Hi Swaroop! I'm CampusPilot AI. I can help you navigate the university campus, locate ongoing workshops, check lab availability, and guide you during emergency situations.",
    },
    {
      id: 'msg-init-2',
      sender: 'user',
      timestamp: '10:42 AM • Sent',
      text: "Where is today's AI & Machine Learning workshop, and what is the fastest route from here?",
    },
    {
      id: 'msg-init-3',
      sender: 'assistant',
      timestamp: '10:42 AM • Spatial Vector Computed',
      text: '',
      smartCard: {
        type: 'EVENT_PATH',
        title: 'AI & Machine Learning Workshop',
        badgeText: 'Live Now',
        destinationName: 'Alan Turing Academic Complex',
        destinationDetail: 'Room 302 (North Wing, 3rd Floor)',
        distance: '720 m',
        estWalk: '9 mins',
        optimizer: 'A* Shortest',
        campusPathBadge: 'Safe • Low crowd',
        waypoints: {
          origin: 'Current: Zone B',
          via: 'Pine Ave',
          dest: 'Turing Cmplx',
        },
        eventData: CAMPUS_EVENTS[0],
        buildingId: 'bldg-turing',
      },
    },
    {
      id: 'msg-init-4',
      sender: 'user',
      timestamp: '10:44 AM • Sent',
      text: 'Is the library quiet right now?',
    },
    {
      id: 'msg-init-5',
      sender: 'assistant',
      timestamp: '10:44 AM • IoT Sensor Stream',
      text: 'Yes! Central Library 2nd & 3rd floors currently have 78% quiet zone vacancy. Cafe on 1st floor has moderate queue (~6 mins).',
    },
  ]);

  const [notifications, setNotifications] = useState<CampusNotification[]>([
    {
      id: 'notif-1',
      title: 'AI Workshop Starts in 25 min',
      body: 'Room 302 Turing Academic Complex. Seat allocation confirmed.',
      timestamp: '5m ago',
      type: 'event',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Corridor 2B Electrical Surge Hazard',
      body: 'Code Orange active. Tactical rerouting active for zone Sector 4.',
      timestamp: '12m ago',
      type: 'hazard',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'East Walkway Maintenance',
      body: 'Maintenance underway until 4:00 PM. Follow green arrows.',
      timestamp: '1h ago',
      type: 'navigation',
      unread: false,
    },
  ]);

  // Graph instance memoized
  const graphService = useMemo(() => {
    return new CampusGraphService(CAMPUS_NODES, CAMPUS_EDGES);
  }, []);

  // Compute route whenever destination, preference, algorithm, or blocked edges change
  const currentRoute = useMemo(() => {
    // Target destination node
    let targetNodeId = 'node-lib-east';

    if (isEmergencyActive && activeIncident) {
      targetNodeId = 'node-northgate-safe';
    } else if (selectedBuilding) {
      if (selectedBuilding.id === 'bldg-turing') targetNodeId = 'node-turing-entrance';
      else if (selectedBuilding.id === 'bldg-admin') targetNodeId = 'node-admin-entrance';
      else if (selectedBuilding.id === 'bldg-science') targetNodeId = 'node-science-entrance';
      else if (selectedBuilding.id === 'bldg-cafeteria') targetNodeId = 'node-cafe-entrance';
      else if (selectedBuilding.id === 'bldg-sports') targetNodeId = 'node-sports-entrance';
      else if (selectedBuilding.id === 'bldg-northgate') targetNodeId = 'node-northgate-safe';
      else targetNodeId = 'node-lib-east';
    }

    return graphService.findRoute(userLocation.nodeId, targetNodeId, {
      preference: activePreference,
      algorithm: activeAlgorithm,
      emergencyActive: isEmergencyActive,
      customBlockedEdgeIds: blockedEdgeIds,
    });
  }, [
    userLocation.nodeId,
    selectedBuilding,
    activePreference,
    activeAlgorithm,
    isEmergencyActive,
    activeIncident,
    blockedEdgeIds,
    graphService,
  ]);

  const calculateRouteTo = (
    targetNodeId: string,
    pref: RoutePreference = activePreference,
    algo: RouteOptimizer = activeAlgorithm
  ): RouteResult | null => {
    return graphService.findRoute(userLocation.nodeId, targetNodeId, {
      preference: pref,
      algorithm: algo,
      emergencyActive: isEmergencyActive,
      customBlockedEdgeIds: blockedEdgeIds,
    });
  };

  const addChatMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  const blockEdge = (edgeId: string) => {
    setBlockedEdgeIds((prev) => (prev.includes(edgeId) ? prev : [...prev, edgeId]));
  };

  const unblockEdge = (edgeId: string) => {
    setBlockedEdgeIds((prev) => prev.filter((id) => id !== edgeId));
  };

  const triggerEmergency = (category: string) => {
    setIsEmergencyActive(true);
    const newInc: EmergencyIncident = {
      id: 'inc-' + Date.now(),
      type: (category as any) || 'Fire',
      title: `${category} Incident Reported`,
      description: `Rapid sensor trip and verified report in Sector 4. Evacuation protocol active.`,
      location: 'Engineering Block - Level 2',
      buildingId: 'bldg-turing',
      severity: 'High',
      status: 'Active',
      timestamp: 'Just now',
      affectedPathIds: ['edge-user-west', 'edge-west-turing'],
      recommendedSafeZoneId: 'bldg-northgate',
      recommendedDirective: 'Evacuate toward North Gate Safe Zone via central open lawn.',
    };
    setActiveIncident(newInc);
    setBlockedEdgeIds(['edge-user-west', 'edge-west-turing']);
    setNotifications((prev) => [
      {
        id: 'notif-sos-' + Date.now(),
        title: `EMERGENCY ALERT: ${category}`,
        body: 'Tactical evacuation route generated. Proceed to North Gate Safe Zone.',
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
  };

  const updateUserProfile = (patch: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...patch }));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const applyVisionFinding = (finding: VisionAnalysis) => {
    if (finding.blockedEdgeIds && finding.blockedEdgeIds.length > 0) {
      finding.blockedEdgeIds.forEach((id) => blockEdge(id));
    }
    setNotifications((prev) => [
      {
        id: 'notif-vision-' + Date.now(),
        title: `AI Vision: ${finding.detection}`,
        body: `${finding.location}. Action: ${finding.recommendedAction}`,
        timestamp: 'Just now',
        type: 'hazard',
        unread: true,
      },
      ...prev,
    ]);
  };

  // Demo scenarios implementation
  const runDemoScenario = (scenario: 'workshop' | 'emergency' | 'reset') => {
    if (scenario === 'workshop') {
      setIsEmergencyActive(false);
      const turing = CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-turing') || null;
      setSelectedBuilding(turing);
      setSelectedEvent(CAMPUS_EVENTS[0]);
      setActivePreference('SAFEST');
      setActiveAlgorithm('A*');
      setActiveScreen('map');
    } else if (scenario === 'emergency') {
      setIsEmergencyActive(true);
      setActiveIncident(INITIAL_EMERGENCY);
      setBlockedEdgeIds(INITIAL_EMERGENCY.affectedPathIds);
      setActiveScreen('emergency');
    } else {
      setIsEmergencyActive(false);
      setActiveIncident(null);
      setBlockedEdgeIds([]);
      setSelectedBuilding(CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-library') || null);
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

export const useCampus = () => {
  const ctx = useContext(CampusContext);
  if (!ctx) throw new Error('useCampus must be used within CampusProvider');
  return ctx;
};
