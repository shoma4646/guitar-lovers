import { bpmToIntervalSec, scheduleBeats } from "../metronomeScheduler";

describe("bpmToIntervalSec", () => {
  it("BPM60は1拍1秒になる", () => {
    expect(bpmToIntervalSec(60)).toBe(1);
  });

  it("BPM120は1拍0.5秒になる", () => {
    expect(bpmToIntervalSec(120)).toBe(0.5);
  });
});

describe("scheduleBeats", () => {
  it("lookahead区間内の拍だけを返す", () => {
    const result = scheduleBeats({
      now: 0,
      nextBeatTime: 0,
      intervalSec: 0.5,
      lookaheadSec: 0.1,
      beatIndex: 0,
      beatsPerBar: 4,
    });

    expect(result.beats).toHaveLength(1);
    expect(result.beats[0]).toEqual({ time: 0, isAccent: true, beatIndex: 0 });
    expect(result.nextBeatTime).toBe(0.5);
    expect(result.beatIndex).toBe(1);
  });

  it("lookahead区間を跨ぐ複数拍をまとめて返す", () => {
    const result = scheduleBeats({
      now: 1,
      nextBeatTime: 0.5,
      intervalSec: 0.5,
      lookaheadSec: 1.2,
      beatIndex: 1,
      beatsPerBar: 4,
    });

    expect(result.beats.map((b) => b.time)).toEqual([0.5, 1.0, 1.5, 2.0]);
    expect(result.nextBeatTime).toBe(2.5);
    expect(result.beatIndex).toBe(1);
  });

  it("小節頭の拍だけisAccentがtrueになる", () => {
    const result = scheduleBeats({
      now: 0,
      nextBeatTime: 0,
      intervalSec: 0.25,
      lookaheadSec: 1.1,
      beatIndex: 0,
      beatsPerBar: 4,
    });

    expect(result.beats.map((b) => b.isAccent)).toEqual([
      true,
      false,
      false,
      false,
      true,
    ]);
  });

  it("1000拍進めても累積ドリフトが出ない", () => {
    const bpm = 137;
    const intervalSec = 60 / bpm;
    const start = 0;
    let state = {
      nextBeatTime: start,
      beatIndex: 0,
    };

    for (let i = 0; i < 1000; i += 1) {
      const result = scheduleBeats({
        now: state.nextBeatTime,
        nextBeatTime: state.nextBeatTime,
        intervalSec,
        lookaheadSec: 0.0001,
        beatIndex: state.beatIndex,
        beatsPerBar: 4,
      });
      state = { nextBeatTime: result.nextBeatTime, beatIndex: result.beatIndex };
    }

    expect(state.nextBeatTime).toBeCloseTo(start + 1000 * intervalSec, 9);
  });

  it("BPM変更でintervalSecを差し替えると次拍から新しい間隔になる", () => {
    const first = scheduleBeats({
      now: 0,
      nextBeatTime: 0,
      intervalSec: 0.5,
      lookaheadSec: 0.1,
      beatIndex: 0,
      beatsPerBar: 4,
    });

    const second = scheduleBeats({
      now: 0.5,
      nextBeatTime: first.nextBeatTime,
      intervalSec: 0.25,
      lookaheadSec: 0.1,
      beatIndex: first.beatIndex,
      beatsPerBar: 4,
    });

    expect(second.beats[0].time).toBe(0.5);
    expect(second.nextBeatTime).toBe(0.75);
  });
});
