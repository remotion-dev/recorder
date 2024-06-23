import { StaticFile } from "@remotion/studio";
import { HighlightedCode } from "codehike/code";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, cancelRender } from "remotion";
import { SCENE_TRANSITION_DURATION } from "../../../config/transitions";
import { Layout } from "../../layout/layout-types";
import { CodeTransition } from "./CodeTransition";
import { generateTwoslash } from "./generate-twoslash";

type State = {
  code: HighlightedCode;
  oldCode: HighlightedCode | null;
};

export const CodeFrame: React.FC<{
  displayLayout: Layout;
  code: StaticFile;
  oldCode: StaticFile | null;
}> = ({ displayLayout, code, oldCode }) => {
  const [slash, setSlash] = useState<State | null>(null);

  useEffect(() => {
    Promise.all([generateTwoslash(code), generateTwoslash(oldCode)])
      .then(([newSlash, oldSlash]) => {
        setSlash({
          code: newSlash as HighlightedCode,
          oldCode: oldSlash,
        });
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [code, oldCode]);

  return (
    <AbsoluteFill
      style={{
        width: displayLayout.width,
        height: displayLayout.height,
        borderRadius: displayLayout.borderRadius,
        objectFit: "cover",
        backgroundColor: "#24292F",
        paddingLeft: 50,
        paddingRight: 50,
        overflow: "hidden",
      }}
    >
      {slash ? (
        <CodeTransition
          newCode={slash.code}
          oldCode={slash.oldCode}
          durationInFrames={SCENE_TRANSITION_DURATION}
        ></CodeTransition>
      ) : null}
    </AbsoluteFill>
  );
};
