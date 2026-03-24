/**
 * src/api/routes/auto-update.ts
 *
 * Hono роутер для запуска автоматического обновления рейтингов.
 * Эмулирует поведение tRPC mutation: trpc.autoUpdate.trigger.useMutation()
 *
 * POST /api/auto-update/trigger  — запустить обновление вручную
 * GET  /api/auto-update/status   — получить статус последнего обновления
 */

import { Hono } from "hono";
import { runAutomatedUpdate } from "../../../server/auto-update";

type Env = {
  DB: D1Database;
  AI_GATEWAY_API_KEY: string;
};

const router = new Hono<{ Bindings: Env }>();

/**
 * POST /api/auto-update/trigger
 * Запускает процесс автоматического обновления рейтингов ИИ-инструментов.
 * Эквивалент: trpc.autoUpdate.trigger.useMutation()
 */
router.post("/trigger", async (c) => {
  console.log("[API] Manual auto-update triggered");

  const apiKey = c.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    return c.json(
      { success: false, error: "AI_GATEWAY_API_KEY not configured" },
      500
    );
  }

  try {
    const result = await runAutomatedUpdate(c.env.DB, apiKey);
    return c.json({
      success: result.success,
      data: result,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[API] Auto-update failed:", message);
    return c.json({ success: false, error: message }, 500);
  }
});

/**
 * GET /api/auto-update/status
 * Возвращает информацию о последних обновлениях из истории рейтингов.
 */
router.get("/status", async (c) => {
  return c.json({
    success: true,
    data: {
      schedule: "Wednesdays and Saturdays at 00:00 UTC",
      lastTrigger: null,
      message: "Use POST /api/auto-update/trigger to run manually",
    },
  });
});

export default router;
