import { Crop } from "lucide-react";

import React from "react";
import { Toggle } from "./components/ui/toggle";

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
