/**
 * CampusPilot AI Assistant View
 * Minimalist, distraction-free conversational interface for campus guidance.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useCampus } from '../context/CampusContext';
import { campusAI } from '../services/aiService';
import { CAMPUS_BUILDINGS } from '../data/campusData';
import {
  Mic,
  ArrowUp,
  Compass,
  Sparkles,
  Bot,
  User,
  ScanLine,
} from 'lucide-react';

export const AIAssistView: React.FC = () => {
  const {
    chatMessages,
    addChatMessage,
    isAiThinking,
    setIsAiThinking,
    setSelectedBuilding,
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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };
    addChatMessage(userMsg);

    setIsAiThinking(true);

    try {
      const result = await campusAI.processQuery(query);
      setTimeout(() => {
        setIsAiThinking(false);
        addChatMessage(result.message);
      }, 300);
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
      setInputQuery('Take me to the MU Central Digital Library');
    }
  };

  const promptSuggestions = [
    "Where is today's Marwadi AI Summit?",
    'Is the Central Library quiet right now?',
    'Take me to Food Court & Amul',
    'Where is the Apple iOS lab in FOE?',
  ];

  return (
    <div className="relative w-full h-full flex flex-col bg-[#090d15] text-slate-100 select-none overflow-hidden">
      {/* Quiet Subheader */}
      <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-sky-400" />
          <span className="font-medium text-slate-200">Campus Intelligence Assistant</span>
        </div>
        <button
          onClick={() => setIsVisionModalOpen(true)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ScanLine className="w-3.5 h-3.5 text-sky-400" />
          <span>Vision Inspector</span>
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-3xl mx-auto w-full pb-36">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                  isUser
                    ? 'bg-sky-500 text-slate-950'
                    : 'bg-[#0e1320] text-sky-400 border border-white/[0.08]'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className={`space-y-2 max-w-[85%] sm:max-w-lg ${isUser ? 'items-end' : ''}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-sky-600 text-white rounded-tr-xs'
                      : 'bg-[#0e1320] border border-white/[0.06] text-slate-200 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Smart Card Attached to AI Message */}
                {msg.smartCard && (
                  <div className="p-3.5 rounded-xl bg-[#0e1320] border border-white/[0.08] space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-sky-400">
                        {msg.smartCard.badgeText || 'Spatial Route'}
                      </span>
                      <span>{msg.smartCard.distance} · {msg.smartCard.estWalk}</span>
                    </div>

                    <div className="font-semibold text-white text-sm">
                      {msg.smartCard.title}
                    </div>

                    <div className="text-xs text-slate-400">
                      {msg.smartCard.destinationName} · {msg.smartCard.destinationDetail}
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (msg.smartCard?.buildingId) {
                            const b = CAMPUS_BUILDINGS.find(
                              (bldg) => bldg.id === msg.smartCard?.buildingId
                            );
                            if (b) setSelectedBuilding(b);
                          }
                          setActiveScreen('map');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Show on 3D Map</span>
                      </button>
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] text-slate-500 px-1 ${
                    isUser ? 'text-right' : 'text-left'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isAiThinking && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
            <span>Analyzing campus map...</span>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input Dock */}
      <div className="absolute bottom-14 md:bottom-0 inset-x-0 p-3 sm:p-4 bg-[#090d15]/90 backdrop-blur-md border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto space-y-2">
          {/* Quick suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
            {promptSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="shrink-0 px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 border border-white/[0.06] transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Form input */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything about campus buildings, labs, venues, directions..."
              className="w-full h-11 pl-4 pr-20 rounded-xl bg-[#0e1320] border border-white/[0.08] text-slate-100 placeholder:text-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-sky-500"
            />

            <div className="absolute right-2 flex items-center gap-1">
              <button
                onClick={handleSpeechToggle}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
                title="Voice Input"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleSend()}
                disabled={!inputQuery.trim()}
                className="p-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-30 text-slate-950 transition-colors cursor-pointer font-bold"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
