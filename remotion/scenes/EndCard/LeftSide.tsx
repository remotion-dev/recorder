import React from "react";
import { AbsoluteFill, Img } from "remotion";
import {
  InstagramIcon,
  LinkedInIcon,
  LinkIcon,
  XIcon,
  YouTubeIcon,
} from "./icons";

const height = 140;

const Avatar: React.FC = () => {
  return (
    <Img
      style={{
        height,
        width: height,
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

const FollowButton: React.FC = () => {
  return (
    <div
      style={{
        height,
        borderRadius: height / 2,
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
  width: height,
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
