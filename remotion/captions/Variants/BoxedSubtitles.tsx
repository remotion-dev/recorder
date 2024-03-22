import type { CanvasLayout } from "../../../config/layout";
import type { Theme } from "../../../config/themes";
import type { Layout } from "../../layout/layout-types";
import { getHorizontalPaddingForSubtitles } from "../processing/postprocess-subs";
import { getSubtitlesFontSize, getSubtitlesLines } from "../Segment";
import type { Segment, Word } from "../types";
import { Words } from "../Words";

export const LINE_HEIGHT = 1.2;

export const BoxedSubtitles: React.FC<{
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
  const padding = getHorizontalPaddingForSubtitles("boxed", canvasLayout);

  return (
    <div
      style={{
        height:
          getSubtitlesLines("boxed") *
          getSubtitlesFontSize("boxed", displayLayout) *
          LINE_HEIGHT,
        marginTop: -5,
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
