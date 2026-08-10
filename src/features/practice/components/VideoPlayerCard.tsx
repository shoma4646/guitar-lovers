/**
 * YouTube動画プレイヤーカード
 *
 * WebViewのrefはPracticeTab側で所有し（sendToPlayerで使うため）、
 * このコンポーネントはforwardRefで受け渡すだけに留める。
 */

import { forwardRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import WebView from "react-native-webview";
import { buildYouTubeHtml } from "@/features/practice/lib/youtubeHtml";
import { cardShadowStyle } from "./cardStyle";

const SCREEN_WIDTH = Dimensions.get("window").width;

type Props = {
  videoId: string;
  /** 初期再生位置（秒）。フレーズ練習の再開時にA点から始めるために使う */
  startSeconds?: number;
  /** 初期再生速度。フレーズ練習の再開時にそのフレーズの速度から始めるために使う */
  initialRate?: number;
  onTimeUpdate: (time: number) => void;
  onDurationReady: (duration: number) => void;
};

export const VideoPlayerCard = forwardRef<WebView, Props>(
  function VideoPlayerCard(
    { videoId, startSeconds = 0, initialRate = 1, onTimeUpdate, onDurationReady },
    ref,
  ) {
    return (
      <View
        className="bg-surface-container-highest overflow-hidden"
        style={[styles.videoCard, cardShadowStyle]}
      >
        <WebView
          ref={ref}
          source={{ html: buildYouTubeHtml(videoId, startSeconds, initialRate) }}
          style={styles.webView}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          domStorageEnabled
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === "time") {
                onTimeUpdate(data.currentTime);
              } else if (data.type === "ready") {
                onDurationReady(data.duration);
              }
            } catch {
              // ignore
            }
          }}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  videoCard: {
    height: (SCREEN_WIDTH - 40) * (9 / 16),
    borderRadius: 16,
    marginBottom: 16,
  },
  webView: {
    flex: 1,
    borderRadius: 16,
  },
});
