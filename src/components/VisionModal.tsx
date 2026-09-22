/**
 * CampusPilot Computer Vision Hazard Analysis Modal
 * Allows inspection of campus camera feeds or uploaded user photos,
 * detects hazards (fire, crowd, road obstruction), and updates routing graphs in real-time.
 */

import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { SAMPLE_VISION_FEEDS, campusVision } from '../services/visionService';
import { VisionAnalysis } from '../types';
import { Scan, X, Upload, Camera, Video, ShieldAlert } from 'lucide-react';

export const VisionModal: React.FC = () => {
  const { isVisionModalOpen, setIsVisionModalOpen, applyVisionFinding } = useCampus();

  const [selectedFeedId, setSelectedFeedId] = useState<string>(SAMPLE_VISION_FEEDS[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<VisionAnalysis | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  if (!isVisionModalOpen) return null;

  const handleRunAnalysis = async (feedIdOrData: string) => {
    setIsAnalyzing(true);
    try {
      const result = await campusVision.analyzeImage(feedIdOrData);
      setAnalysisResult(result);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setUploadedImagePreview(dataUrl);
        handleRunAnalysis(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyFinding = () => {
    if (analysisResult) {
      applyVisionFinding(analysisResult);
      setIsVisionModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-surface-container animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-secondary-container/30 text-secondary flex items-center justify-center flex-shrink-0">
              <Scan className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
                AI Vision Hazard Analysis
              </h3>
              <p className="font-code-telemetry text-xs text-on-surface-variant">
                Computer Vision Model • Multi-Hazard Detector
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisionModalOpen(false)}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feed Selector Presets */}
        <div className="mb-4">
          <label className="font-label-sm text-xs text-on-surface-variant block mb-1.5 font-bold uppercase tracking-wider">
            Select Live CCTV Feed or Upload Image
          </label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {SAMPLE_VISION_FEEDS.map((feed) => (
              <button
                key={feed.id}
                onClick={() => {
                  setSelectedFeedId(feed.id);
                  setUploadedImagePreview(null);
                  handleRunAnalysis(feed.id);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedFeedId === feed.id && !uploadedImagePreview
                    ? 'border-secondary bg-secondary-container/20 text-on-surface font-semibold'
                    : 'border-surface-container bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                  <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0"></span>
                  <span className="truncate">{feed.name.split('•')[0]}</span>
                </div>
                <span className="text-[11px] text-on-surface-variant truncate block mt-0.5">
                  {feed.location}
                </span>
              </button>
            ))}
          </div>

          {/* User Image Upload or Camera Input */}
          <div className="flex items-center gap-2">
            <label className="flex-1 py-2 px-3 rounded-xl border border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>Upload Campus Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <label className="py-2 px-3 rounded-xl border border-secondary/50 bg-secondary/5 hover:bg-secondary/10 text-secondary font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
              <Camera className="w-4 h-4" />
              <span>Capture Photo</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Image Preview / Simulation Visual */}
        <div className="relative w-full h-44 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center mb-4">
          {uploadedImagePreview ? (
            <img
              src={uploadedImagePreview}
              alt="Uploaded scan"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
              <Video className="w-9 h-9 text-secondary mb-1 opacity-80" />
              <span className="font-code-telemetry text-xs text-slate-300 font-bold">
                CCTV Feed #{selectedFeedId.replace('feed-', '')}
              </span>
              <span className="text-[11px] text-slate-500">
                1080p 30fps Optical Flow Stream
              </span>

              {/* Simulated camera grid overlay */}
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600/80 px-1.5 py-0.5 rounded text-[10px] text-white font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                REC
              </div>
              <div className="absolute bottom-2 right-2 font-code-telemetry text-[10px] text-slate-400">
                AI Vision Ingestion: Active
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white gap-2">
              <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
              <span className="text-xs font-code-telemetry">Analyzing Spatial Vectors...</span>
            </div>
          )}
        </div>

        {/* Analysis Output Result */}
        {analysisResult && (
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="font-headline-sm text-xs font-bold text-on-surface uppercase tracking-wider">
                Detection Result
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  analysisResult.severity === 'danger'
                    ? 'bg-red-500/20 text-red-600'
                    : analysisResult.severity === 'warning'
                    ? 'bg-amber-500/20 text-amber-700'
                    : 'bg-emerald-500/20 text-emerald-700'
                }`}
              >
                {analysisResult.category}
              </span>
            </div>

            <p className="font-headline-sm text-sm sm:text-base font-bold text-on-surface">
              {analysisResult.detection}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-code-telemetry text-on-surface-variant pt-1 border-t border-surface-container">
              <div>
                <span>Confidence:</span>
                <span className="font-bold text-on-surface ml-1">{analysisResult.confidence}%</span>
              </div>
              <div>
                <span>Location:</span>
                <span className="font-bold text-on-surface ml-1 truncate block">
                  {analysisResult.location}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-container text-xs text-on-surface">
              <strong>Recommended Action:</strong> {analysisResult.recommendedAction}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {analysisResult && analysisResult.blockedEdgeIds && (
            <button
              onClick={handleApplyFinding}
              className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Apply Finding & Block Path</span>
            </button>
          )}

          <button
            onClick={() => handleRunAnalysis(selectedFeedId)}
            disabled={isAnalyzing}
            className="py-2.5 px-4 rounded-xl border border-surface-container font-bold text-xs sm:text-sm text-on-surface hover:bg-surface-container cursor-pointer disabled:opacity-50"
          >
            Re-Analyze
          </button>
        </div>
      </div>
    </div>
  );
};
