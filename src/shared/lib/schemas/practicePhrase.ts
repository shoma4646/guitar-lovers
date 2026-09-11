import { z } from "zod";
import { BPM_MAX, BPM_MIN } from "@/shared/constants/bpm";

/** 練習フレーズのZodスキーマ。AsyncStorage復元値をパースする */
export const practicePhraseSchema = z
  .object({
    id: z.string(),
    videoId: z.string(),
    videoTitle: z.string(),
    name: z.string(),
    startSec: z.number().nonnegative(),
    endSec: z.number().nonnegative(),
    currentBpm: z.number().int().min(BPM_MIN).max(BPM_MAX),
    targetBpm: z.number().int().min(BPM_MIN).max(BPM_MAX),
    playbackRate: z.number().positive(),
    createdAt: z.string(),
    updatedAt: z.string(),
    archivedAt: z.string().optional(),
  })
  .refine((phrase) => phrase.startSec < phrase.endSec, {
    message: "区間の終了点は開始点より後である必要があります",
    path: ["endSec"],
  });

export const practicePhrasesSchema = z.array(practicePhraseSchema);

export type PracticePhraseParsed = z.infer<typeof practicePhraseSchema>;
