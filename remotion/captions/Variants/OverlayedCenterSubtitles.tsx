import type { CanvasLayout } from "../../../config/layout";
import { getHorizontalPaddingForSubtitles } from "../processing/postprocess-subs";
import type { Segment } from "../types";
import { Words } from "../Words";
import { LINE_HEIGHT } from "./SquareSubtitles";

export const OverlayedCenterSubtitles: React.FC<{
  segment: Segment;
  startFrame: number;
  canvasLayout: CanvasLayout;
}> = ({ segment, startFrame, canvasLayout }) => {
  const padding = getHorizontalPaddingForSubtitles(
    "overlayed-center",
    canvasLayout,
  );

  return (
    <div>
      <span
        style={{
          lineHeight: LINE_HEIGHT,
          display: "inline-block",
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
          paddingLeft: padding,
          paddingRight: padding,
          paddingTop: padding / 3,
          paddingBottom: padding / 3,
          borderRadius: 20,
          backgroundColor: "rgba(9, 9, 9, 0.85)",
        }}
      >
        {/**
         * Hardcoding the dark theme so the subtitles
         * appear white on the dark background.
         * We find captions don't look great on a light background.
         */}
        <Words segment={segment} startFrame={startFrame} theme={"dark"} />
      </span>
    </div>
  );
};
