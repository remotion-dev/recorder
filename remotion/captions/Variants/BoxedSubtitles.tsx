import type { Word } from "../../../config/autocorrect";
import type { CanvasLayout } from "../../../config/layout";
import type { Theme } from "../../../config/themes";
import { getHorizontalPaddingForSubtitles } from "../processing/postprocess-subs";
import { getSubtitlesLines } from "../Segment";
import type { Segment } from "../types";
import { Words } from "../Words";

export const LINE_HEIGHT = 1.2;

export const BoxedSubtitles: React.FC<{
  segment: Segment;
  startFrame: number;
  theme: Theme;
  onOpenSubEditor: (word: Word) => void;
  canvasLayout: CanvasLayout;
  captionBoxHeight: number;
  fontSize: number;
}> = ({
  segment,
  startFrame,
  theme,
  canvasLayout,
  onOpenSubEditor,
  captionBoxHeight,
  fontSize,
}) => {
  const padding = getHorizontalPaddingForSubtitles("boxed", canvasLayout);

  return (
    <div
      style={{
        height:
          getSubtitlesLines({
            subtitleType: "boxed",
            boxHeight: captionBoxHeight,
            fontSize,
          }) *
          fontSize *
          LINE_HEIGHT,
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
