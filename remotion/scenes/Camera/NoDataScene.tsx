import { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import {
  MONOSPACE_FONT_FAMILY,
  REGULAR_FONT_FAMILY,
  TITLE_FONT_WEIGHT,
} from "../../../config/fonts";
import { COLORS } from "../../../config/themes";

const textWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  gap: 10,
  fontFamily: REGULAR_FONT_FAMILY,
  fontWeight: TITLE_FONT_WEIGHT,
  fontSize: 40,
};

export const NoDataScene: React.FC<{
  theme: "light" | "dark";
}> = ({ theme }) => {
  const spanStyle: React.CSSProperties = useMemo(() => {
    return {
      color: COLORS[theme].ACCENT_COLOR,
      fontFamily: MONOSPACE_FONT_FAMILY,
    };
  }, [theme]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS[theme].BACKGROUND }}>
      <div style={textWrapper}>
        <div style={{ padding: 100 }}>
          No <span style={spanStyle}>scene</span> defined yet?
          <br /> Add a new one in the right side bar.
        </div>
      </div>
    </AbsoluteFill>
  );
};
