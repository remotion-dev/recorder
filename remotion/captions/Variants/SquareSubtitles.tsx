import type { CanvasLayout } from "../../../config/layout";
import type { Theme } from "../../../config/themes";
import { getHorizontalPaddingForSubtitles } from "../processing/postprocess-subs";
import type { Segment } from "../types";
import { Words } from "../Words";

export const LINE_HEIGHT = 1.2;

export const SquareSubtitles: React.FC<{
  segment: Segment;
  startFrame: number;
  theme: Theme;
  canvasLayout: CanvasLayout;
  fontSize: number;
  lines: number;
}> = ({ segment, startFrame, theme, canvasLayout, fontSize, lines }) => {
  const padding = getHorizontalPaddingForSubtitles("square", canvasLayout);

  return (
    <div
      style={{
        height: lines * fontSize * LINE_HEIGHT,
      }}
    >
      <span
        style={{
          lineHeight: LINE_HEIGHT,
          display: "inline-block",
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
          paddingLeft: padding,
          paddingRight: padding,
          wordBreak: "break-word",
          width: "100%",
        }}
      >
        <Words segment={segment} startFrame={startFrame} theme={theme} />
      </span>
    </div>
  );
};
