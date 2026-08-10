import { z } from "zod";

/** フレーズ練習結果のZodスキーマ。AsyncStorage復元値をパースする */
export const phraseAttemptSchema = z.object({
  id: z.string(),
  phraseId: z.string(),
  date: z.string(),
  bpm: z.number().positive(),
  result: z.enum(["ok", "partial", "ng"]),
});

export const phraseAttemptsSchema = z.array(phraseAttemptSchema);

export type PhraseAttemptParsed = z.infer<typeof phraseAttemptSchema>;
