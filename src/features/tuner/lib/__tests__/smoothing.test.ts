import { createPitchSmoother } from "../smoothing";

describe("createPitchSmoother", () => {
  it("信頼度が閾値未満の値は捨てる", () => {
    const smoother = createPitchSmoother({ minClarity: 0.9 });
    expect(smoother.push(110, 0.5)).toBeNull();
  });

  it("音域外の値は捨てる", () => {
    const smoother = createPitchSmoother({ minHz: 60, maxHz: 1200 });
    expect(smoother.push(20, 1)).toBeNull();
    expect(smoother.push(5000, 1)).toBeNull();
  });

  it("直近windowSize件の中央値を返す", () => {
    const smoother = createPitchSmoother({ windowSize: 3 });
    smoother.push(100, 1);
    smoother.push(200, 1);
    expect(smoother.push(110, 1)).toBe(110);
    expect(smoother.push(105, 1)).toBe(110);
  });

  it("単発のノイズは中央値で吸収される", () => {
    const smoother = createPitchSmoother({ windowSize: 5 });
    [110, 110, 110, 110].forEach((hz) => smoother.push(hz, 1));
    expect(smoother.push(220, 1)).toBe(110);
  });

  it("無効値がmaxMisses未満なら直前の値を保持する", () => {
    const smoother = createPitchSmoother({ maxMisses: 3 });
    smoother.push(110, 1);
    expect(smoother.push(0, 0)).toBe(110);
    expect(smoother.push(0, 0)).toBe(110);
  });

  it("無効値がmaxMisses回続いたらnullに戻る", () => {
    const smoother = createPitchSmoother({ maxMisses: 2 });
    smoother.push(110, 1);
    smoother.push(0, 0);
    expect(smoother.push(0, 0)).toBeNull();
    expect(smoother.push(220, 1)).toBe(220);
  });

  it("resetで窓が空になる", () => {
    const smoother = createPitchSmoother();
    smoother.push(110, 1);
    smoother.reset();
    expect(smoother.push(220, 1)).toBe(220);
  });
});
