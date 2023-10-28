import { Crop } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";
import React from "react";

export const ToggleCrop: React.FC<{
  onPressedChange: (pressed: boolean) => void;
  pressed: boolean;
}> = ({ onPressedChange, pressed }) => {
  return (
    <Toggle
      aria-label="Toggle italic"
      onPressedChange={onPressedChange}
      pressed={pressed}
    >
      <Crop className="h-4 w-4" />
    </Toggle>
  );
};
