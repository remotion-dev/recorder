import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const followButtonHeight = 140;

export const FollowButton: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const squash = spring({
    fps,
    frame,
    durationInFrames: 40,
    delay: 30,
  });

  const scaleX =
    interpolate(squash, [1, 2], [1, 1.1], {
      extrapolateLeft: "clamp",
    }) +
    Math.max(squash, 1) -
    1;
  const scaleY = interpolate(squash, [1, 2], [1, 0.3], {
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        height: followButtonHeight,
        borderRadius: followButtonHeight / 2,
        width: 400,
        backgroundColor: "black",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "GT Planar",
        fontSize: 50,
        fontWeight: 500,
        transform: `scale(${scaleX}, ${scaleY})`,
      }}
    >
      Follow
    </div>
  );
};
