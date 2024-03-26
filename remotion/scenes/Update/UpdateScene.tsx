import { Pie } from "@remotion/shapes";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TITLE_FONT_FAMILY, TITLE_FONT_WEIGHT } from "../../../config/fonts";
import { COLORS, Theme } from "../../../config/themes";

const size = 180;
const padding = 20;

const border = "7px solid transparent";

const square: React.CSSProperties = {
  width: size + padding * 2,
  height: size + padding * 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const squareWithBorder: React.CSSProperties = {
  ...square,
  borderRight: border,
};

const threeSquares: React.CSSProperties = {
  width: (size + padding * 2) * 3,
  height: size + padding * 2,
  display: "flex",
  alignItems: "center",
  flex: 1,
  justifyContent: "center",
  overflow: "hidden",
};

const row: React.CSSProperties = {
  flexDirection: "row",
  display: "flex",
  border,
};

const rowWithOutTopBorder: React.CSSProperties = {
  ...row,
  borderTop: "none",
};

const fatTitle: React.CSSProperties = {
  fontFamily: TITLE_FONT_FAMILY,
  fontSize: 140,
  lineHeight: 1,
  fontWeight: TITLE_FONT_WEIGHT,
};

type Icon = {
  viewBox: string;
  path: string;
};

type IconType = "check" | "bug" | "up" | "sparkles" | "info";

const icons: { [key in IconType]: Icon } = {
  check: {
    path: "M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z",
    viewBox: "0 0 448 512",
  },
  bug: {
    path: "M256 0c53 0 96 43 96 96v3.6c0 15.7-12.7 28.4-28.4 28.4H188.4c-15.7 0-28.4-12.7-28.4-28.4V96c0-53 43-96 96-96zM41.4 105.4c12.5-12.5 32.8-12.5 45.3 0l64 64c.7 .7 1.3 1.4 1.9 2.1c14.2-7.3 30.4-11.4 47.5-11.4H312c17.1 0 33.2 4.1 47.5 11.4c.6-.7 1.2-1.4 1.9-2.1l64-64c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-64 64c-.7 .7-1.4 1.3-2.1 1.9c6.2 12 10.1 25.3 11.1 39.5H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H416c0 24.6-5.5 47.8-15.4 68.6c2.2 1.3 4.2 2.9 6 4.8l64 64c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-63.1-63.1c-24.5 21.8-55.8 36.2-90.3 39.6V240c0-8.8-7.2-16-16-16s-16 7.2-16 16V479.2c-34.5-3.4-65.8-17.8-90.3-39.6L86.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l64-64c1.9-1.9 3.9-3.4 6-4.8C101.5 367.8 96 344.6 96 320H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96.3c1.1-14.1 5-27.5 11.1-39.5c-.7-.6-1.4-1.2-2.1-1.9l-64-64c-12.5-12.5-12.5-32.8 0-45.3z",
    viewBox: "0 0 512 512",
  },
  up: {
    path: "M169.4 41.4c12.5-12.5 32.8-12.5 45.3 0l160 160c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H256V440c0 22.1-17.9 40-40 40H168c-22.1 0-40-17.9-40-40V256H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l160-160z",
    viewBox: "0 0 384 512",
  },
  sparkles: {
    path: "M327.5 85.2c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L384 128l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L448 128l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L448 64 426.8 7.5C425.1 3 420.8 0 416 0s-9.1 3-10.8 7.5L384 64 327.5 85.2zM205.1 73.3c-2.6-5.7-8.3-9.3-14.5-9.3s-11.9 3.6-14.5 9.3L123.3 187.3 9.3 240C3.6 242.6 0 248.3 0 254.6s3.6 11.9 9.3 14.5l114.1 52.7L176 435.8c2.6 5.7 8.3 9.3 14.5 9.3s11.9-3.6 14.5-9.3l52.7-114.1 114.1-52.7c5.7-2.6 9.3-8.3 9.3-14.5s-3.6-11.9-9.3-14.5L257.8 187.4 205.1 73.3zM384 384l-56.5 21.2c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L384 448l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L448 448l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L448 384l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L384 384z",
    viewBox: "0 0 512 512",
  },
  info: {
    path: "M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336c-13.3 0-24 10.7-24 24s10.7 24 24 24h80c13.3 0 24-10.7 24-24s-10.7-24-24-24h-8V248c0-13.3-10.7-24-24-24H216c-13.3 0-24 10.7-24 24s10.7 24 24 24h24v64H216zm40-144a32 32 0 1 0 0-64 32 32 0 1 0 0 64z",
    viewBox: "0 0 512 512",
  },
};

const RandomPie: React.FC<{
  seed: string;
  type: IconType;
  theme: Theme;
}> = ({ seed, type, theme }) => {
  const frame = useCurrentFrame();
  const posterizedFrame = Math.floor(frame / 5) * 5 - random(seed) * 10;
  const rotation = random(seed);
  const progress =
    0.3 +
    random(seed + "1") * 0.7 +
    interpolate(posterizedFrame, [0, 60], [0, 1], {
      extrapolateLeft: "clamp",
    });

  const checkScale = interpolate(progress, [1, 1.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Pie
        stroke="black"
        strokeWidth={7}
        progress={Math.min(1, progress)}
        fill={COLORS[theme].ACCENT_COLOR}
        radius={size / 2}
        style={{
          position: "absolute",
          transform: `rotate(${rotation + posterizedFrame / 100}turn)`,
        }}
      />
      <svg
        height={size * 0.5}
        style={{
          position: "absolute",
          transform: `scale(${checkScale})`,
        }}
        viewBox={icons[type].viewBox}
      >
        <path fill="white" d={icons[type].path} />
      </svg>
    </div>
  );
};

export const UpdateScene: React.FC<{
  theme: Theme;
}> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const posterizedFrame = Math.floor(frame / 5) * 5;

  const prog = (delay: number) =>
    spring({
      fps,
      frame: posterizedFrame,
      config: {
        damping: 200,
      },
      durationInFrames: 60,
      delay,
    });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={row}>
        <div style={{ ...threeSquares, borderRight: border }}>
          <div
            style={{
              ...fatTitle,
              transform: `translateY(${interpolate(
                prog(0),
                [0, 1],
                [500, 0],
              )}px)`,
            }}
          >
            Remotion
          </div>
        </div>
        <div style={square}>
          <RandomPie theme={theme} seed="4" type="check" />
        </div>
      </div>
      <div style={rowWithOutTopBorder}>
        <div style={squareWithBorder}>
          <RandomPie theme={theme} seed="5" type="bug" />
        </div>
        <div style={squareWithBorder}>
          <RandomPie theme={theme} seed="6" type="check" />
        </div>
        <div style={squareWithBorder}>
          <RandomPie theme={theme} seed="8" type="sparkles" />
        </div>
        <div style={square}>
          <RandomPie theme={theme} seed="7" type="up" />
        </div>
      </div>
      <div style={rowWithOutTopBorder}>
        <div style={squareWithBorder}>
          <RandomPie theme={theme} seed="9" type="sparkles" />
        </div>
        <div style={threeSquares}>
          <div
            style={{
              ...fatTitle,
              transform: `translateX(${interpolate(
                prog(20),
                [0, 1],
                [700, 0],
              )}px)`,
            }}
          >
            Update
          </div>
        </div>
      </div>
      <div style={rowWithOutTopBorder}>
        <div style={squareWithBorder}>
          <RandomPie theme={theme} seed="13" type="info" />
        </div>
        <div style={squareWithBorder}>
          <RandomPie theme={theme} seed="14" type="bug" />
        </div>
        <div style={squareWithBorder}>
          <RandomPie theme={theme} seed="15" type="check" />
        </div>
        <div style={square}>
          <RandomPie theme={theme} seed="16" type="sparkles" />
        </div>
      </div>
    </AbsoluteFill>
  );
};
