import React, { useMemo } from "react";
import type { Theme } from "../../../../config/themes";
import { getHorizontalPaddingForSubtitles } from "../../processing/layout-captions";
import type { CaptionPage } from "../../types";
import { BoxedSingleWord } from "./SingleWord";

export const LINE_HEIGHT = 1.2;

export const SquareSubtitles: React.FC<{
  segment: CaptionPage;
  startFrame: number;
  theme: Theme;
  fontSize: number;
  lines: number;
}> = ({ segment, startFrame, theme, fontSize, lines }) => {
  const container: React.CSSProperties = useMemo(() => {
    return {
      height: lines * fontSize * LINE_HEIGHT,
    };
  }, [lines, fontSize]);

  const style: React.CSSProperties = useMemo(() => {
    return {
      lineHeight: LINE_HEIGHT,
      display: "inline-block",
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone",
      paddingLeft: getHorizontalPaddingForSubtitles(),
      paddingRight: getHorizontalPaddingForSubtitles(),
      wordBreak: "break-word",
      width: "100%",
    };
  }, []);

  return (
    <div style={container}>
      <span style={style}>
        {segment.words.map((word, index) => {
          return (
            <BoxedSingleWord
              key={word.firstTimestamp + word.text + index}
              isLast={index === segment.words.length - 1}
              word={word}
              theme={theme}
              startFrame={startFrame}
            />
          );
        })}
      </span>
    </div>
  );
};
