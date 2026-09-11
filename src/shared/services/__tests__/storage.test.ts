// jest.mockのfactoryから参照するため、対象モジュールより先にimportしておく必要がある
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  STORAGE_KEYS,
  archivePracticePhrase,
  deletePracticePhrase,
  getPhraseAttempts,
  getPracticePhrases,
  migrateIfNeeded,
  savePhraseAttempt,
  savePracticePhrase,
} from "../storage";
import type { PhraseAttempt, PracticePhrase } from "@/shared/types/models";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

function makePhrase(id: string): PracticePhrase {
  return {
    id,
    videoId: "abc123def45",
    videoTitle: "テスト動画",
    name: `フレーズ${id}`,
    startSec: 10,
    endSec: 20,
    currentBpm: 80,
    targetBpm: 120,
    playbackRate: 1,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  };
}

function makeAttempt(id: string, phraseId: string): PhraseAttempt {
  return {
    id,
    phraseId,
    date: "2026-09-02T00:00:00.000Z",
    bpm: 85,
    result: "ok",
  };
}

async function corruptKeys(): Promise<string[]> {
  const keys = await AsyncStorage.getAllKeys();
  return keys.filter((k) => k.includes("__corrupt_"));
}

describe("readList（要素単位の検証）", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("1件だけ壊れた要素があっても残りは返す", async () => {
    const broken = { id: "broken", name: "startSecが無い" };
    await AsyncStorage.setItem(
      STORAGE_KEYS.PRACTICE_PHRASES,
      JSON.stringify([makePhrase("a"), broken, makePhrase("b")]),
    );

    const phrases = await getPracticePhrases();

    expect(phrases.map((p) => p.id)).toEqual(["a", "b"]);
  });

  it("壊れた要素を捨てた後に保存しても正常な要素は失われない", async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.PRACTICE_PHRASES,
      JSON.stringify([makePhrase("a"), { id: "broken" }]),
    );

    await savePracticePhrase(makePhrase("c"));

    const phrases = await getPracticePhrases();
    expect(phrases.map((p) => p.id)).toEqual(["c", "a"]);
  });

  it("JSONが破損していれば退避キーへ保存して空配列を返す", async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.PRACTICE_PHRASES, "{not json");

    const phrases = await getPracticePhrases();

    expect(phrases).toEqual([]);
    const backups = await corruptKeys();
    expect(backups).toHaveLength(1);
    expect(backups[0]).toContain(STORAGE_KEYS.PRACTICE_PHRASES);
    expect(await AsyncStorage.getItem(backups[0])).toBe("{not json");
  });

  it("配列でない内容も退避キーへ保存して空配列を返す", async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.PHRASE_ATTEMPTS,
      JSON.stringify({ oops: true }),
    );

    const attempts = await getPhraseAttempts();

    expect(attempts).toEqual([]);
    expect(await corruptKeys()).toHaveLength(1);
  });

  it("キーが未設定なら空配列を返す", async () => {
    expect(await getPracticePhrases()).toEqual([]);
  });
});

describe("フレーズの削除とアーカイブ", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("フレーズ削除で関連する練習結果も削除される", async () => {
    await savePracticePhrase(makePhrase("keep"));
    await savePracticePhrase(makePhrase("gone"));
    await savePhraseAttempt(makeAttempt("a1", "gone"));
    await savePhraseAttempt(makeAttempt("a2", "keep"));

    await deletePracticePhrase("gone");

    expect((await getPracticePhrases()).map((p) => p.id)).toEqual(["keep"]);
    expect((await getPhraseAttempts()).map((a) => a.id)).toEqual(["a2"]);
  });

  it("archivePracticePhraseでarchivedAtが設定される", async () => {
    await savePracticePhrase(makePhrase("x"));

    await archivePracticePhrase("x");

    const [phrase] = await getPracticePhrases();
    expect(phrase.archivedAt).toEqual(expect.any(String));
    expect(Number.isNaN(Date.parse(phrase.archivedAt!))).toBe(false);
  });
});

describe("migrateIfNeeded", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("未設定ならschema_versionに1を書く", async () => {
    await migrateIfNeeded();

    expect(await AsyncStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION)).toBe("1");
  });

  it("既に現行バージョンなら何もしない", async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, "1");
    const setItem = jest.spyOn(AsyncStorage, "setItem");
    setItem.mockClear();

    await migrateIfNeeded();

    expect(setItem).not.toHaveBeenCalled();
    setItem.mockRestore();
  });
});
