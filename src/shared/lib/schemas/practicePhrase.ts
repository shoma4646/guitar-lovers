import { z } from "zod";

/** 練習フレーズのZodスキーマ。AsyncStorage復元値をパースする */
export const practicePhraseSchema = z.object({
  id: z.string(),
  videoId: z.string(),
  videoTitle: z.string(),
  name: z.string(),
  startSec: z.number().nonnegative(),
  endSec: z.number().nonnegative(),
  currentBpm: z.number().positive(),
  targetBpm: z.number().positive(),
  playbackRate: z.number().positive(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archivedAt: z.string().optional(),
});

export const practicePhrasesSchema = z.array(practicePhraseSchema);

export type PracticePhraseParsed = z.infer<typeof practicePhraseSchema>;
