/**
 * CampusPilot AI Assistant View
 * Conversational Natural Language Interface with Smart Spatial Cards,
 * Waypoint HUDs, and integrated Computer Vision triggers for Marwadi University.
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
  Sparkles,
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

    const userMsg = {
      id: 'msg-user-' + Date.now(),
      sender: 'user' as const,
      timestamp: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Sent`,
      text: query,
    };
    addChatMessage(userMsg);

    setIsAiThinking(true);

    try {
      const result = await campusAI.processQuery(query);
      setTimeout(() => {
        setIsAiThinking(false);
        addChatMessage(result.message);
      }, 350);
    } catch {
      setIsAiThinking(false);
    }
  };

  const handleSpeechToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setInputQuery("Where is today's Marwadi AI Summit?");
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
      setInputQuery("Take me to the MU Central Digital Library");
    }
  };

  const promptSuggestions = [
    "Where is today's Marwadi AI Summit?",
    'Is the Central Library quiet right now?',
    'Take me to the Main Admin Auditorium',
    'Where is the Food Court & Amul Parlour?',
    'Is there an emergency in FOE Block?',
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
              Marwadi University Neural Assistant
            </h2>
            <p className="font-code-telemetry text-xs text-on-surface-variant">
              Spatial Reasoning & Campus Graph • v4.2 MU
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

              {/* Rich Smart Card if present */}
              {msg.smartCard && (
                <div className="mt-2.5 w-full max-w-md p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-secondary-container/40 text-secondary uppercase">
                        {msg.smartCard.badgeText}
                      </span>
                      <h4 className="font-headline-sm text-base font-bold text-on-surface mt-1">
                        {msg.smartCard.title}
                      </h4>
                      <p className="font-body-sm text-xs text-on-surface-variant">
                        {msg.smartCard.destinationDetail}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-code-telemetry text-xs font-bold text-primary block">
                        {msg.smartCard.distance}
                      </span>
                      <span className="font-code-telemetry text-[11px] text-on-surface-variant">
                        ~{msg.smartCard.estWalk}
                      </span>
                    </div>
                  </div>

                  {/* Waypoint Micro HUD */}
                  {msg.smartCard.waypoints && (
                    <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between text-xs font-code-telemetry">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-on-surface-variant truncate">{msg.smartCard.waypoints.origin}</span>
                        <span className="text-secondary font-bold">→</span>
                        <span className="text-primary font-bold truncate">{msg.smartCard.waypoints.via}</span>
                        <span className="text-secondary font-bold">→</span>
                        <span className="text-on-surface font-bold truncate">{msg.smartCard.waypoints.dest}</span>
                      </div>
                    </div>
                  )}

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
                      className="flex-1 py-2 px-3 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:bg-primary/95 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Show 3D Route</span>
                    </button>

                    {msg.smartCard.eventData && (
                      <button
                        onClick={() => {
                          setSelectedEvent(msg.smartCard?.eventData || null);
                          setActiveScreen('events');
                        }}
                        className="py-2 px-3 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors cursor-pointer"
                      >
                        View Event
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* AI Typing Thinking Indicator */}
        {isAiThinking && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-surface-container-low text-on-surface-variant w-fit">
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100"></span>
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200"></span>
            <span className="font-code-telemetry text-xs ml-1">Computing Marwadi University spatial vectors...</span>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Suggestion Prompts Row */}
      <div className="p-space-xs bg-surface-container-low/60 border-t border-surface-container flex items-center gap-2 overflow-x-auto no-scrollbar">
        {promptSuggestions.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-medium border border-surface-container transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Composer Dock */}
      <div className="p-space-sm bg-surface-container-lowest border-t border-surface-container shadow-md">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          {/* Computer Vision Trigger Button */}
          <button
            onClick={() => setIsVisionModalOpen(true)}
            className="w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center flex-shrink-0 active:scale-95 transition-all cursor-pointer"
            title="Scan campus photo or CCTV feed with Computer Vision"
          >
            <Camera className="w-5 h-5 text-secondary" />
          </button>

          {/* Speech / Voice Input Button */}
          <button
            onClick={handleSpeechToggle}
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-95 transition-all cursor-pointer ${
              isListening ? 'bg-error text-white animate-pulse' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
            title="Voice Query"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Text Input Field */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask about Marwadi University buildings, labs, summits, food..."
            className="flex-1 h-10 px-3.5 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 border border-surface-container"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim()}
            className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:pointer-events-none active:scale-95 shadow-xs transition-all cursor-pointer"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
