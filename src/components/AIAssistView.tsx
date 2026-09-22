/**
 * CampusPilot AI Assistant View
 * Conversational Natural Language Interface with Smart Spatial Cards,
 * Waypoint HUDs, and integrated Computer Vision triggers.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useCampus } from '../context/CampusContext';
import { campusAI } from '../services/aiService';
import { CAMPUS_BUILDINGS } from '../data/campusData';
import {
  Brain,
  Camera,
  Mic,
  ArrowUp,
  ArrowRight,
  Compass,
  Check,
  UserCheck,
} from 'lucide-react';

export const AIAssistView: React.FC = () => {
  const {
    chatMessages,
    addChatMessage,
    isAiThinking,
    setIsAiThinking,
    setSelectedBuilding,
    setSelectedEvent,
    setActiveScreen,
    setIsVisionModalOpen,
  } = useCampus();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiThinking]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    setInputQuery('');

    // Add user message
    const userMsg = {
      id: 'msg-user-' + Date.now(),
      sender: 'user' as const,
      timestamp: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Sent`,
      text: query,
    };
    addChatMessage(userMsg);

    setIsAiThinking(true);

    try {
      // Process with campusAI NLP engine
      const result = await campusAI.processQuery(query);
      setTimeout(() => {
        setIsAiThinking(false);
        addChatMessage(result.message);
      }, 400);
    } catch {
      setIsAiThinking(false);
    }
  };

  const handleSpeechToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Simulated speech prompt
      setInputQuery("Where is today's AI & Machine Learning workshop?");
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        handleSend(transcript);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setInputQuery("Take me to the Central Library East Entrance");
    }
  };

  const promptSuggestions = [
    "Where is today's AI workshop?",
    'Is the library quiet right now?',
    'Take me to the auditorium',
    'Where is the nearest cafeteria?',
    'Any emergency in Engineering Block?',
  ];

  return (
    <div className="relative w-full h-full flex flex-col bg-surface overflow-hidden">
      {/* Neural Core Top Header Banner */}
      <div className="px-space-md py-3 bg-surface-container-low border-b border-surface-container-high/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-headline-sm text-sm font-bold text-on-surface">
              CampusPilot Neural Assistant
            </h2>
            <p className="font-code-telemetry text-xs text-on-surface-variant">
              Spatial Reasoning & Campus Graph • v4.2
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Online</span>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-space-md space-y-4 max-w-3xl mx-auto w-full">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="font-code-telemetry text-[11px] text-on-surface-variant">
                  {msg.timestamp}
                </span>
                {msg.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-error-container text-error">
                    {msg.badge}
                  </span>
                )}
              </div>

              {/* Message Bubble */}
              {msg.text && (
                <div
                  className={`p-3.5 rounded-2xl text-body-md text-sm sm:text-base leading-relaxed max-w-[88%] shadow-xs ${
                    isUser
                      ? 'bg-primary text-on-primary rounded-tr-xs'
                      : 'bg-surface-container-low text-on-surface rounded-tl-xs border border-surface-container'
                  }`}
                >
                  {msg.text}
                </div>
              )}

              {/* Rich Smart Card matching Stitch layout */}
              {msg.smartCard && (
                <div className="mt-2 w-full max-w-md bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container/30 text-secondary text-[11px] font-bold uppercase tracking-wider">
                        {msg.smartCard.badgeText}
                      </span>
                      <h3 className="font-headline-sm text-base font-bold text-on-surface mt-1">
                        {msg.smartCard.title}
                      </h3>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                        {msg.smartCard.destinationName} • {msg.smartCard.destinationDetail}
                      </p>
                    </div>
                  </div>

                  {/* 4-Column Micro Telemetry Matrix */}
                  <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-surface-container-low text-center">
                    <div className="p-1">
                      <span className="text-[10px] font-code-telemetry text-on-surface-variant uppercase block">
                        Distance
                      </span>
                      <span className="font-code-telemetry text-xs font-bold text-on-surface">
                        {msg.smartCard.distance}
                      </span>
                    </div>
                    <div className="p-1 border-l border-surface-container">
                      <span className="text-[10px] font-code-telemetry text-on-surface-variant uppercase block">
                        Est. Walk
                      </span>
                      <span className="font-code-telemetry text-xs font-bold text-on-surface">
                        {msg.smartCard.estWalk}
                      </span>
                    </div>
                    <div className="p-1 border-l border-surface-container">
                      <span className="text-[10px] font-code-telemetry text-on-surface-variant uppercase block">
                        Optimizer
                      </span>
                      <span className="font-code-telemetry text-xs font-bold text-secondary">
                        {msg.smartCard.optimizer}
                      </span>
                    </div>
                    <div className="p-1 border-l border-surface-container">
                      <span className="text-[10px] font-code-telemetry text-on-surface-variant uppercase block">
                        Path
                      </span>
                      <span className="font-code-telemetry text-[11px] font-bold text-tertiary truncate block">
                        {msg.smartCard.campusPathBadge}
                      </span>
                    </div>
                  </div>

                  {/* Waypoint HUD */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container-low text-body-sm">
                    <div className="flex items-center gap-1.5 text-on-surface truncate min-w-0">
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
                      <span className="font-code-telemetry text-xs font-medium truncate">
                        {msg.smartCard.waypoints.origin}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant flex-shrink-0 mx-1" />
                    <div className="flex items-center gap-1.5 text-on-surface truncate min-w-0">
                      <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0"></span>
                      <span className="font-code-telemetry text-xs font-medium truncate">
                        {msg.smartCard.waypoints.via}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant flex-shrink-0 mx-1" />
                    <div className="flex items-center gap-1.5 text-on-surface truncate min-w-0">
                      <span className="w-2 h-2 rounded-full bg-tertiary flex-shrink-0"></span>
                      <span className="font-code-telemetry text-xs font-bold truncate">
                        {msg.smartCard.waypoints.dest}
                      </span>
                    </div>
                  </div>

                  {/* Smart Card Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        if (msg.smartCard?.buildingId) {
                          const bldg = CAMPUS_BUILDINGS.find((b) => b.id === msg.smartCard?.buildingId);
                          if (bldg) setSelectedBuilding(bldg);
                        }
                        if (msg.smartCard?.eventData) {
                          setSelectedEvent(msg.smartCard.eventData);
                        }
                        setActiveScreen('map');
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform cursor-pointer"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Show 3D Route</span>
                    </button>

                    {msg.smartCard.eventData && (
                      <button
                        onClick={() => {
                          const ev = msg.smartCard?.eventData;
                          if (ev) {
                            ev.isRegistered = !ev.isRegistered;
                            setSelectedEvent({ ...ev });
                          }
                        }}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          msg.smartCard.eventData.isRegistered
                            ? 'bg-tertiary/15 border-tertiary text-tertiary'
                            : 'border-surface-container bg-surface text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        {msg.smartCard.eventData.isRegistered ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <UserCheck className="w-3.5 h-3.5" />
                        )}
                        <span>{msg.smartCard.eventData.isRegistered ? 'Registered' : 'Register'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isAiThinking && (
          <div className="flex items-center gap-2 p-3 bg-surface-container-low rounded-2xl w-fit">
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 rounded-full bg-tertiary animate-bounce [animation-delay:0.4s]"></span>
            <span className="text-xs font-code-telemetry text-on-surface-variant ml-1">
              Computing spatial path traversal...
            </span>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-space-md py-2 overflow-x-auto flex items-center gap-2 no-scrollbar bg-surface/90 border-t border-surface-container-high/40">
        {promptSuggestions.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface text-xs font-medium hover:bg-surface-container border border-surface-container active:scale-95 transition-all cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Bottom Input Bar Dock */}
      <div className="p-space-md bg-surface-container-lowest border-t border-surface-container shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 max-w-3xl mx-auto"
        >
          {/* AI Vision Hazard Scanner trigger */}
          <button
            type="button"
            onClick={() => setIsVisionModalOpen(true)}
            title="Scan Hazard / Computer Vision"
            className="w-11 h-11 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer flex-shrink-0"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything: buildings, events, quiet study spots..."
              className="w-full h-11 pl-4 pr-10 rounded-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 border border-surface-container"
            />
            <button
              type="button"
              onClick={handleSpeechToggle}
              title="Voice Input"
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isListening ? 'text-error animate-pulse' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center disabled:opacity-40 shadow-xs active:scale-95 transition-transform cursor-pointer flex-shrink-0"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
