import { useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
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
  type: "no-videos" | "no-more-videos";
  theme: "light" | "dark";
}> = ({ type, theme }) => {
  const { id } = useVideoConfig();

  const spanStyle: React.CSSProperties = useMemo(() => {
    return {
      color: COLORS[theme].ACCENT_COLOR,
      fontFamily: MONOSPACE_FONT_FAMILY,
    };
  }, [theme]);

  if (type === "no-videos") {
    return (
      <AbsoluteFill style={{ backgroundColor: "white" }}>
        <div style={textWrapper}>
          <div style={{ padding: 100 }}>
            No video clips found in the <span style={spanStyle}>{id}</span>{" "}
            folder. <br />
            Record more video clips in the{" "}
            <a href="http://localhost:4000" target="_blank" style={spanStyle}>
              recorder
            </a>{" "}
            to access them here.
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "white" }}>
      <div style={textWrapper}>
        <div style={{ padding: 100 }}>
          No more videos clips in the <span style={spanStyle}>{id}</span>{" "}
          folder.
          <br /> Record more in the{" "}
          <a href="http://localhost:4000" target="_blank" style={spanStyle}>
            recorder.
          </a>
        </div>
      </div>
    </AbsoluteFill>
  );
};
