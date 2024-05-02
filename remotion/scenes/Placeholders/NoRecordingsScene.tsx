import { useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import {
  MONOSPACE_FONT_FAMILY,
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

const accent: React.CSSProperties = {
  fontFamily: MONOSPACE_FONT_FAMILY,
  color: COLORS.light.ACCENT_COLOR,
};

export const NoRecordingsScene: React.FC<{
  theme: "light" | "dark";
  type: "none" | "no-more";
}> = ({ type, theme }) => {
  const { id } = useVideoConfig();
  const url = `http://localhost:4000?folder=${id}`;

  const dynamicContainer = useMemo(() => {
    return {
      ...container,
      color: COLORS[theme].WORD_COLOR_ON_BG_APPEARED,
    };
  }, [theme]);

  return (
    <AbsoluteFill>
      <div style={dynamicContainer}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
          }}
        >
          No {type === "no-more" ? "more" : null} recordings in the
          <span style={accent}>{id}</span>
          folder.
        </div>

        <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
          <a
            href={url}
            target="_blank"
            style={{ color: COLORS.light.ACCENT_COLOR }}
          >
            Go to the Recorder
          </a>
          to create {type === "no-more" ? "more clips" : "a clip"}!
        </div>
      </div>
    </AbsoluteFill>
  );
};
