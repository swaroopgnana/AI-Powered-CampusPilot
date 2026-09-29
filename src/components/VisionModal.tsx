/**
 * CampusPilot Computer Vision Hazard Analysis Modal
 * Clean, quiet inspection modal for optical flow & image uploads.
 */

import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { SAMPLE_VISION_FEEDS, campusVision } from '../services/visionService';
import { VisionAnalysis } from '../types';
import { ScanLine, X, Upload, Camera, Video, ShieldAlert } from 'lucide-react';

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
      <div className="bg-[#0e1320] border border-white/[0.1] rounded-2xl max-w-lg w-full p-5 shadow-2xl animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <ScanLine className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Vision Hazard Inspection
              </h3>
              <p className="text-xs text-slate-400">
                Spatial inspection of camera feeds & uploads
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisionModalOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feed Selector */}
        <div className="space-y-2">
          <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Select Camera Feed or Upload
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_VISION_FEEDS.map((feed) => (
              <button
                key={feed.id}
                onClick={() => {
                  setSelectedFeedId(feed.id);
                  setUploadedImagePreview(null);
                  handleRunAnalysis(feed.id);
                }}
                className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                  selectedFeedId === feed.id && !uploadedImagePreview
                    ? 'border-sky-500/40 bg-sky-500/10 text-white'
                    : 'border-white/[0.06] bg-black/30 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-medium truncate">
                  {feed.name.split('•')[0]}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {feed.location}
                </div>
              </button>
            ))}
          </div>

          {/* User Image Upload or Camera Input */}
          <div className="flex items-center gap-2 pt-1">
            <label className="flex-1 py-2 px-3 rounded-lg border border-dashed border-white/[0.12] hover:border-sky-500/50 bg-black/20 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <label className="py-2 px-3 rounded-lg border border-white/[0.08] hover:border-sky-500/50 bg-black/20 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
              <Camera className="w-3.5 h-3.5 text-sky-400" />
              <span>Capture</span>
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

        {/* Video / Image Display */}
        <div className="relative w-full h-40 rounded-xl bg-black/50 border border-white/[0.06] overflow-hidden flex items-center justify-center">
          {uploadedImagePreview ? (
            <img
              src={uploadedImagePreview}
              alt="Uploaded scan"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
              <Video className="w-6 h-6 text-sky-400 mb-1 opacity-70" />
              <div className="text-xs text-slate-300 font-mono">
                CCTV Feed #{selectedFeedId.replace('feed-', '')}
              </div>
              <div className="text-[11px] text-slate-500">
                1080p Optical Stream
              </div>

              <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600/80 px-1.5 py-0.5 rounded text-[10px] text-white font-medium">
                LIVE
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white gap-2">
              <span className="w-6 h-6 rounded-full border-2 border-sky-400 border-t-transparent animate-spin"></span>
              <span className="text-xs font-mono text-sky-300">Processing visual frames...</span>
            </div>
          )}
        </div>

        {/* Analysis Output Result */}
        {analysisResult && (
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Detection Result
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  analysisResult.severity === 'danger'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : analysisResult.severity === 'warning'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {analysisResult.category}
              </span>
            </div>

            <div className="text-xs font-semibold text-white">
              {analysisResult.detection}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-white/[0.04]">
              <div>
                <span>Confidence:</span>
                <span className="font-semibold text-white ml-1 font-mono">{analysisResult.confidence}%</span>
              </div>
              <div>
                <span>Location:</span>
                <span className="font-semibold text-white ml-1 truncate block">
                  {analysisResult.location}
                </span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-[#0e1320] text-xs text-slate-300 border border-white/[0.04]">
              <strong className="text-sky-400">Action:</strong> {analysisResult.recommendedAction}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center gap-2 pt-1">
          {analysisResult && analysisResult.blockedEdgeIds && (
            <button
              onClick={handleApplyFinding}
              className="flex-1 py-2 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Apply Finding & Reroute Map</span>
            </button>
          )}

          <button
            onClick={() => handleRunAnalysis(selectedFeedId)}
            disabled={isAnalyzing}
            className="py-2 px-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-medium cursor-pointer disabled:opacity-50 transition-colors"
          >
            Re-Analyze
          </button>
        </div>
      </div>
    </div>
  );
};
