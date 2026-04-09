import * as Clipboard from "expo-clipboard";
import { Copy } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  location: string;
  dateStr: string;
  summaryMsg: string;
}

export default function MessageBlast({ location, dateStr, summaryMsg }: Props) {
  const blastText = `Hey everyone!

Upcoming meetup update for ${dateStr} at ${location}:
${summaryMsg}

See you there!`;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(blastText);
    alert("Copied to clipboard!");
  };

  return (
    <View className="my-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-gray-800">Message Blast</Text>
        <Pressable
          onPress={handleCopy}
          className="flex-row items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
        >
          <Copy size={16} color="#4b5563" />
          <Text className="text-sm font-semibold text-gray-700">Copy text</Text>
        </Pressable>
      </View>

      <View className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <Text className="text-gray-800 text-base leading-6">{blastText}</Text>
      </View>
    </View>
  );
}
