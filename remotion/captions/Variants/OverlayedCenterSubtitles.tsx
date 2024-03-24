import type { Word } from "../../../config/autocorrect";
import type { CanvasLayout } from "../../../config/layout";
import type { Theme } from "../../../config/themes";
import { getHorizontalPaddingForSubtitles } from "../processing/postprocess-subs";
import type { Segment } from "../types";
import { WORD_HIGHLIGHT_BORDER_RADIUS } from "../Word";
import { Words } from "../Words";
import { LINE_HEIGHT } from "./BoxedSubtitles";

export const OverlayedCenterSubtitles: React.FC<{
  segment: Segment;
  startFrame: number;
  theme: Theme;
  onOpenSubEditor: (word: Word) => void;
  canvasLayout: CanvasLayout;
}> = ({ segment, startFrame, theme, canvasLayout, onOpenSubEditor }) => {
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
          paddingTop: padding,
          paddingBottom: padding,
          borderRadius: WORD_HIGHLIGHT_BORDER_RADIUS + padding,
        }}
      >
        <Words
          onOpenSubEditor={onOpenSubEditor}
          segment={segment}
          startFrame={startFrame}
          theme={theme}
        />
      </span>
    </div>
  );
};
