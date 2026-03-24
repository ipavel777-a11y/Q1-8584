import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

/**
 * AI Tools - основная таблица инструментов с рейтингами
 * Рейтинг = Quality (40%) + Price (30%) + Ease of Use (20%) + Popularity (10%)
 */
export const aiTools = sqliteTable("ai_tools", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  website: text("website"),
  logoUrl: text("logo_url"),
  qualityScore: real("quality_score").notNull().default(5.0),
  priceScore: real("price_score").notNull().default(5.0),
  easeOfUseScore: real("ease_of_use_score").notNull().default(5.0),
  popularityScore: real("popularity_score").notNull().default(5.0),
  totalRating: real("total_rating").notNull().default(5.0),
  pricingModel: text("pricing_model"),
  monthlyPrice: real("monthly_price"),
  review: text("review"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

/**
 * AI News - новости об ИИ-инструментах
 */
export const aiNews = sqliteTable("ai_news", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  source: text("source"),
  url: text("url"),
  publishedAt: text("published_at"),
  relatedToolId: text("related_tool_id").references(() => aiTools.id),
  sentiment: text("sentiment"),
  impactScore: real("impact_score").default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

/**
 * Rating History - история изменений рейтингов
 */
export const ratingHistory = sqliteTable("rating_history", {
  id: text("id").primaryKey(),
  toolId: text("tool_id").notNull().references(() => aiTools.id),
  previousRating: real("previous_rating").notNull(),
  newRating: real("new_rating").notNull(),
  delta: real("delta").notNull(),
  reason: text("reason"),
  newsId: text("news_id").references(() => aiNews.id),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export type AiTool = typeof aiTools.$inferSelect;
export type NewAiTool = typeof aiTools.$inferInsert;
export type AiNewsItem = typeof aiNews.$inferSelect;
export type NewAiNewsItem = typeof aiNews.$inferInsert;
export type RatingHistoryItem = typeof ratingHistory.$inferSelect;
export type NewRatingHistoryItem = typeof ratingHistory.$inferInsert;

