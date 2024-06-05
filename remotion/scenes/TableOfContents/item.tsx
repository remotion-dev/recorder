import { useMemo } from "react";
import { useVideoConfig } from "remotion";
import { REGULAR_FONT_WEIGHT, TITLE_FONT_FAMILY } from "../../../config/fonts";
import { formatMilliseconds } from "../../../src/helpers/format-time";

export const TableOfContentItem: React.FC<{
  title: string;
  startTime: number;
}> = ({ title, startTime }) => {
  const { fps } = useVideoConfig();

  const time = useMemo(() => {
    return Math.floor(startTime / fps);
  }, [fps, startTime]);

  return (
    <div
      style={{
        fontFamily: TITLE_FONT_FAMILY,
        fontSize: 46,
        fontWeight: REGULAR_FONT_WEIGHT,
        display: "flex",
        flexDirection: "row",
        width: "100%",
        lineHeight: 1.5,
      }}
    >
      <div style={{ flex: 1 }}>{title}</div>
      <div
        style={{
          width: 150,
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatMilliseconds(time * 1000)}
      </div>
    </div>
  );
};
