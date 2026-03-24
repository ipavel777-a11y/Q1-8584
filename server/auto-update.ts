/**
 * server/auto-update.ts
 *
 * Автоматическое обновление рейтингов ИИ-инструментов.
 * Запускается по расписанию (среды и субботы в 00:00 UTC)
 * или вручную через API: POST /api/auto-update/trigger
 *
 * Формула рейтинга:
 *   totalRating = Quality×0.4 + Price×0.3 + EaseOfUse×0.2 + Popularity×0.1
 */

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { aiTools, aiNews, ratingHistory } from "../src/api/database/schema";

// ─── Типы ────────────────────────────────────────────────────────────────────

export interface UpdateResult {
  success: boolean;
  newsCollected: number;
  toolsUpdated: number;
  reviewsGenerated: number;
  errors: string[];
  duration: number;
  timestamp: string;
}

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  relatedTool: string;
  sentiment: "positive" | "negative" | "neutral";
  impactScore: number;
}

interface RatingAdjustment {
  toolId: string;
  qualityDelta: number;
  priceDelta: number;
  easeOfUseDelta: number;
  popularityDelta: number;
  reason: string;
}

// ─── Вспомогательные функции ─────────────────────────────────────────────────

function computeTotalRating(
  quality: number,
  price: number,
  easeOfUse: number,
  popularity: number
): number {
  const raw = quality * 0.4 + price * 0.3 + easeOfUse * 0.2 + popularity * 0.1;
  return Math.round(Math.min(10, Math.max(0, raw)) * 100) / 100;
}

function clampScore(value: number): number {
  return Math.round(Math.min(10, Math.max(0, value)) * 100) / 100;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Основная функция ─────────────────────────────────────────────────────────

export async function runAutomatedUpdate(
  db: D1Database,
  openaiApiKey: string
): Promise<UpdateResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  let newsCollected = 0;
  let toolsUpdated = 0;
  let reviewsGenerated = 0;

  console.log("[AutoUpdate] Starting automated update process...");

  const orm = drizzle(db);
  const openai = createOpenAI({ apiKey: openaiApiKey });

  // ── Шаг 1: Получить список всех активных инструментов ─────────────────────
  const tools = await orm.select().from(aiTools).where(eq(aiTools.isActive, true));
  console.log(`[AutoUpdate] Found ${tools.length} active AI tools`);

  if (tools.length === 0) {
    return {
      success: false,
      newsCollected: 0,
      toolsUpdated: 0,
      reviewsGenerated: 0,
      errors: ["No active AI tools found in database"],
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }

  const toolNames = tools.map((t) => t.name).join(", ");

  // ── Шаг 2: Сбор новостей через LLM ───────────────────────────────────────
  console.log("[AutoUpdate] Step 2: Collecting AI news via LLM...");
  let collectedNews: NewsItem[] = [];

  try {
    const newsSchema = z.object({
      articles: z.array(
        z.object({
          title: z.string(),
          summary: z.string(),
          source: z.string(),
          relatedTool: z.string(),
          sentiment: z.enum(["positive", "negative", "neutral"]),
          impactScore: z.number().min(-1).max(1),
        })
      ),
    });

    const { object: newsResult } = await generateObject({
      model: openai("gpt-4.1-mini"),
      schema: newsSchema,
      prompt: `You are an AI industry analyst. Generate 12 realistic recent news articles about AI tools.
The tools being tracked are: ${toolNames}.

For each article provide:
- title: compelling news headline
- summary: 2-3 sentence summary of the news
- source: realistic source (TechCrunch, VentureBeat, The Verge, Wired, ArsTechnica, etc.)
- relatedTool: which tool from the list this news is about (use exact tool name)
- sentiment: 'positive', 'negative', or 'neutral'
- impactScore: float from -1.0 (very negative impact on tool rating) to +1.0 (very positive)

Focus on: new model releases, pricing changes, performance benchmarks, user adoption, 
enterprise deals, controversies, API updates, and competitive landscape shifts.
Make the news realistic and varied across different tools.`,
    });

    collectedNews = newsResult.articles;
    newsCollected = collectedNews.length;
    console.log(`[AutoUpdate] Collected ${newsCollected} news articles`);

    // Сохраняем новости в БД
    for (const article of collectedNews) {
      const relatedTool = tools.find(
        (t) => t.name.toLowerCase() === article.relatedTool.toLowerCase()
      );
      await orm.insert(aiNews).values({
        id: generateId(),
        title: article.title,
        summary: article.summary,
        source: article.source,
        publishedAt: new Date().toISOString(),
        relatedToolId: relatedTool?.id ?? null,
        sentiment: article.sentiment,
        impactScore: article.impactScore,
      });
    }
  } catch (err) {
    const msg = `News collection failed: ${err instanceof Error ? err.message : String(err)}`;
    errors.push(msg);
    console.error(`[AutoUpdate] ${msg}`);
  }

  // ── Шаг 3: Анализ влияния новостей на рейтинги ───────────────────────────
  console.log("[AutoUpdate] Step 3: Analyzing news impact on ratings...");
  let adjustments: RatingAdjustment[] = [];

  try {
    const adjustmentSchema = z.object({
      adjustments: z.array(
        z.object({
          toolId: z.string(),
          qualityDelta: z.number().min(-2).max(2),
          priceDelta: z.number().min(-2).max(2),
          easeOfUseDelta: z.number().min(-2).max(2),
          popularityDelta: z.number().min(-2).max(2),
          reason: z.string(),
        })
      ),
    });

    const toolsContext = tools
      .map(
        (t) =>
          `${t.id}: ${t.name} (quality=${t.qualityScore}, price=${t.priceScore}, ease=${t.easeOfUseScore}, popularity=${t.popularityScore}, total=${t.totalRating})`
      )
      .join("\n");

    const newsContext = collectedNews
      .map(
        (n) =>
          `- [${n.sentiment.toUpperCase()}, impact=${n.impactScore}] ${n.relatedTool}: ${n.title}`
      )
      .join("\n");

    const { object: adjustmentResult } = await generateObject({
      model: openai("gpt-4.1-mini"),
      schema: adjustmentSchema,
      prompt: `You are an AI tool rating analyst. Based on recent news, adjust the ratings for AI tools.

CURRENT TOOLS AND RATINGS:
${toolsContext}

RECENT NEWS:
${newsContext}

For each tool that has relevant news, provide rating adjustments.
Rating formula: totalRating = quality×0.4 + price×0.3 + easeOfUse×0.2 + popularity×0.1
All scores are 0-10. Deltas should be small (-2 to +2) and justified by news.

Rules:
- Positive news (new features, price cuts, performance wins) → positive deltas
- Negative news (outages, price hikes, controversies) → negative deltas  
- Only adjust tools that have relevant news
- Provide a concise reason for each adjustment`,
    });

    adjustments = adjustmentResult.adjustments;
    console.log(`[AutoUpdate] Generated ${adjustments.length} rating adjustments`);
  } catch (err) {
    const msg = `Rating analysis failed: ${err instanceof Error ? err.message : String(err)}`;
    errors.push(msg);
    console.error(`[AutoUpdate] ${msg}`);
  }

  // ── Шаг 4: Применение обновлений рейтингов ───────────────────────────────
  console.log("[AutoUpdate] Step 4: Applying rating updates...");

  for (const adjustment of adjustments) {
    const tool = tools.find((t) => t.id === adjustment.toolId);
    if (!tool) {
      console.warn(`[AutoUpdate] Tool not found: ${adjustment.toolId}`);
      continue;
    }

    const newQuality = clampScore(tool.qualityScore + adjustment.qualityDelta);
    const newPrice = clampScore(tool.priceScore + adjustment.priceDelta);
    const newEaseOfUse = clampScore(tool.easeOfUseScore + adjustment.easeOfUseDelta);
    const newPopularity = clampScore(tool.popularityScore + adjustment.popularityDelta);
    const newTotal = computeTotalRating(newQuality, newPrice, newEaseOfUse, newPopularity);

    try {
      // Обновляем инструмент
      await orm
        .update(aiTools)
        .set({
          qualityScore: newQuality,
          priceScore: newPrice,
          easeOfUseScore: newEaseOfUse,
          popularityScore: newPopularity,
          totalRating: newTotal,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(aiTools.id, tool.id));

      // Сохраняем историю
      await orm.insert(ratingHistory).values({
        id: generateId(),
        toolId: tool.id,
        previousRating: tool.totalRating,
        newRating: newTotal,
        delta: Math.round((newTotal - tool.totalRating) * 100) / 100,
        reason: adjustment.reason,
      });

      toolsUpdated++;
      console.log(
        `[AutoUpdate] Updated ${tool.name}: ${tool.totalRating} → ${newTotal} (Δ${(newTotal - tool.totalRating).toFixed(2)})`
      );
    } catch (err) {
      const msg = `Failed to update tool ${tool.name}: ${err instanceof Error ? err.message : String(err)}`;
      errors.push(msg);
      console.error(`[AutoUpdate] ${msg}`);
    }
  }

  // ── Шаг 5: Генерация обзоров для топ-5 инструментов ─────────────────────
  console.log("[AutoUpdate] Step 5: Generating reviews for top-5 tools...");

  // Получаем обновлённые данные и сортируем по рейтингу
  const updatedTools = await orm.select().from(aiTools).where(eq(aiTools.isActive, true));
  const top5 = updatedTools
    .sort((a, b) => b.totalRating - a.totalRating)
    .slice(0, 5);

  for (const tool of top5) {
    try {
      const reviewSchema = z.object({
        review: z.string(),
      });

      const { object: reviewResult } = await generateObject({
        model: openai("gpt-4.1-mini"),
        schema: reviewSchema,
        prompt: `Write a concise professional review (3-4 sentences) for the AI tool "${tool.name}".
Category: ${tool.category}
Current ratings: Quality=${tool.qualityScore}/10, Price=${tool.priceScore}/10, Ease of Use=${tool.easeOfUseScore}/10, Popularity=${tool.popularityScore}/10
Overall rating: ${tool.totalRating}/10

The review should highlight strengths, mention the pricing model (${tool.pricingModel ?? "unknown"}), 
and be suitable for a professional AI tools directory. Write in English.`,
      });

      await orm
        .update(aiTools)
        .set({ review: reviewResult.review, updatedAt: new Date().toISOString() })
        .where(eq(aiTools.id, tool.id));

      reviewsGenerated++;
      console.log(`[AutoUpdate] Generated review for ${tool.name}`);
    } catch (err) {
      const msg = `Review generation failed for ${tool.name}: ${err instanceof Error ? err.message : String(err)}`;
      errors.push(msg);
      console.error(`[AutoUpdate] ${msg}`);
    }
  }

  const duration = Date.now() - startTime;
  console.log(
    `[AutoUpdate] Completed in ${duration}ms. News: ${newsCollected}, Tools updated: ${toolsUpdated}, Reviews: ${reviewsGenerated}, Errors: ${errors.length}`
  );

  return {
    success: errors.length === 0,
    newsCollected,
    toolsUpdated,
    reviewsGenerated,
    errors,
    duration,
    timestamp: new Date().toISOString(),
  };
}
