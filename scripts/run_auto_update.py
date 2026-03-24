#!/usr/bin/env python3
"""
scripts/run_auto_update.py

Python-реализация логики runAutomatedUpdate() из server/auto-update.ts.
Выполняет полный цикл обновления рейтингов ИИ-инструментов:
  1. Сбор новостей через LLM (12-15 статей)
  2. Анализ влияния новостей на рейтинги
  3. Обновление рейтингов по формуле: Quality(40%) + Price(30%) + EaseOfUse(20%) + Popularity(10%)
  4. Сохранение истории изменений
  5. Генерация обзоров для топ-5 инструментов

Использует SQLite для локального хранения данных.
"""

import sqlite3
import json
import os
import uuid
import time
from datetime import datetime
from openai import OpenAI

# ─── Конфигурация ─────────────────────────────────────────────────────────────

DB_PATH = "/home/ubuntu/ai-tracker/ai_tracker.db"
LOG_PATH = "/home/ubuntu/ai-tracker/auto_update.log"

client = OpenAI()  # Использует OPENAI_API_KEY из окружения

# ─── Вспомогательные функции ──────────────────────────────────────────────────

def log(msg: str):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {msg}"
    print(line)
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def generate_id() -> str:
    return str(uuid.uuid4())[:18].replace("-", "")

def clamp_score(value: float) -> float:
    return round(min(10.0, max(0.0, value)), 2)

def compute_total_rating(quality: float, price: float, ease: float, popularity: float) -> float:
    raw = quality * 0.4 + price * 0.3 + ease * 0.2 + popularity * 0.1
    return round(min(10.0, max(0.0, raw)), 2)

def call_llm_json(prompt: str, model: str = "gpt-4.1-mini") -> dict:
    """Вызов LLM с JSON-ответом."""
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.7,
    )
    return json.loads(response.choices[0].message.content)

# ─── Инициализация БД ─────────────────────────────────────────────────────────

def init_db(conn: sqlite3.Connection):
    """Создание таблиц и заполнение начальными данными."""
    cursor = conn.cursor()

    cursor.executescript("""
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
    """)

    # Seed данные — популярные ИИ-инструменты
    tools_seed = [
        ("chatgpt", "ChatGPT", "llm", "OpenAI's flagship conversational AI assistant with GPT-4o", "https://chat.openai.com", 9.2, 7.5, 9.5, 9.8, "freemium", 20.0),
        ("claude", "Claude", "llm", "Anthropic's AI assistant focused on safety and helpfulness", "https://claude.ai", 9.0, 7.8, 9.2, 8.5, "freemium", 20.0),
        ("gemini", "Gemini", "llm", "Google's multimodal AI model integrated across Google products", "https://gemini.google.com", 8.8, 8.5, 8.8, 8.7, "freemium", 19.99),
        ("midjourney", "Midjourney", "image", "Leading AI image generation tool known for artistic quality", "https://midjourney.com", 9.5, 6.5, 7.0, 9.0, "paid", 10.0),
        ("dalle3", "DALL-E 3", "image", "OpenAI's advanced image generation model integrated in ChatGPT", "https://openai.com/dall-e-3", 8.8, 7.0, 8.5, 8.2, "freemium", 20.0),
        ("copilot", "GitHub Copilot", "code", "AI-powered code completion and generation for developers", "https://github.com/features/copilot", 9.0, 6.0, 8.5, 9.2, "paid", 10.0),
        ("cursor", "Cursor", "code", "AI-first code editor built on VS Code with advanced AI features", "https://cursor.sh", 9.2, 7.5, 8.8, 8.0, "freemium", 20.0),
        ("perplexity", "Perplexity AI", "llm", "AI-powered search engine that provides cited answers", "https://perplexity.ai", 8.5, 8.8, 9.0, 8.3, "freemium", 20.0),
        ("elevenlabs", "ElevenLabs", "audio", "Advanced AI voice synthesis and cloning platform", "https://elevenlabs.io", 9.3, 6.8, 8.2, 8.5, "freemium", 5.0),
        ("runway", "Runway ML", "video", "AI video generation and editing platform for creators", "https://runwayml.com", 8.8, 5.5, 7.5, 8.0, "freemium", 15.0),
        ("notion-ai", "Notion AI", "productivity", "AI writing and productivity assistant integrated in Notion", "https://notion.so/product/ai", 8.0, 7.0, 9.0, 8.5, "paid", 10.0),
        ("grammarly", "Grammarly", "productivity", "AI writing assistant for grammar, style, and tone improvement", "https://grammarly.com", 8.5, 7.5, 9.5, 9.0, "freemium", 12.0),
        ("stable-diffusion", "Stable Diffusion", "image", "Open-source AI image generation model with wide customization", "https://stability.ai", 8.5, 9.5, 6.0, 8.8, "free", 0.0),
        ("whisper", "Whisper", "audio", "OpenAI's open-source speech recognition system", "https://openai.com/research/whisper", 9.0, 9.5, 7.0, 8.0, "free", 0.0),
        ("grok", "Grok", "llm", "xAI's conversational AI with real-time X/Twitter data access", "https://x.ai/grok", 8.2, 7.0, 8.5, 7.5, "freemium", 16.0),
    ]

    now = datetime.now().isoformat()
    for tool in tools_seed:
        tid, name, cat, desc, web, q, p, e, pop, pricing, price = tool
        total = compute_total_rating(q, p, e, pop)
        cursor.execute("""
            INSERT OR IGNORE INTO ai_tools
            (id, name, category, description, website, quality_score, price_score,
             ease_of_use_score, popularity_score, total_rating, pricing_model, monthly_price,
             is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
        """, (tid, name, cat, desc, web, q, p, e, pop, total, pricing, price, now, now))

    conn.commit()
    log(f"Database initialized at {DB_PATH}")

# ─── Шаг 1: Сбор новостей ─────────────────────────────────────────────────────

def collect_news(conn: sqlite3.Connection, tools: list) -> list:
    """Сбор 12-15 новостей об ИИ-инструментах через LLM."""
    log("Step 1: Collecting AI news via LLM...")

    tool_names = ", ".join([t["name"] for t in tools])

    prompt = f"""You are an AI industry analyst. Generate 13 realistic recent news articles about AI tools.
The tools being tracked are: {tool_names}.

Return a JSON object with key "articles" containing an array of objects, each with:
- "title": compelling news headline (string)
- "summary": 2-3 sentence summary (string)
- "source": realistic source like TechCrunch, VentureBeat, The Verge, Wired, etc. (string)
- "relatedTool": exact tool name from the list (string)
- "sentiment": one of "positive", "negative", "neutral" (string)
- "impactScore": float from -1.0 to +1.0 (number)

Focus on: new model releases, pricing changes, performance benchmarks, user adoption,
enterprise deals, controversies, API updates, competitive landscape shifts.
Make the news realistic, varied, and current (March 2026).
Cover different tools - don't repeat the same tool more than 2 times."""

    result = call_llm_json(prompt)
    articles = result.get("articles", [])
    log(f"  Collected {len(articles)} news articles")

    # Сохранение в БД
    now = datetime.now().isoformat()
    cursor = conn.cursor()
    saved_news = []

    for article in articles:
        # Найти связанный инструмент
        related_tool_id = None
        for tool in tools:
            if tool["name"].lower() == article.get("relatedTool", "").lower():
                related_tool_id = tool["id"]
                break

        news_id = generate_id()
        cursor.execute("""
            INSERT INTO ai_news (id, title, summary, source, published_at, related_tool_id, sentiment, impact_score, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            news_id,
            article.get("title", ""),
            article.get("summary", ""),
            article.get("source", ""),
            now,
            related_tool_id,
            article.get("sentiment", "neutral"),
            float(article.get("impactScore", 0)),
            now,
        ))
        article["id"] = news_id
        article["related_tool_id"] = related_tool_id
        saved_news.append(article)
        log(f"  [{article.get('sentiment', 'neutral').upper()}] {article.get('relatedTool', '?')}: {article.get('title', '')[:60]}...")

    conn.commit()
    return saved_news

# ─── Шаг 2: Анализ влияния на рейтинги ───────────────────────────────────────

def analyze_rating_impact(tools: list, news: list) -> list:
    """Анализ влияния новостей на рейтинги инструментов."""
    log("Step 2: Analyzing news impact on ratings...")

    tools_context = "\n".join([
        f"{t['id']}: {t['name']} (quality={t['quality_score']}, price={t['price_score']}, "
        f"ease={t['ease_of_use_score']}, popularity={t['popularity_score']}, total={t['total_rating']})"
        for t in tools
    ])

    news_context = "\n".join([
        f"- [{n.get('sentiment', 'neutral').upper()}, impact={n.get('impactScore', 0)}] "
        f"{n.get('relatedTool', '?')}: {n.get('title', '')}"
        for n in news
    ])

    prompt = f"""You are an AI tool rating analyst. Based on recent news, adjust the ratings for AI tools.

CURRENT TOOLS AND RATINGS:
{tools_context}

RECENT NEWS:
{news_context}

Return a JSON object with key "adjustments" containing an array of objects, each with:
- "toolId": tool ID from the list above (string)
- "qualityDelta": float -2.0 to +2.0 (number)
- "priceDelta": float -2.0 to +2.0 (number)
- "easeOfUseDelta": float -2.0 to +2.0 (number)
- "popularityDelta": float -2.0 to +2.0 (number)
- "reason": concise explanation (string)

Rating formula: totalRating = quality*0.4 + price*0.3 + easeOfUse*0.2 + popularity*0.1
All scores are 0-10. Deltas should be small and justified by news.

Rules:
- Positive news (new features, price cuts, performance wins) → positive deltas
- Negative news (outages, price hikes, controversies) → negative deltas
- Only adjust tools that have relevant news
- Keep adjustments realistic (most deltas should be 0.1-0.5)"""

    result = call_llm_json(prompt)
    adjustments = result.get("adjustments", [])
    log(f"  Generated {len(adjustments)} rating adjustments")
    return adjustments

# ─── Шаг 3: Применение обновлений ────────────────────────────────────────────

def apply_rating_updates(conn: sqlite3.Connection, tools: list, adjustments: list) -> int:
    """Применение обновлений рейтингов и сохранение истории."""
    log("Step 3: Applying rating updates...")

    cursor = conn.cursor()
    tools_updated = 0
    now = datetime.now().isoformat()

    for adj in adjustments:
        tool_id = adj.get("toolId", "")
        tool = next((t for t in tools if t["id"] == tool_id), None)
        if not tool:
            log(f"  WARNING: Tool not found: {tool_id}")
            continue

        new_quality = clamp_score(tool["quality_score"] + float(adj.get("qualityDelta", 0)))
        new_price = clamp_score(tool["price_score"] + float(adj.get("priceDelta", 0)))
        new_ease = clamp_score(tool["ease_of_use_score"] + float(adj.get("easeOfUseDelta", 0)))
        new_popularity = clamp_score(tool["popularity_score"] + float(adj.get("popularityDelta", 0)))
        new_total = compute_total_rating(new_quality, new_price, new_ease, new_popularity)
        delta = round(new_total - tool["total_rating"], 2)

        # Обновляем инструмент
        cursor.execute("""
            UPDATE ai_tools
            SET quality_score=?, price_score=?, ease_of_use_score=?, popularity_score=?,
                total_rating=?, updated_at=?
            WHERE id=?
        """, (new_quality, new_price, new_ease, new_popularity, new_total, now, tool_id))

        # Сохраняем историю
        cursor.execute("""
            INSERT INTO rating_history (id, tool_id, previous_rating, new_rating, delta, reason, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (generate_id(), tool_id, tool["total_rating"], new_total, delta, adj.get("reason", ""), now))

        sign = "+" if delta >= 0 else ""
        log(f"  {tool['name']}: {tool['total_rating']} → {new_total} ({sign}{delta}) | {adj.get('reason', '')[:60]}")
        tools_updated += 1

    conn.commit()
    return tools_updated

# ─── Шаг 4: Генерация обзоров для топ-5 ──────────────────────────────────────

def generate_top5_reviews(conn: sqlite3.Connection) -> int:
    """Генерация обзоров для топ-5 инструментов по рейтингу."""
    log("Step 4: Generating reviews for top-5 tools...")

    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, name, category, quality_score, price_score, ease_of_use_score,
               popularity_score, total_rating, pricing_model
        FROM ai_tools WHERE is_active=1
        ORDER BY total_rating DESC LIMIT 5
    """)
    top5 = cursor.fetchall()
    reviews_generated = 0
    now = datetime.now().isoformat()

    for tool in top5:
        tid, name, cat, q, p, e, pop, total, pricing = tool

        prompt = f"""Write a concise professional review (3-4 sentences) for the AI tool "{name}".
Category: {cat}
Ratings: Quality={q}/10, Price={p}/10, Ease of Use={e}/10, Popularity={pop}/10
Overall: {total}/10
Pricing model: {pricing or 'unknown'}

Return JSON: {{"review": "your review text here"}}

The review should highlight strengths, mention pricing, and be suitable for a professional AI tools directory."""

        result = call_llm_json(prompt)
        review_text = result.get("review", "")

        cursor.execute("UPDATE ai_tools SET review=?, updated_at=? WHERE id=?", (review_text, now, tid))
        log(f"  Review for {name}: {review_text[:80]}...")
        reviews_generated += 1

    conn.commit()
    return reviews_generated

# ─── Главная функция ──────────────────────────────────────────────────────────

def run_automated_update():
    """Главная функция — полный цикл автоматического обновления."""
    start_time = time.time()
    log("=" * 60)
    log("STARTING AUTOMATED AI TRACKER UPDATE")
    log(f"Timestamp: {datetime.now().isoformat()}")
    log("=" * 60)

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    try:
        # Инициализация БД
        init_db(conn)

        # Получаем список активных инструментов
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, name, category, description, quality_score, price_score,
                   ease_of_use_score, popularity_score, total_rating, pricing_model
            FROM ai_tools WHERE is_active=1
        """)
        tools = [dict(row) for row in cursor.fetchall()]
        log(f"Found {len(tools)} active AI tools")

        # Шаг 1: Сбор новостей
        news = collect_news(conn, tools)

        # Шаг 2: Анализ влияния на рейтинги
        adjustments = analyze_rating_impact(tools, news)

        # Шаг 3: Применение обновлений
        tools_updated = apply_rating_updates(conn, tools, adjustments)

        # Шаг 4: Генерация обзоров для топ-5
        reviews_generated = generate_top5_reviews(conn)

        duration = round(time.time() - start_time, 2)

        # ── Итоговый отчёт ────────────────────────────────────────────────────
        log("=" * 60)
        log("UPDATE COMPLETED SUCCESSFULLY")
        log(f"  News collected:    {len(news)}")
        log(f"  Tools updated:     {tools_updated}")
        log(f"  Reviews generated: {reviews_generated}")
        log(f"  Duration:          {duration}s")
        log("=" * 60)

        # Финальный рейтинг-лист
        cursor.execute("""
            SELECT name, category, total_rating, quality_score, price_score,
                   ease_of_use_score, popularity_score
            FROM ai_tools WHERE is_active=1
            ORDER BY total_rating DESC
        """)
        final_tools = cursor.fetchall()

        log("\nFINAL RATINGS LEADERBOARD:")
        log(f"{'#':<3} {'Tool':<20} {'Cat':<12} {'Total':>6} {'Quality':>8} {'Price':>7} {'Ease':>6} {'Pop':>5}")
        log("-" * 75)
        for i, t in enumerate(final_tools, 1):
            log(f"{i:<3} {t['name']:<20} {t['category']:<12} {t['total_rating']:>6.2f} "
                f"{t['quality_score']:>8.2f} {t['price_score']:>7.2f} "
                f"{t['ease_of_use_score']:>6.2f} {t['popularity_score']:>5.2f}")

        # Последние новости
        cursor.execute("""
            SELECT n.title, n.sentiment, n.impact_score, t.name as tool_name
            FROM ai_news n
            LEFT JOIN ai_tools t ON n.related_tool_id = t.id
            ORDER BY n.created_at DESC LIMIT 13
        """)
        recent_news = cursor.fetchall()

        log("\nRECENT NEWS COLLECTED:")
        for n in recent_news:
            sign = "+" if n["impact_score"] >= 0 else ""
            log(f"  [{n['sentiment'].upper():8}] {n['tool_name'] or 'N/A':<20} {sign}{n['impact_score']:.2f} | {n['title'][:55]}")

        # История изменений
        cursor.execute("""
            SELECT h.delta, h.previous_rating, h.new_rating, h.reason, t.name
            FROM rating_history h
            JOIN ai_tools t ON h.tool_id = t.id
            ORDER BY h.created_at DESC LIMIT 15
        """)
        history = cursor.fetchall()

        log("\nRATING HISTORY (latest changes):")
        for h in history:
            sign = "+" if h["delta"] >= 0 else ""
            log(f"  {h['name']:<20} {h['previous_rating']:.2f} → {h['new_rating']:.2f} ({sign}{h['delta']:.2f}) | {h['reason'][:50]}")

        return {
            "success": True,
            "newsCollected": len(news),
            "toolsUpdated": tools_updated,
            "reviewsGenerated": reviews_generated,
            "duration": duration,
            "timestamp": datetime.now().isoformat(),
        }

    except Exception as e:
        log(f"ERROR: {e}")
        import traceback
        log(traceback.format_exc())
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


if __name__ == "__main__":
    result = run_automated_update()
    print("\n" + json.dumps(result, indent=2))
