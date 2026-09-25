/**
 * CampusPilot AI Assistant & Semantic NLP Service
 * Configured for Marwadi University (MU) Campus Knowledge Base
 * Analyzes natural-language queries, maps them to structured campus entities,
 * and generates rich smart cards with waypoint HUDs and interactive buttons.
 */

import { ChatMessage, CampusEvent, Facility } from '../types';
import { CAMPUS_BUILDINGS, CAMPUS_FACILITIES, CAMPUS_EVENTS, INITIAL_EMERGENCY } from '../data/campusData';

export interface AIProcessResult {
  message: ChatMessage;
  intent:
    | 'EVENT_SEARCH'
    | 'NAVIGATION'
    | 'FACILITY_SEARCH'
    | 'ACOUSTIC_TELEMETRY'
    | 'EMERGENCY_QUERY'
    | 'GENERAL_QUERY';
  targetBuildingId?: string;
  targetEvent?: CampusEvent;
  targetFacility?: Facility;
}

export class CampusAIService {
  /**
   * Process a natural language query from student, faculty, or visitor
   */
  public async processQuery(userInput: string): Promise<AIProcessResult> {
    const query = userInput.trim().toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgId = 'msg-' + Date.now();

    // 1. Emergency intent check
    if (
      query.includes('emergency') ||
      query.includes('fire') ||
      query.includes('danger') ||
      query.includes('hazard') ||
      query.includes('evacuat') ||
      query.includes('safe route')
    ) {
      return {
        intent: 'EMERGENCY_QUERY',
        targetBuildingId: 'bldg-northgate',
        message: {
          id: msgId,
          sender: 'assistant',
          timestamp: `${time} • Tactical Safety Command`,
          badge: 'Emergency Directive',
          text: `⚠️ Emergency Alert: ${INITIAL_EMERGENCY.title} in ${INITIAL_EMERGENCY.location}. Directives: ${INITIAL_EMERGENCY.recommendedDirective}`,
          smartCard: {
            type: 'EMERGENCY_DIRECTIVE',
            title: INITIAL_EMERGENCY.title,
            badgeText: 'Code Orange',
            destinationName: 'Main Highway Gate 1 Safe Assembly Lawn 1',
            destinationDetail: 'Triage Station & Highway Gate Access • 480m (3 mins walk)',
            distance: '480 m',
            estWalk: '3 mins',
            optimizer: 'Safety Evac A*',
            campusPathBadge: 'Hazard Bypass Active',
            waypoints: {
              origin: 'You (Quad B)',
              via: 'Spine Promenade',
              dest: 'Highway Gate 1',
            },
            buildingId: 'bldg-northgate',
          },
        },
      };
    }

    // 2. Library Acoustics & Quiet Zones
    if (
      (query.includes('library') || query.includes('study')) &&
      (query.includes('quiet') || query.includes('noise') || query.includes('crowd') || query.includes('desk') || query.includes('seat'))
    ) {
      return {
        intent: 'ACOUSTIC_TELEMETRY',
        targetBuildingId: 'bldg-library',
        message: {
          id: msgId,
          sender: 'assistant',
          timestamp: `${time} • IoT Sensor Stream`,
          text: `Marwadi University Central Digital Library 2nd & 3rd floors currently have 76% quiet zone vacancy. Reading pods on Floor 3 are optimal (31 dB whisper level).`,
          smartCard: {
            type: 'ACOUSTIC_TELEMETRY',
            title: 'MU Central Library: Optimal Study Conditions',
            badgeText: 'Optimal Study',
            destinationName: 'MU Central Knowledge Resource Center',
            destinationDetail: 'Floors 2 & 3 Research Pods & IEEE E-Terminal Hub Available',
            distance: '750 m',
            estWalk: '8 mins',
            optimizer: 'Safest CCTV',
            campusPathBadge: '31 dB (Whisper) • 64 Desks Open',
            waypoints: {
              origin: 'You (Quad B)',
              via: 'Spine Blvd',
              dest: 'Central Library',
            },
            buildingId: 'bldg-library',
          },
        },
      };
    }

    // 3. AI Summit / Workshop or Specific Events
    if (
      query.includes('workshop') ||
      query.includes('event') ||
      query.includes('hackathon') ||
      query.includes('career fair') ||
      query.includes('competition') ||
      query.includes('cricket') ||
      query.includes('sports')
    ) {
      let matchedEvent = CAMPUS_EVENTS.find((e) =>
        e.title.toLowerCase().includes(query.replace('where is', '').replace('today', '').trim())
      );
      if (!matchedEvent) {
        if (query.includes('hackathon')) matchedEvent = CAMPUS_EVENTS[1];
        else if (query.includes('career') || query.includes('placement')) matchedEvent = CAMPUS_EVENTS[2];
        else if (query.includes('cricket') || query.includes('sports')) matchedEvent = CAMPUS_EVENTS[3];
        else matchedEvent = CAMPUS_EVENTS[0]; // Default to Marwadi AI Summit
      }

      return {
        intent: 'EVENT_SEARCH',
        targetEvent: matchedEvent,
        targetBuildingId: matchedEvent.buildingId,
        message: {
          id: msgId,
          sender: 'assistant',
          timestamp: `${time} • Spatial Vector Computed`,
          text: `Found "${matchedEvent.title}". Venue: ${matchedEvent.venue}, ${matchedEvent.room} (${matchedEvent.timeText}).`,
          smartCard: {
            type: 'EVENT_PATH',
            title: matchedEvent.title,
            badgeText: matchedEvent.isLiveNow ? 'Live Now' : matchedEvent.date,
            destinationName: matchedEvent.venue,
            destinationDetail: matchedEvent.room,
            distance: '620 m',
            estWalk: '7 mins',
            optimizer: 'A* Shortest',
            campusPathBadge: 'Safe • Low crowd',
            waypoints: {
              origin: 'Current: Zone B',
              via: 'Spine Blvd',
              dest: matchedEvent.venue.split(' ')[0],
            },
            eventData: matchedEvent,
            buildingId: matchedEvent.buildingId,
          },
        },
      };
    }

    // 4. Cafeteria / Food / Amul / Mess
    if (
      query.includes('cafeteria') ||
      query.includes('food') ||
      query.includes('canteen') ||
      query.includes('mess') ||
      query.includes('amul') ||
      query.includes('eat') ||
      query.includes('lunch') ||
      query.includes('coffee')
    ) {
      const cafeFacility = CAMPUS_FACILITIES.find((f) => f.id === 'fac-mu-cafe-main')!;
      return {
        intent: 'FACILITY_SEARCH',
        targetFacility: cafeFacility,
        targetBuildingId: 'bldg-cafeteria',
        message: {
          id: msgId,
          sender: 'assistant',
          timestamp: `${time} • Real-time Capacity`,
          text: `The Marwadi University Student Food Court & Amul Parlour is 280 meters away at the Dining Plaza. Queue wait is currently ~4 minutes.`,
          smartCard: {
            type: 'FACILITY_DIRECT',
            title: cafeFacility.name,
            badgeText: 'Open Now',
            destinationName: cafeFacility.buildingName,
            destinationDetail: 'Level 1 & 2 Food Court • Nescafe, Amul & Fresh Meals',
            distance: '280 m',
            estWalk: '3 mins',
            optimizer: 'Fastest Paved',
            campusPathBadge: 'Low Queue • Step-free Ramp',
            waypoints: {
              origin: 'You (Quad B)',
              via: 'South Promenade',
              dest: 'Food Court Plaza',
            },
            facilityData: cafeFacility,
            buildingId: 'bldg-cafeteria',
          },
        },
      };
    }

    // 5. Buildings / Rooms / Auditoriums / Labs
    if (
      query.includes('auditorium') ||
      query.includes('admin') ||
      query.includes('engineering') ||
      query.includes('foe') ||
      query.includes('hostel') ||
      query.includes('sports') ||
      query.includes('gym') ||
      query.includes('lab') ||
      query.includes('take me to') ||
      query.includes('how do i reach') ||
      query.includes('where is')
    ) {
      let bldg = CAMPUS_BUILDINGS.find((b) =>
        b.name.toLowerCase().includes(query.replace('where is', '').replace('take me to', '').trim())
      );

      if (!bldg) {
        if (query.includes('auditorium') || query.includes('admin')) bldg = CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-main');
        else if (query.includes('engineering') || query.includes('foe') || query.includes('lab')) bldg = CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-engg');
        else if (query.includes('library')) bldg = CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-library');
        else if (query.includes('sports') || query.includes('gym') || query.includes('cricket')) bldg = CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-sports');
        else if (query.includes('hostel') || query.includes('medical') || query.includes('clinic')) bldg = CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-hostel');
        else if (query.includes('management') || query.includes('law') || query.includes('fms')) bldg = CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-mgmt');
        else bldg = CAMPUS_BUILDINGS[1]; // FOE block
      }

      const destBldg = bldg || CAMPUS_BUILDINGS[0];

      return {
        intent: 'NAVIGATION',
        targetBuildingId: destBldg.id,
        message: {
          id: msgId,
          sender: 'assistant',
          timestamp: `${time} • Spatial Routing`,
          text: `Here is the optimal route to ${destBldg.name} (${destBldg.code}). It features accessible step-free entrances and full CCTV sensor mesh coverage.`,
          smartCard: {
            type: 'NAVIGATION_ROUTE',
            title: destBldg.name,
            badgeText: destBldg.code,
            destinationName: destBldg.name,
            destinationDetail: destBldg.description,
            distance: '520 m',
            estWalk: '6 mins',
            optimizer: 'Safest CCTV A*',
            campusPathBadge: 'Active Mesh Guided',
            waypoints: {
              origin: 'You (Quad B)',
              via: 'Spine Promenade',
              dest: destBldg.code,
            },
            buildingId: destBldg.id,
          },
        },
      };
    }

    // 6. Default General Inquiry
    return {
      intent: 'GENERAL_QUERY',
      message: {
        id: msgId,
        sender: 'assistant',
        timestamp: `${time} • MU Spatial Assistant`,
        text: `I can guide you anywhere across Marwadi University: Academic Blocks (FOE, FMS), Central Digital Library, Convention Auditorium, Student Food Court, Sports Complex, or Highway Gate 1. What would you like to explore?`,
      },
    };
  }
}

export const campusAI = new CampusAIService();
