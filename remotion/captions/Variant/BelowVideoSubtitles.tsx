import type { CanvasLayout } from "../../../config/layout";
import type { Theme } from "../../../config/themes";
import { getHorizontalPaddingForSubtitles } from "../processing/layout-captions";
import type { CaptionPage } from "../types";
import { Words } from "../Words";
import { LINE_HEIGHT } from "./SquareSubtitles";

export const BelowVideoSubtitles: React.FC<{
  segment: CaptionPage;
  startFrame: number;
  theme: Theme;
  canvasLayout: CanvasLayout;
  fontSize: number;
  lines: number;
}> = ({ segment, startFrame, theme, fontSize, canvasLayout, lines }) => {
  const padding = getHorizontalPaddingForSubtitles("below-video", canvasLayout);

  return (
    <div
      style={{
        height: lines * fontSize * LINE_HEIGHT,
        marginTop: 0,
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
        }}
      >
        <Words segment={segment} startFrame={startFrame} theme={theme} />
      </span>
    </div>
  );
};
