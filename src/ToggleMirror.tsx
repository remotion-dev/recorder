import React from "react";
import { Toggle } from "./components/ui/toggle";

export const ToggleMirror: React.FC<{
  onPressedChange: (pressed: boolean) => void;
  pressed: boolean;
}> = ({ onPressedChange, pressed }) => {
  return (
    <Toggle
      aria-label="Toggle mirror"
      pressed={pressed}
      onPressedChange={onPressedChange}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: 16, height: 16 }}
        viewBox="0 0 512 512"
      >
        {/* Mirror/Flip horizontal icon */}
        <path
          fill="currentcolor"
          d="M0 256C0 167.6 71.6 96 160 96h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-53 0-96 43-96 96s43 96 96 96h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H160C71.6 416 0 344.4 0 256zM352 96h32c88.4 0 160 71.6 160 160s-71.6 160-160 160H352c-17.7 0-32-14.3-32-32s14.3-32 32-32h32c53 0 96-43 96-96s-43-96-96-96H352c-17.7 0-32-14.3-32-32s14.3-32 32-32zM256 128c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32z"
        />
      </svg>
    </Toggle>
  );
};