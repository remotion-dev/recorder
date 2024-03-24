import type { Word } from "../../../config/autocorrect";
import type { CanvasLayout } from "../../../config/layout";
import type { Theme } from "../../../config/themes";
import type { Layout } from "../../layout/layout-types";
import { getHorizontalPaddingForSubtitles } from "../processing/postprocess-subs";
import { getSubtitlesFontSize, getSubtitlesLines } from "../Segment";
import type { Segment } from "../types";
import { Words } from "../Words";
import { LINE_HEIGHT } from "./BoxedSubtitles";

export const BelowVideoSubtitles: React.FC<{
  segment: Segment;
  startFrame: number;
  theme: Theme;
  displayLayout: Layout | null;
  onOpenSubEditor: (word: Word) => void;
  canvasLayout: CanvasLayout;
}> = ({
  segment,
  startFrame,
  theme,
  displayLayout,
  canvasLayout,
  onOpenSubEditor,
}) => {
  const padding = getHorizontalPaddingForSubtitles("below-video", canvasLayout);

  return (
    <div
      style={{
        height:
          getSubtitlesLines("below-video") *
          getSubtitlesFontSize("below-video", displayLayout) *
          LINE_HEIGHT,
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
