/**
 * CampusPilot – Intelligent Campus Assistance System
 * Comprehensive Data Models & Type Definitions
 */

export type ScreenId =
  | 'home'
  | 'assistant'
  | 'map'
  | 'navigation'
  | 'events'
  | 'emergency'
  | 'facilities'
  | 'analytics'
  | 'profile';

export type RouteOptimizer = 'A*' | 'Dijkstra' | 'BFS' | 'DFS';

export type RoutePreference = 'SAFEST' | 'FASTEST' | 'ACCESSIBLE';

export interface BuildingEntrance {
  id: string;
  name: string;
  isAccessible: boolean;
  x: number;
  y: number;
}

export interface Building {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'Academic' | 'Administration' | 'Library' | 'Laboratory' | 'Recreation' | 'Dining' | 'Hostel' | 'Sports';
  latitude: number;
  longitude: number;
  mapX: number; // Isometric coordinates (0-1000)
  mapY: number;
  floors: number;
  facilities: string[];
  entrances: BuildingEntrance[];
  color: string;
  isSafeZone?: boolean;
}

export interface Facility {
  id: string;
  name: string;
  type:
    | 'Library'
    | 'Laboratory'
    | 'Classroom'
    | 'Cafeteria'
    | 'Medical Center'
    | 'ATM'
    | 'Parking'
    | 'Restroom'
    | 'Administration'
    | 'Sports'
    | 'Hostel';
  buildingId: string;
  buildingName: string;
  floor: string;
  room?: string;
  openingHours: string;
  accessibility: boolean;
  isOpen: boolean;
  distanceMeters: number;
  currentCapacity?: string;
  quietScore?: number; // 0-100
  powerOutletsAvailable?: number;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: 'Workshops' | 'Seminars' | 'Hackathons' | 'Competitions' | 'Technical' | 'Cultural' | 'Sports';
  date: string; // YYYY-MM-DD or readable
  timeText: string;
  startTime: string;
  endTime: string;
  venue: string;
  buildingId: string;
  room: string;
  organizer: string;
  registrationRequired: boolean;
  isRegistered?: boolean;
  isLiveNow?: boolean;
  attendeesCount: number;
  tags: string[];
}

export interface CampusNode {
  id: string;
  name: string;
  type: 'building' | 'entrance' | 'junction' | 'facility' | 'safe_zone';
  x: number;
  y: number;
  buildingId?: string;
}

export interface CampusEdge {
  id: string;
  from: string;
  to: string;
  distance: number; // meters
  accessibility: boolean; // step-free, wheelchair ramp
  crowdLevel: number; // 0 - 100
  dangerLevel: number; // 0 - 100
  blocked: boolean;
  cctvCovered: boolean;
  description: string;
}

export interface NavigationStep {
  stepIndex: number;
  instruction: string;
  distanceMeters: number;
  direction: 'straight' | 'right' | 'left' | 'slight_right' | 'slight_left' | 'arrive';
  landmark?: string;
}

export interface RouteResult {
  routeType: RoutePreference;
  algorithm: RouteOptimizer;
  nodeIds: string[];
  nodes: CampusNode[];
  totalDistanceMeters: number;
  estimatedMinutes: number;
  crowdSummary: string;
  safetySummary: string;
  accessibilitySummary: string;
  turnsCount: number;
  elevationMeters: number;
  cctvPostsCount: number;
  steps: NavigationStep[];
  rationale: string;
  waypointsHud: {
    origin: string;
    via: string;
    destination: string;
  };
}

export type EmergencyCategory =
  | 'Fire'
  | 'Medical Emergency'
  | 'Flood'
  | 'Blocked Road'
  | 'Overcrowding'
  | 'Power Failure'
  | 'Security Alert';

export interface EmergencyIncident {
  id: string;
  type: EmergencyCategory;
  title: string;
  description: string;
  location: string;
  buildingId: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Active' | 'Contained' | 'Resolved';
  timestamp: string;
  affectedPathIds: string[];
  recommendedSafeZoneId: string;
  recommendedDirective: string;
}

export interface VisionAnalysis {
  id: string;
  detection: string;
  category: 'Fire' | 'Flood' | 'Crowd' | 'Blocked road' | 'Infrastructure damage' | 'Normal condition';
  confidence: number; // 0 - 100 or 0 - 1
  location: string;
  recommendedAction: string;
  severity: 'normal' | 'warning' | 'danger';
  sampleImage?: string;
  timestamp: string;
  blockedEdgeIds?: string[];
  hazardDetected?: boolean;
  detectedIssue?: string;
  affectedPath?: string;
}

export interface CampusTelemetry {
  crowdDensityPercent: number;
  crowdStatus: 'Low' | 'Normal' | 'High' | 'Overcrowded';
  currentZone: string;
  beaconId: string;
  temperature: string;
  weatherCondition: string;
  meshLatencyMs: number;
  activeUsers: number;
  openDesksInLibrary: number;
  libraryNoiseDb: number;
}

export interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  senderName?: string;
  badge?: string;
  smartCard?: {
    type: 'EVENT_PATH' | 'VENUE_PATH' | 'ACOUSTIC_TELEMETRY' | 'EMERGENCY_DIRECTIVE' | 'FACILITY_DIRECT' | 'NAVIGATION_ROUTE' | 'TACTICAL_HUD';
    title: string;
    badgeText: string;
    destinationName: string;
    destinationDetail: string;
    distance: string;
    estWalk: string;
    optimizer: string;
    campusPathBadge: string;
    waypoints: { origin: string; via: string; dest: string };
    eventData?: CampusEvent;
    facilityData?: Facility;
    buildingId?: string;
  };
}

export interface UserProfile {
  name: string;
  role: string;
  department: string;
  year: string;
  studentId: string;
  avatarUrl: string;
  defaultOptimizer: RouteOptimizer;
  defaultPreference: RoutePreference;
  accessibleOnly: boolean;
  voiceGuidance: boolean;
  savedLocations: { id: string; name: string; buildingId: string }[];
  emergencyContacts: { name: string; number: string; role: string }[];
}
