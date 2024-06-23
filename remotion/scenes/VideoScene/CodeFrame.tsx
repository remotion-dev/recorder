import { StaticFile } from "@remotion/studio";
import { HighlightedCode } from "codehike/code";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, cancelRender } from "remotion";
import { SCENE_TRANSITION_DURATION } from "../../../config/transitions";
import { Layout } from "../../layout/layout-types";
import { CodeTransition } from "./CodeTransition";
import { generateTwoslash } from "./generate-twoslash";

export const CodeFrame: React.FC<{
  displayLayout: Layout;
  code: StaticFile;
}> = ({ displayLayout, code }) => {
  const [slash, setSlash] = useState<HighlightedCode | null>(null);

  useEffect(() => {
    generateTwoslash(code)
      .then((slash) => {
        setSlash(slash);
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [code]);

  return (
    <AbsoluteFill
      style={{
        width: displayLayout.width,
        height: displayLayout.height,
        borderRadius: displayLayout.borderRadius,
        objectFit: "cover",
        backgroundColor: "black",
        paddingLeft: 50,
      }}
    >
      {slash ? (
        <CodeTransition
          newCode={slash}
          oldCode={null}
          durationInFrames={SCENE_TRANSITION_DURATION}
        ></CodeTransition>
      ) : null}
    </AbsoluteFill>
  );
};
