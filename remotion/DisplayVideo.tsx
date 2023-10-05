import type { StaticFile } from "remotion";
import { interpolate, OffthreadVideo, useVideoConfig } from "remotion";
import type { Pair } from "./configuration";
import type { Layout } from "./layout/get-layout";
import { borderRadius } from "./layout/get-layout";

export const DisplayVideo: React.FC<{
  displayLayout: Layout;
  enter: number;
  startFrom: number;
  endAt: number | undefined;
  pair: Pair;
}> = ({ displayLayout, enter, startFrom, endAt, pair }) => {
  const { width } = useVideoConfig();

  return (
    <div
      style={{
        width: displayLayout.width,
        height: displayLayout.height,
        left: displayLayout.x,
        top: displayLayout.y,
        position: "absolute",
        borderRadius,
        translate: interpolate(enter, [0, 1], [width, 0]) + "px 0",
      }}
    >
      <OffthreadVideo
        startFrom={startFrom}
        endAt={endAt}
        src={(pair.display as StaticFile).src}
        style={{
          maxWidth: "100%",
          borderRadius,
        }}
      />
    </div>
  );
};
