import { phraseAttemptsSchema } from "../phraseAttempt";

describe("phraseAttemptsSchema", () => {
  it("正しいデータで通る", () => {
    const data = [
      { id: "a", phraseId: "p1", date: "2026-08-10", bpm: 75, result: "ok" },
    ];
    const result = phraseAttemptsSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("resultが不正な値のときは失敗する", () => {
    const data = [
      { id: "a", phraseId: "p1", date: "2026-08-10", bpm: 75, result: "good" },
    ];
    const result = phraseAttemptsSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("bpmが0以下のときは失敗する", () => {
    const data = [
      { id: "a", phraseId: "p1", date: "2026-08-10", bpm: 0, result: "ok" },
    ];
    const result = phraseAttemptsSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("bpmが240を超えるときは失敗する", () => {
    const data = [
      { id: "a", phraseId: "p1", date: "2026-08-10", bpm: 241, result: "ok" },
    ];
    const result = phraseAttemptsSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("空配列は通る", () => {
    const result = phraseAttemptsSchema.safeParse([]);
    expect(result.success).toBe(true);
  });
});
