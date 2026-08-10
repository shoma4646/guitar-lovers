/**
 * ブックマークカード
 */

import { View, Text, Pressable } from "react-native";
import { Icon } from "@/shared/components/atoms/Icon";
import { colors } from "@/shared/theme";
import { formatDuration } from "@/features/practice/lib/formatters";
import type { Bookmark } from "@/shared/types/models";
import { cardShadowStyle, cardStyle } from "./cardStyle";

type Props = {
  bookmarks: Bookmark[];
  onAdd: () => void;
  onRemove: (id: string) => void;
};

export function BookmarksCard({ bookmarks, onAdd, onRemove }: Props) {
  return (
    <View
      className="bg-surface-container-lowest"
      style={[cardStyle, cardShadowStyle, { marginBottom: 16, gap: 12 }]}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className="text-headline-lg"
          style={{ color: colors.onSurface, fontWeight: "700" }}
        >
          ブックマーク
        </Text>
        <Pressable
          onPress={onAdd}
          className="items-center justify-center active:opacity-80"
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: `${colors.primaryContainer}33`,
          }}
          accessibilityRole="button"
          accessibilityLabel="ブックマークを追加"
        >
          <Icon name="add" size={20} color={colors.primary} />
        </Pressable>
      </View>
      {bookmarks.length === 0 ? (
        <Text
          className="text-on-surface-variant text-body-md text-center"
          style={{ paddingVertical: 12 }}
        >
          ブックマークはありません
        </Text>
      ) : (
        <View style={{ gap: 6 }}>
          {bookmarks.map((bm) => (
            <View
              key={bm.id}
              className="flex-row items-center"
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 12,
                gap: 12,
                backgroundColor: colors.surfaceContainerLow,
              }}
            >
              <Icon name="bookmark" size={16} color={colors.primary} />
              <Text
                className="text-body-md"
                style={{ flex: 1, color: colors.onSurface }}
              >
                {bm.label ?? formatDuration(bm.time)}
              </Text>
              <Text
                className="text-label-sm"
                style={{
                  color: colors.onSurfaceVariant,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {formatDuration(bm.time)}
              </Text>
              <Pressable
                onPress={() => onRemove(bm.id)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="ブックマークを削除"
              >
                <Icon name="close" size={18} color={colors.onSurfaceVariant} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
