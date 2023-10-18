import type { Platform } from "../../configuration";

export const followButtonHeight = 140;

export const FollowButton: React.FC<{
  platform: Platform;
}> = ({ platform }) => {
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
      }}
    >
      {platform === "youtube"
        ? "Subscribe"
        : platform === "linkedin"
        ? "Connect"
        : "Follow"}
    </div>
  );
};
