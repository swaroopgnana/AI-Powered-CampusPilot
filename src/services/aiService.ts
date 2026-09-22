/**
 * CampusPilot AI Assistant & Semantic NLP Service
 * Analyzes user natural-language queries, maps them to structured campus entities,
 * and generates rich smart cards with waypoint HUDs and interactive buttons.
 */

import { ChatMessage, CampusEvent, Facility, Building } from '../types';
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
            destinationName: 'North Gate Safe Zone (Muster Lawn B)',
            destinationDetail: 'Triage Station #2 Active • 550m (3.5 mins walk)',
            distance: '550 m',
            estWalk: '3.5 mins',
            optimizer: 'Safety Evac A*',
            campusPathBadge: 'Hazard Bypass Active',
            waypoints: {
              origin: 'You (Quad B)',
              via: 'Open Lawn',
              dest: 'North Gate',
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
          text: `Yes! Central Library 2nd & 3rd floors currently have 78% quiet zone vacancy. Cafe on 1st floor has moderate queue (~6 mins).`,
          smartCard: {
            type: 'ACOUSTIC_TELEMETRY',
            title: 'Acoustic Sensors: Prime Study Conditions',
            badgeText: 'Optimal Study',
            destinationName: 'Central Library — East Entrance',
            destinationDetail: 'Floors 2 & 3 Research Pods Available',
            distance: '800 m',
            estWalk: '11 mins',
            optimizer: 'Safest CCTV',
            campusPathBadge: '32 dB (Whisper) • 44 Desks Open',
            waypoints: {
              origin: 'You (Quad B)',
              via: 'Pine Ave',
              dest: 'Library East',
            },
            buildingId: 'bldg-library',
          },
        },
      };
    }

    // 3. AI & ML Workshop or Specific Events
    if (
      query.includes('workshop') ||
      query.includes('event') ||
      query.includes('hackathon') ||
      query.includes('career fair') ||
      query.includes('competition')
    ) {
      let matchedEvent = CAMPUS_EVENTS.find((e) =>
        e.title.toLowerCase().includes(query.replace('where is', '').replace('today', '').trim())
      );
      if (!matchedEvent) {
        matchedEvent = CAMPUS_EVENTS[0]; // Default to AI workshop
      }

      return {
        intent: 'EVENT_SEARCH',
        targetEvent: matchedEvent,
        targetBuildingId: matchedEvent.buildingId,
        message: {
          id: msgId,
          sender: 'assistant',
          timestamp: `${time} • Spatial Vector Computed`,
          text: `I found the "${matchedEvent.title}". It takes place at ${matchedEvent.venue}, ${matchedEvent.room} (${matchedEvent.timeText}).`,
          smartCard: {
            type: 'EVENT_PATH',
            title: matchedEvent.title,
            badgeText: matchedEvent.isLiveNow ? 'Live Now' : matchedEvent.date,
            destinationName: matchedEvent.venue,
            destinationDetail: matchedEvent.room,
            distance: '720 m',
            estWalk: '9 mins',
            optimizer: 'A* Shortest',
            campusPathBadge: 'Safe • Low crowd',
            waypoints: {
              origin: 'Current: Zone B',
              via: 'Pine Ave',
              dest: 'Turing Cmplx',
            },
            eventData: matchedEvent,
            buildingId: matchedEvent.buildingId,
          },
        },
      };
    }

    // 4. Cafeteria / Food / Mess Menu
    if (
      query.includes('cafeteria') ||
      query.includes('food') ||
      query.includes('mess') ||
      query.includes('eat') ||
      query.includes('lunch') ||
      query.includes('coffee')
    ) {
      const cafe = CAMPUS_FACILITIES.find((f) => f.type === 'Cafeteria') || CAMPUS_FACILITIES[5];
      return {
        intent: 'FACILITY_SEARCH',
        targetFacility: cafe,
        targetBuildingId: cafe.buildingId,
        message: {
          id: msgId,
          sender: 'assistant',
          timestamp: `${time} • Campus Dining Matrix`,
          text: `The nearest dining hub is ${cafe.name} in ${cafe.buildingName}, located approximately ${cafe.distanceMeters}m away (~3 mins walk). Today's specials include Wood-fired Pizza, Pan-Asian Bowls, and Fresh Salads.`,
          smartCard: {
            type: 'VENUE_PATH',
            title: cafe.name,
            badgeText: 'Open Now',
            destinationName: cafe.buildingName,
            destinationDetail: 'Ground Floor Plaza (Ramp Accessible)',
            distance: '310 m',
            estWalk: '4 mins',
            optimizer: 'A* Direct',
            campusPathBadge: 'Low queue (~4 min)',
            waypoints: {
              origin: 'You (Quad B)',
              via: 'South Lawn',
              dest: 'Cafeteria',
            },
            facilityData: cafe,
            buildingId: cafe.buildingId,
          },
        },
      };
    }

    // 5. Navigation: Auditorium / Library / Science / Sports / Lab
    let targetBuilding: Building | undefined;
    if (query.includes('auditorium') || query.includes('admin')) {
      targetBuilding = CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-admin');
    } else if (query.includes('library')) {
      targetBuilding = CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-library');
    } else if (query.includes('lab') || query.includes('turing') || query.includes('computer')) {
      targetBuilding = CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-turing');
    } else if (query.includes('science')) {
      targetBuilding = CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-science');
    } else if (query.includes('sports') || query.includes('gym') || query.includes('basketball')) {
      targetBuilding = CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-sports');
    }

    if (targetBuilding) {
      return {
        intent: 'NAVIGATION',
        targetBuildingId: targetBuilding.id,
        message: {
          id: msgId,
          sender: 'assistant',
          timestamp: `${time} • Routing Node Calculated`,
          text: `Calculated the optimal route to ${targetBuilding.name}. The path via central walkways is clear and well-lit with CCTV coverage.`,
          smartCard: {
            type: 'VENUE_PATH',
            title: targetBuilding.name,
            badgeText: targetBuilding.code,
            destinationName: targetBuilding.name,
            destinationDetail: targetBuilding.entrances[0]?.name || 'Main Entrance',
            distance: '800 m',
            estWalk: '11 mins',
            optimizer: 'A* Optimal',
            campusPathBadge: 'CCTV Monitored • Step-Free',
            waypoints: {
              origin: 'Current: Zone B',
              via: 'Pine Ave',
              dest: targetBuilding.name.split('—')[0].trim(),
            },
            buildingId: targetBuilding.id,
          },
        },
      };
    }

    // 6. General fallback assistance
    return {
      intent: 'GENERAL_QUERY',
      message: {
        id: msgId,
        sender: 'assistant',
        timestamp: `${time} • Neural Assistant`,
        text: `I'm ready to assist you, Swaroop! You can ask me to navigate to any building, find workshops or hackathons, inspect library desk vacancy, locate facilities like cafeterias or ATMs, or trigger emergency evacuation routing.`,
      },
    };
  }
}

export const campusAI = new CampusAIService();
