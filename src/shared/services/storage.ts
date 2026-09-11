/**
 * AsyncStorageを使用したローカルストレージサービス
 * 練習セッション・お気に入り・最近視聴した動画・練習フレーズ・練習結果の永続化を担当する
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";
import type {
  PracticeSession,
  FavoriteVideo,
  RecentVideo,
  PracticePhrase,
  PhraseAttempt,
} from "@/shared/types/models";
import { practiceSessionSchema } from "@/shared/lib/schemas/practiceSession";
import { favoriteVideoSchema } from "@/shared/lib/schemas/favoriteVideo";
import { recentVideoSchema } from "@/shared/lib/schemas/recentVideo";
import { practicePhraseSchema } from "@/shared/lib/schemas/practicePhrase";
import { phraseAttemptSchema } from "@/shared/lib/schemas/phraseAttempt";
import { clampBpm } from "@/shared/constants/bpm";

/** ストレージキーの定義 */
export const STORAGE_KEYS = {
  PRACTICE_SESSIONS: "@guitar_lovers/practice_sessions",
  FAVORITE_VIDEOS: "@guitar_lovers/favorite_videos",
  RECENT_VIDEOS: "@guitar_lovers/recent_videos",
  PRACTICE_PHRASES: "@guitar_lovers/practice_phrases",
  PHRASE_ATTEMPTS: "@guitar_lovers/phrase_attempts",
  SCHEMA_VERSION: "@guitar_lovers/schema_version",
} as const;

/** 最近視聴した動画の最大保持数 */
const MAX_RECENT_VIDEOS = 10;

// ============================================================
// 共通ヘルパー
// ============================================================

/**
 * 指定キーのリストをAsyncStorageから読み込み、要素ごとにスキーマ検証する
 * 壊れた要素は退避キーへ移してから残りを返す。JSON自体が破損している場合は
 * 元データを退避キーへ移してから空配列を返す（上書き消失防止）
 * @param key - AsyncStorageのキー
 * @param itemSchema - 要素1件分のZodスキーマ
 */
async function readList<T>(
  key: string,
  itemSchema: z.ZodType<T>
): Promise<T[]> {
  let json: string | null;
  try {
    json = await AsyncStorage.getItem(key);
  } catch (e) {
    console.error(`[storage] ${key}の読み込みエラー`, e);
    return [];
  }
  if (!json) return [];

  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch (e) {
    console.error(`[storage] ${key}のJSON解析に失敗、破損データを退避します`, e);
    await quarantine(key, `${key}__corrupt_${Date.now()}`, json, null);
    return [];
  }

  if (!Array.isArray(raw)) {
    console.error(`[storage] ${key}の内容が配列ではありません、破損データを退避します`);
    await quarantine(key, `${key}__corrupt_${Date.now()}`, json, null);
    return [];
  }

  const result: T[] = [];
  const dropped: unknown[] = [];
  for (const item of raw) {
    const parsed = itemSchema.safeParse(item);
    if (parsed.success) {
      result.push(parsed.data);
    } else {
      dropped.push(item);
    }
  }
  if (dropped.length > 0) {
    console.warn(`[storage] ${key}で壊れた要素を${dropped.length}件除外し退避します`);
    await quarantine(
      key,
      `${key}__dropped_${Date.now()}`,
      JSON.stringify(dropped),
      JSON.stringify(result)
    );
  }
  return result;
}

/**
 * 破損データを退避キーへ保存し、元キーを正常分だけに置き換える
 * 元キーに破損分を残すと読み出しのたびに退避キーが増えるため、退避は1回で完結させる
 */
async function quarantine(
  key: string,
  backupKey: string,
  backupJson: string,
  remainingJson: string | null
): Promise<void> {
  await AsyncStorage.setItem(backupKey, backupJson);
  if (remainingJson === null) {
    await AsyncStorage.removeItem(key);
  } else {
    await AsyncStorage.setItem(key, remainingJson);
  }
}

let writeQueue: Promise<unknown> = Promise.resolve();

/**
 * 全件読み→加工→全件書きの更新を直列化する
 * 同一キーへの並行更新が後勝ちで互いの変更を消さないよう、書き込み系はすべてこれを通す
 */
function serialized<T>(operation: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(operation, operation);
  writeQueue = run.catch(() => undefined);
  return run;
}

async function writeList(key: string, list: unknown[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(list));
}

// ============================================================
// スキーマバージョン管理
// ============================================================

/**
 * 現在のストレージスキーマバージョン
 * 2: BPMを40〜240の整数に限定し、区間はstartSec < endSecを必須にした
 */
const SCHEMA_VERSION = 2;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeBpm(value: unknown): unknown {
  return typeof value === "number" && Number.isFinite(value)
    ? clampBpm(Math.round(value))
    : value;
}

/** キーの生JSON配列を要素ごとに変換して書き戻す（スキーマ検証前の移行用） */
async function rewriteRawList(
  key: string,
  mapItem: (item: unknown) => unknown
): Promise<void> {
  const json = await AsyncStorage.getItem(key);
  if (!json) return;
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return;
  }
  if (!Array.isArray(raw)) return;
  await writeList(key, raw.map(mapItem));
}

/** バージョン2への移行: 旧ビルドが検証せずに保存したBPMと区間を新スキーマに収まる値へ補正する */
async function migrateToV2(): Promise<void> {
  await rewriteRawList(STORAGE_KEYS.PRACTICE_PHRASES, (item) => {
    if (!isRecord(item)) return item;
    const { startSec, endSec } = item;
    const needsEndFix =
      typeof startSec === "number" &&
      typeof endSec === "number" &&
      endSec <= startSec;
    return {
      ...item,
      currentBpm: normalizeBpm(item.currentBpm),
      targetBpm: normalizeBpm(item.targetBpm),
      endSec: needsEndFix ? startSec + 1 : endSec,
    };
  });
  await rewriteRawList(STORAGE_KEYS.PHRASE_ATTEMPTS, (item) =>
    isRecord(item) ? { ...item, bpm: normalizeBpm(item.bpm) } : item
  );
}

/**
 * ストレージのスキーマバージョンを確認し、必要なら移行処理を行う
 * アプリ起動時に1回呼び出す想定。失敗してもアプリの起動は妨げない
 */
export function migrateIfNeeded(): Promise<void> {
  return serialized(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);
      const version = stored ? Number(stored) : 0;

      if (version >= SCHEMA_VERSION) return;

      if (version < 2) {
        await migrateToV2();
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.SCHEMA_VERSION,
        String(SCHEMA_VERSION)
      );
    } catch (e) {
      console.error("[storage] migrateIfNeededに失敗", e);
    }
  });
}

// ============================================================
// 練習セッション
// ============================================================

/**
 * 全練習セッションを取得する
 */
export async function getPracticeSessions(): Promise<PracticeSession[]> {
  return readList(STORAGE_KEYS.PRACTICE_SESSIONS, practiceSessionSchema);
}

/**
 * 練習セッションを保存する
 * @param session - 保存するセッション
 */
export function savePracticeSession(session: PracticeSession): Promise<void> {
  return serialized(async () => {
    const sessions = await getPracticeSessions();
    sessions.unshift(session);
    await writeList(STORAGE_KEYS.PRACTICE_SESSIONS, sessions);
  });
}

/**
 * 指定IDの練習セッションを削除する
 * @param id - 削除するセッションのID
 */
export function deletePracticeSession(id: string): Promise<void> {
  return serialized(async () => {
    const sessions = await getPracticeSessions();
    await writeList(
      STORAGE_KEYS.PRACTICE_SESSIONS,
      sessions.filter((s) => s.id !== id)
    );
  });
}

// ============================================================
// お気に入り動画
// ============================================================

/**
 * 全お気に入り動画を取得する
 */
export async function getFavoriteVideos(): Promise<FavoriteVideo[]> {
  return readList(STORAGE_KEYS.FAVORITE_VIDEOS, favoriteVideoSchema);
}

/**
 * お気に入り動画を追加する
 * @param video - 追加する動画
 */
export function addFavoriteVideo(video: FavoriteVideo): Promise<void> {
  return serialized(async () => {
    const favorites = await getFavoriteVideos();
    if (favorites.some((f) => f.videoId === video.videoId)) return;
    favorites.unshift(video);
    await writeList(STORAGE_KEYS.FAVORITE_VIDEOS, favorites);
  });
}

/**
 * お気に入り動画を削除する
 * @param videoId - 削除する動画のID
 */
export function removeFavoriteVideo(videoId: string): Promise<void> {
  return serialized(async () => {
    const favorites = await getFavoriteVideos();
    await writeList(
      STORAGE_KEYS.FAVORITE_VIDEOS,
      favorites.filter((f) => f.videoId !== videoId)
    );
  });
}

// ============================================================
// 最近視聴した動画
// ============================================================

/**
 * 最近視聴した動画一覧を取得する
 */
export async function getRecentVideos(): Promise<RecentVideo[]> {
  return readList(STORAGE_KEYS.RECENT_VIDEOS, recentVideoSchema);
}

/**
 * 最近視聴した動画を記録する
 * 同じ動画が既にある場合は先頭に移動する
 * @param video - 記録する動画
 */
export function addRecentVideo(video: RecentVideo): Promise<void> {
  return serialized(async () => {
    const recents = await getRecentVideos();
    const filtered = recents.filter((r) => r.videoId !== video.videoId);
    filtered.unshift(video);
    await writeList(
      STORAGE_KEYS.RECENT_VIDEOS,
      filtered.slice(0, MAX_RECENT_VIDEOS)
    );
  });
}

// ============================================================
// 練習フレーズ
// ============================================================

/**
 * 全練習フレーズを取得する
 */
export async function getPracticePhrases(): Promise<PracticePhrase[]> {
  return readList(STORAGE_KEYS.PRACTICE_PHRASES, practicePhraseSchema);
}

async function updatePracticePhraseUnlocked(
  id: string,
  patch: Partial<Omit<PracticePhrase, "id">>
): Promise<void> {
  const phrases = await getPracticePhrases();
  await writeList(
    STORAGE_KEYS.PRACTICE_PHRASES,
    phrases.map((p) => (p.id === id ? { ...p, ...patch } : p))
  );
}

/**
 * 練習フレーズを保存する
 * @param phrase - 保存するフレーズ
 */
export function savePracticePhrase(phrase: PracticePhrase): Promise<void> {
  return serialized(async () => {
    const phrases = await getPracticePhrases();
    phrases.unshift(phrase);
    await writeList(STORAGE_KEYS.PRACTICE_PHRASES, phrases);
  });
}

/**
 * 練習フレーズを更新する
 * @param id - 更新するフレーズのID
 * @param patch - 更新するフィールドの差分
 */
export function updatePracticePhrase(
  id: string,
  patch: Partial<Omit<PracticePhrase, "id">>
): Promise<void> {
  return serialized(() => updatePracticePhraseUnlocked(id, patch));
}

/**
 * 練習フレーズをアーカイブする（今日の練習メニューと進捗一覧に表示しない。記録は保持する）
 * @param id - アーカイブするフレーズのID
 */
export function archivePracticePhrase(id: string): Promise<void> {
  return updatePracticePhrase(id, { archivedAt: new Date().toISOString() });
}

/**
 * 指定IDの練習フレーズを削除する。関連するフレーズ練習結果も併せて削除する
 * 結果を先に消すため、途中で失敗してもフレーズは一覧に残り再実行で完了できる
 * @param id - 削除するフレーズのID
 */
export function deletePracticePhrase(id: string): Promise<void> {
  return serialized(async () => {
    const attempts = await getPhraseAttempts();
    const remainingAttempts = attempts.filter((a) => a.phraseId !== id);
    if (remainingAttempts.length !== attempts.length) {
      await writeList(STORAGE_KEYS.PHRASE_ATTEMPTS, remainingAttempts);
    }

    const phrases = await getPracticePhrases();
    await writeList(
      STORAGE_KEYS.PRACTICE_PHRASES,
      phrases.filter((p) => p.id !== id)
    );
  });
}

// ============================================================
// フレーズ練習結果
// ============================================================

/**
 * 全フレーズ練習結果を取得する
 */
export async function getPhraseAttempts(): Promise<PhraseAttempt[]> {
  return readList(STORAGE_KEYS.PHRASE_ATTEMPTS, phraseAttemptSchema);
}

async function savePhraseAttemptUnlocked(attempt: PhraseAttempt): Promise<void> {
  const attempts = await getPhraseAttempts();
  const others = attempts.filter((a) => a.id !== attempt.id);
  others.unshift(attempt);
  await writeList(STORAGE_KEYS.PHRASE_ATTEMPTS, others);
}

/**
 * フレーズ練習結果を保存する。同じIDが既にあれば置き換える（再送しても重複しない）
 * @param attempt - 保存する練習結果
 */
export function savePhraseAttempt(attempt: PhraseAttempt): Promise<void> {
  return serialized(() => savePhraseAttemptUnlocked(attempt));
}

/**
 * フレーズ練習の結果を記録し、弾けた場合はフレーズの到達BPMを引き上げる
 * 対象フレーズが無ければ例外にする（削除済みフレーズへの孤児記録を防ぐ）。
 * attemptのIDをキーにした置き換え保存なので、途中で失敗しても同じ入力で再実行できる
 * @param attempt - 記録する練習結果
 */
export function recordPhraseResult(attempt: PhraseAttempt): Promise<void> {
  return serialized(async () => {
    const phrases = await getPracticePhrases();
    const phrase = phrases.find((p) => p.id === attempt.phraseId);
    if (!phrase) {
      throw new Error("記録対象のフレーズが見つかりません");
    }

    // 到達BPMを先に更新する。attemptだけ残ると「弾けた記録があるのに到達BPMが低い」状態になるため
    if (attempt.result === "ok" && phrase.currentBpm < attempt.bpm) {
      await updatePracticePhraseUnlocked(phrase.id, {
        currentBpm: attempt.bpm,
        updatedAt: attempt.date,
      });
    }
    await savePhraseAttemptUnlocked(attempt);
  });
}
