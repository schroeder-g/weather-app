import { Menu } from "lucide-react-native";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HelpDialog } from "./HelpDialog";

export function TopBarHeader() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <>
      <View className="flex-row items-center justify-between">
        <Text className="text-red-500 font-black text-xl tracking-widest uppercase">
          Whether.io
        </Text>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Menu color="#1f2937" size={32} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-48 native:w-56"
            insets={contentInsets}
          >
            <DropdownMenuItem onPress={() => setIsHelpOpen(true)}>
              <Text>Help</Text>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Text className="text-red-500">Log out</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </View>
      <HelpDialog open={isHelpOpen} onOpenChange={setIsHelpOpen} />
    </>
  );
}
