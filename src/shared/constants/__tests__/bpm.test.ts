import { BPM_MAX, BPM_MIN, clampBpm, isValidBpm } from "../bpm";

describe("isValidBpm", () => {
  it("境界値を含む範囲内の整数だけを許容する", () => {
    expect(isValidBpm(BPM_MIN)).toBe(true);
    expect(isValidBpm(BPM_MAX)).toBe(true);
    expect(isValidBpm(BPM_MIN - 1)).toBe(false);
    expect(isValidBpm(BPM_MAX + 1)).toBe(false);
  });

  it("整数でない値とNaNは許容しない", () => {
    expect(isValidBpm(120.5)).toBe(false);
    expect(isValidBpm(Number.NaN)).toBe(false);
  });
});

describe("clampBpm", () => {
  it("範囲内の値はそのまま返す", () => {
    expect(clampBpm(120)).toBe(120);
  });

  it("範囲外の値は境界に丸める", () => {
    expect(clampBpm(10)).toBe(BPM_MIN);
    expect(clampBpm(999)).toBe(BPM_MAX);
  });
});
