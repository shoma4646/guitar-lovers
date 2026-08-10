import { practicePhrasesSchema } from "../practicePhrase";

function makePhrase(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "a",
    videoId: "vid",
    videoTitle: "曲",
    name: "速弾きフレーズ1",
    startSec: 10,
    endSec: 20,
    currentBpm: 70,
    targetBpm: 110,
    playbackRate: 1.0,
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z",
    ...overrides,
  };
}

describe("practicePhrasesSchema", () => {
  it("必須フィールドのみで通る", () => {
    const result = practicePhrasesSchema.safeParse([makePhrase()]);
    expect(result.success).toBe(true);
  });

  it("archivedAtを含めて通る", () => {
    const data = [makePhrase({ archivedAt: "2026-08-11T00:00:00.000Z" })];
    const result = practicePhrasesSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("currentBpmが0以下のときは失敗する", () => {
    const data = [makePhrase({ currentBpm: 0 })];
    const result = practicePhrasesSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("startSecが負の値のときは失敗する", () => {
    const data = [makePhrase({ startSec: -1 })];
    const result = practicePhrasesSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("型が違うフィールドがあれば失敗する", () => {
    const data = [makePhrase({ name: 123 })];
    const result = practicePhrasesSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("空配列は通る", () => {
    const result = practicePhrasesSchema.safeParse([]);
    expect(result.success).toBe(true);
  });
});
