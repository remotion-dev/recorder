import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const FadeSentence: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, 5, Math.max(6, durationInFrames - 5), Math.max(7, durationInFrames)],
    [0, 1, 1, 0],
    {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    },
  );

  return <div style={{ opacity }}>{children}</div>;
};
