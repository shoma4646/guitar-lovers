/**
 * YouTube URL入力カード
 */

import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { colors } from "@/shared/theme";
import { cardShadowStyle, cardStyle } from "./cardStyle";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onLoad: () => void;
};

export function VideoLoaderCard({ value, onChangeText, onLoad }: Props) {
  return (
    <View
      className="bg-surface-container-lowest"
      style={[cardStyle, cardShadowStyle, { gap: 12, marginBottom: 16 }]}
    >
      <Text
        className="text-label-sm"
        style={{
          color: colors.onSurfaceVariant,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          fontWeight: "600",
        }}
      >
        YOUTUBE URL
      </Text>
      <View className="flex-row" style={{ gap: 8 }}>
        <TextInput
          style={[
            styles.urlInput,
            {
              backgroundColor: colors.surfaceContainerLow,
              color: colors.onSurface,
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder="https://youtube.com/watch?v=..."
          placeholderTextColor={colors.onSurfaceVariant}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="go"
          onSubmitEditing={onLoad}
          accessibilityLabel="YouTube URL入力"
        />
        <Pressable
          onPress={onLoad}
          className="active:opacity-90"
          style={{
            height: 44,
            paddingHorizontal: 20,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary,
          }}
          accessibilityRole="button"
        >
          <Text
            className="text-label-sm"
            style={{ color: colors.onPrimary, fontWeight: "700" }}
          >
            読み込む
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  urlInput: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});
