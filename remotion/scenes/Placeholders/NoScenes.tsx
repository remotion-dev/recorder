import { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import {
  REGULAR_FONT_FAMILY,
  REGULAR_FONT_WEIGHT,
} from "../../../config/fonts";
import { COLORS } from "../../../config/themes";

const container: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
  fontFamily: REGULAR_FONT_FAMILY,
  fontWeight: REGULAR_FONT_WEIGHT,
  fontSize: 36,
  gap: 10,
  flexDirection: "column",
};

export const NoScenes: React.FC<{ theme: "light" | "dark" }> = ({ theme }) => {
  const dynamicContainer = useMemo(() => {
    return {
      ...container,
      color: COLORS[theme].WORD_COLOR_ON_BG_APPEARED,
    };
  }, [theme]);

  return (
    <AbsoluteFill>
      <div style={dynamicContainer}>
        {" "}
        <div>No scenes defined for this video.</div>
        <div>Add a scene in the right sidebar -&gt;</div>
      </div>
    </AbsoluteFill>
  );
};
