-- Migration: Create AI Tracker tables
-- Tables: ai_tools, ai_news, rating_history

CREATE TABLE IF NOT EXISTS ai_tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  website TEXT,
  logo_url TEXT,
  quality_score REAL NOT NULL DEFAULT 5.0,
  price_score REAL NOT NULL DEFAULT 5.0,
  ease_of_use_score REAL NOT NULL DEFAULT 5.0,
  popularity_score REAL NOT NULL DEFAULT 5.0,
  total_rating REAL NOT NULL DEFAULT 5.0,
  pricing_model TEXT,
  monthly_price REAL,
  review TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source TEXT,
  url TEXT,
  published_at TEXT,
  related_tool_id TEXT REFERENCES ai_tools(id),
  sentiment TEXT,
  impact_score REAL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rating_history (
  id TEXT PRIMARY KEY,
  tool_id TEXT NOT NULL REFERENCES ai_tools(id),
  previous_rating REAL NOT NULL,
  new_rating REAL NOT NULL,
  delta REAL NOT NULL,
  reason TEXT,
  news_id TEXT REFERENCES ai_news(id),
  created_at TEXT NOT NULL
);

-- Seed data: popular AI tools
INSERT OR IGNORE INTO ai_tools (id, name, category, description, website, quality_score, price_score, ease_of_use_score, popularity_score, total_rating, pricing_model, monthly_price, is_active, created_at, updated_at) VALUES
('chatgpt', 'ChatGPT', 'llm', 'OpenAI''s flagship conversational AI assistant with GPT-4o', 'https://chat.openai.com', 9.2, 7.5, 9.5, 9.8, 8.88, 'freemium', 20.0, 1, datetime('now'), datetime('now')),
('claude', 'Claude', 'llm', 'Anthropic''s AI assistant focused on safety and helpfulness', 'https://claude.ai', 9.0, 7.8, 9.2, 8.5, 8.69, 'freemium', 20.0, 1, datetime('now'), datetime('now')),
('gemini', 'Gemini', 'llm', 'Google''s multimodal AI model integrated across Google products', 'https://gemini.google.com', 8.8, 8.5, 8.8, 8.7, 8.72, 'freemium', 19.99, 1, datetime('now'), datetime('now')),
('midjourney', 'Midjourney', 'image', 'Leading AI image generation tool known for artistic quality', 'https://midjourney.com', 9.5, 6.5, 7.0, 9.0, 8.35, 'paid', 10.0, 1, datetime('now'), datetime('now')),
('dalle3', 'DALL-E 3', 'image', 'OpenAI''s advanced image generation model integrated in ChatGPT', 'https://openai.com/dall-e-3', 8.8, 7.0, 8.5, 8.2, 8.21, 'freemium', 20.0, 1, datetime('now'), datetime('now')),
('copilot', 'GitHub Copilot', 'code', 'AI-powered code completion and generation for developers', 'https://github.com/features/copilot', 9.0, 6.0, 8.5, 9.2, 8.17, 'paid', 10.0, 1, datetime('now'), datetime('now')),
('cursor', 'Cursor', 'code', 'AI-first code editor built on VS Code with advanced AI features', 'https://cursor.sh', 9.2, 7.5, 8.8, 8.0, 8.63, 'freemium', 20.0, 1, datetime('now'), datetime('now')),
('perplexity', 'Perplexity AI', 'llm', 'AI-powered search engine that provides cited answers', 'https://perplexity.ai', 8.5, 8.8, 9.0, 8.3, 8.63, 'freemium', 20.0, 1, datetime('now'), datetime('now')),
('elevenlabs', 'ElevenLabs', 'audio', 'Advanced AI voice synthesis and cloning platform', 'https://elevenlabs.io', 9.3, 6.8, 8.2, 8.5, 8.35, 'freemium', 5.0, 1, datetime('now'), datetime('now')),
('runway', 'Runway ML', 'video', 'AI video generation and editing platform for creators', 'https://runwayml.com', 8.8, 5.5, 7.5, 8.0, 7.67, 'freemium', 15.0, 1, datetime('now'), datetime('now')),
('notion-ai', 'Notion AI', 'productivity', 'AI writing and productivity assistant integrated in Notion', 'https://notion.so/product/ai', 8.0, 7.0, 9.0, 8.5, 8.05, 'paid', 10.0, 1, datetime('now'), datetime('now')),
('grammarly', 'Grammarly', 'productivity', 'AI writing assistant for grammar, style, and tone improvement', 'https://grammarly.com', 8.5, 7.5, 9.5, 9.0, 8.5, 'freemium', 12.0, 1, datetime('now'), datetime('now')),
('stable-diffusion', 'Stable Diffusion', 'image', 'Open-source AI image generation model with wide customization', 'https://stability.ai', 8.5, 9.5, 6.0, 8.8, 8.23, 'free', 0.0, 1, datetime('now'), datetime('now')),
('whisper', 'Whisper', 'audio', 'OpenAI''s open-source speech recognition system', 'https://openai.com/research/whisper', 9.0, 9.5, 7.0, 8.0, 8.55, 'free', 0.0, 1, datetime('now'), datetime('now')),
('grok', 'Grok', 'llm', 'xAI''s conversational AI with real-time X/Twitter data access', 'https://x.ai/grok', 8.2, 7.0, 8.5, 7.5, 7.93, 'freemium', 16.0, 1, datetime('now'), datetime('now'));
