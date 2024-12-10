import { MicIcon } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

const spacer: React.CSSProperties = {
  width: 12,
};

export const CurrentAudio: React.FC<{
  label: string | null;
  onClick: () => void;
}> = ({ label, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const container: React.CSSProperties = useMemo(() => {
    return {
      display: "flex",
      flexDirection: "row",
      fontSize: 13,
      alignItems: "center",
      flex: 1,
      lineHeight: 1.4,
      paddingLeft: 10,
      cursor: "pointer",
      background: hovered ? "rgba(0, 0, 0, 0.5)" : "transparent",
      height: "100%",
    };
  }, [hovered]);

  const onPointerEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const onPointerLeave = useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <div
      onPointerLeave={onPointerLeave}
      onPointerEnter={onPointerEnter}
      style={container}
      onClick={onClick}
    >
      <MicIcon></MicIcon>
      <div style={spacer}></div>
      <div>{label ?? "No audio selected"}</div>
    </div>
  );
};
