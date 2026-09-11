import { computeTodayTargetBpm, getLatestAttempt } from "../progression";
import type { PhraseAttempt } from "@/shared/types/models";

function makeAttempt(overrides: Partial<PhraseAttempt> = {}): PhraseAttempt {
  return {
    id: "a",
    phraseId: "p1",
    date: "2026-08-10T00:00:00.000Z",
    bpm: 70,
    result: "ok",
    ...overrides,
  };
}

describe("getLatestAttempt", () => {
  it("記録が無ければundefinedを返す", () => {
    expect(getLatestAttempt([])).toBeUndefined();
  });

  it("最新日時の記録を返す", () => {
    const older = makeAttempt({ id: "old", date: "2026-08-08T00:00:00.000Z" });
    const newer = makeAttempt({ id: "new", date: "2026-08-10T00:00:00.000Z" });
    expect(getLatestAttempt([older, newer])?.id).toBe("new");
  });

  it("配列の順序に依存せず日時で判定する", () => {
    const older = makeAttempt({ id: "old", date: "2026-08-08T00:00:00.000Z" });
    const newer = makeAttempt({ id: "new", date: "2026-08-10T00:00:00.000Z" });
    expect(getLatestAttempt([newer, older])?.id).toBe("new");
  });
});

describe("computeTodayTargetBpm", () => {
  it("直近の結果がokなら+5する", () => {
    const attempt = makeAttempt({ result: "ok" });
    expect(computeTodayTargetBpm(70, attempt, 200)).toBe(75);
  });

  it("直近の結果がpartialなら据え置く", () => {
    const attempt = makeAttempt({ result: "partial" });
    expect(computeTodayTargetBpm(70, attempt, 200)).toBe(70);
  });

  it("直近の結果がngなら据え置く", () => {
    const attempt = makeAttempt({ result: "ng" });
    expect(computeTodayTargetBpm(70, attempt, 200)).toBe(70);
  });

  it("記録が無ければ据え置く", () => {
    expect(computeTodayTargetBpm(70, undefined, 200)).toBe(70);
  });

  it("目標BPMで頭打ちになる", () => {
    const attempt = makeAttempt({ result: "ok" });
    expect(computeTodayTargetBpm(98, attempt, 100)).toBe(100);
  });

  it("240で頭打ちになる", () => {
    const attempt = makeAttempt({ result: "ok" });
    expect(computeTodayTargetBpm(238, attempt, 300)).toBe(240);
  });

  it("既に目標BPMを超えていれば据え置く", () => {
    const attempt = makeAttempt({ result: "ok" });
    expect(computeTodayTargetBpm(150, attempt, 100)).toBe(150);
  });
});
