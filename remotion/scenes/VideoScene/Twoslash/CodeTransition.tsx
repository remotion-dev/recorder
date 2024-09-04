import { AnnotationHandler, HighlightedCode, Pre } from "codehike/code";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  continueRender,
  delayRender,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import {
  calculateTransitions,
  getStartingSnapshot,
  TokenTransitionsSnapshot,
} from "codehike/utils/token-transitions";

import { loadFont } from "@remotion/google-fonts/RobotoMono";
import { CanvasLayout } from "../../../../config/layout";
import { applyStyle } from "./apply-style";
import { callout } from "./Callout";
import { inlineBlockTokens } from "./InlineBlockTokens";
const { fontFamily } = loadFont();

export function CodeTransition({
  oldCode,
  newCode,
  durationInFrames,
  canvasLayout,
}: {
  oldCode: HighlightedCode | null;
  newCode: HighlightedCode;
  durationInFrames: number;
  canvasLayout: CanvasLayout;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ref = React.useRef<HTMLPreElement>(null);
  const [oldSnapshot, setOldSnapshot] =
    useState<TokenTransitionsSnapshot | null>(null);
  const [handle] = React.useState(() => delayRender());

  const prevCode: HighlightedCode = useMemo(() => {
    return oldCode || { ...newCode, tokens: [], annotations: [] };
  }, [newCode, oldCode]);

  const code = useMemo(() => {
    return oldSnapshot ? newCode : prevCode;
  }, [newCode, prevCode, oldSnapshot]);

  useEffect(() => {
    if (!oldSnapshot) {
      setOldSnapshot(getStartingSnapshot(ref.current!));
    }
  }, [oldSnapshot]);

  useLayoutEffect(() => {
    if (!oldSnapshot) {
      setOldSnapshot(getStartingSnapshot(ref.current!));
      return;
    }
    const transitions = calculateTransitions(ref.current!, oldSnapshot);
    transitions.forEach(({ element, keyframes, options }) => {
      const delay = durationInFrames * options.delay;
      const duration = durationInFrames * options.duration;

      const progress = spring({
        fps,
        frame,
        config: {
          damping: 200,
          mass: 0.3,
        },
        delay: delay,
        durationInFrames: duration,
      });

      applyStyle({
        element,
        keyframes,
        progress,
      });
    });
    continueRender(handle);
  });

  const handlers: AnnotationHandler[] = useMemo(() => {
    return [inlineBlockTokens, callout];
  }, []);

  const style: React.CSSProperties = useMemo(() => {
    return {
      position: "relative",
      fontSize: canvasLayout === "landscape" ? 60 : 30,
      lineHeight: 1.5,
      fontFamily,
    };
  }, [canvasLayout]);

  return <Pre ref={ref} code={code} handlers={handlers} style={style} />;
}
