import {
  computeTodayTargetBpm,
  getLatestAttempt,
  resolveCurrentBpm,
} from "../progression";
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

describe("resolveCurrentBpm", () => {
  it("記録が無ければ保存済みの到達BPMを返す", () => {
    expect(resolveCurrentBpm(80, [])).toBe(80);
  });

  it("弾けた記録の最大BPMが保存済みより高ければそちらを採る", () => {
    const attempts = [
      makeAttempt({ id: "1", bpm: 120, result: "ok" }),
      makeAttempt({ id: "2", bpm: 150, result: "ng" }),
    ];
    expect(resolveCurrentBpm(80, attempts)).toBe(120);
  });

  it("弾けた記録が保存済みより低ければ後退しない", () => {
    expect(resolveCurrentBpm(80, [makeAttempt({ bpm: 60, result: "ok" })])).toBe(80);
  });
});

describe("computeTodayTargetBpm", () => {
  it("到達BPMで弾けたら+5する", () => {
    const attempt = makeAttempt({ result: "ok", bpm: 70 });
    expect(computeTodayTargetBpm(70, attempt, 200)).toBe(75);
  });

  it("到達BPMより速いテンポで弾けても+5の刻みで進む", () => {
    const attempt = makeAttempt({ result: "ok", bpm: 90 });
    expect(computeTodayTargetBpm(90, attempt, 200)).toBe(95);
  });

  it("到達BPMより遅いテンポでの成功は据え置く", () => {
    const attempt = makeAttempt({ result: "ok", bpm: 60 });
    expect(computeTodayTargetBpm(80, attempt, 200)).toBe(80);
  });

  it("直近の結果がpartialなら据え置く", () => {
    const attempt = makeAttempt({ result: "partial", bpm: 70 });
    expect(computeTodayTargetBpm(70, attempt, 200)).toBe(70);
  });

  it("直近の結果がngなら据え置く", () => {
    const attempt = makeAttempt({ result: "ng", bpm: 70 });
    expect(computeTodayTargetBpm(70, attempt, 200)).toBe(70);
  });

  it("記録が無ければ据え置く", () => {
    expect(computeTodayTargetBpm(70, undefined, 200)).toBe(70);
  });

  it("目標BPMで頭打ちになる", () => {
    const attempt = makeAttempt({ result: "ok", bpm: 98 });
    expect(computeTodayTargetBpm(98, attempt, 100)).toBe(100);
  });

  it("目標BPMが上限240でも240で止まる", () => {
    const attempt = makeAttempt({ result: "ok", bpm: 238 });
    expect(computeTodayTargetBpm(238, attempt, 240)).toBe(240);
  });

  it("既に目標BPMを超えていれば据え置く", () => {
    const attempt = makeAttempt({ result: "ok", bpm: 150 });
    expect(computeTodayTargetBpm(150, attempt, 100)).toBe(150);
  });
});
