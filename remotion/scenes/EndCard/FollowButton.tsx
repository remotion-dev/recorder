export const followButtonHeight = 140;

export const FollowButton: React.FC = () => {
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
      Follow
    </div>
  );
};
