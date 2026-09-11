import type { AudioContext } from "react-native-audio-api";

const ACCENT_FREQUENCY_HZ = 1000;
const NORMAL_FREQUENCY_HZ = 800;
const ACCENT_GAIN = 1.0;
const NORMAL_GAIN = 0.7;
const CLICK_DURATION_SEC = 0.03;
const MIN_GAIN = 0.001;

/** 指定時刻にクリック音を1回予約する（OscillatorNodeは毎回使い捨て） */
export function scheduleClick(
  ctx: AudioContext,
  time: number,
  isAccent: boolean,
): void {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.frequency.setValueAtTime(
    isAccent ? ACCENT_FREQUENCY_HZ : NORMAL_FREQUENCY_HZ,
    time,
  );
  gain.gain.setValueAtTime(isAccent ? ACCENT_GAIN : NORMAL_GAIN, time);
  gain.gain.exponentialRampToValueAtTime(
    MIN_GAIN,
    time + CLICK_DURATION_SEC,
  );

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(time);
  oscillator.stop(time + CLICK_DURATION_SEC);
}
