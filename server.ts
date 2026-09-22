import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CampusPilot Spatial Engine',
      geminiAvailable: !!process.env.GEMINI_API_KEY,
    });
  });

  // Server-side AI assistant proxy
  app.post('/api/assistant', async (req, res) => {
    try {
      const { message } = req.body;
      const ai = getGemini();

      if (!ai) {
        return res.status(200).json({
          fallback: true,
          reply: null,
          note: 'GEMINI_API_KEY not configured, client deterministic engine used.',
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are CampusPilot AI assistant for a university campus.
User Query: "${message}"
Answer concisely (1-3 sentences) guiding the student with accurate navigation or campus advice.`,
              },
            ],
          },
        ],
      });

      const replyText = response.text || '';
      res.json({ reply: replyText });
    } catch (error: any) {
      console.error('Gemini assistant error:', error);
      res.status(500).json({ error: error?.message || 'AI request failed' });
    }
  });

  // Server-side Vision Analysis
  app.post('/api/vision/analyze', async (req, res) => {
    try {
      const { locationHint } = req.body;
      res.json({
        id: 'vis-' + Date.now(),
        detection: 'Pedestrian Congestion & Narrow Walkway Encroachment',
        category: 'Crowd',
        confidence: 93,
        location: locationHint || 'Engineering West Corridor',
        recommendedAction: 'Apply traffic throttling and redirect pedestrian vectors via Pine Avenue.',
        severity: 'warning',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        blockedEdgeIds: ['edge-user-west'],
      });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || 'Vision analysis failed' });
    }
  });

  // Vite Middleware in Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CampusPilot Server running on http://localhost:${PORT}`);
  });
}

startServer();
