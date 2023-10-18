import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { FollowButton, followButtonHeight } from "./FollowButton";
import {
  InstagramIcon,
  LinkedInIcon,
  LinkIcon,
  XIcon,
  YouTubeIcon,
} from "./icons";

const Avatar: React.FC = () => {
  return (
    <Img
      style={{
        height: followButtonHeight,
        width: followButtonHeight,
        borderRadius: "50%",
        border: "6px solid black",
      }}
      src="https://jonny.io/avatar.png"
    />
  );
};

const style: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
};

const spaceBetweenAvatarAndCta = 30;

const FollowCTA: React.FC = () => {
  return (
    <div style={style}>
      <Avatar />
      <div style={{ width: spaceBetweenAvatarAndCta }} />
      <FollowButton />
    </div>
  );
};

const iconContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 60,
  width: followButtonHeight,
};

const iconRow: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  paddingTop: 20,
  paddingBottom: 20,
};

const labelStyle: React.CSSProperties = {
  fontSize: 50,
  fontFamily: "GT Planar",
  fontWeight: 500,
  marginLeft: 20,
};

const IconRow: React.FC<{
  type: "youtube" | "linkedin" | "instagram" | "x" | "link";
  label: string;
}> = ({ type, label }) => {
  return (
    <div style={iconRow}>
      <div style={iconContainer}>
        {type === "link" ? <LinkIcon height={60} /> : null}
        {type === "youtube" ? <YouTubeIcon height={60} /> : null}
        {type === "x" ? <XIcon height={60} /> : null}
        {type === "instagram" ? <InstagramIcon height={70} /> : null}
        {type === "linkedin" ? <LinkedInIcon height={60} /> : null}
      </div>
      <div style={{ width: spaceBetweenAvatarAndCta }} />
      <div style={labelStyle}>{label}</div>
    </div>
  );
};

export const LeftSide: React.FC<{}> = () => {
  return (
    <AbsoluteFill
      style={{
        left: 80,
        justifyContent: "center",
      }}
    >
      <FollowCTA />
      <div style={{ height: 80 }} />
      <IconRow type="youtube" label="/JonnyBurger" />
      <IconRow type="linkedin" label="Jonny Burger" />
      <div style={{ height: 80 }} />
      <IconRow type="link" label="remotion.pro" />
      <IconRow type="link" label="remotion.dev/shapes" />
    </AbsoluteFill>
  );
};
