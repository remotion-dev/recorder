import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { transitionDuration } from "../../configuration";
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
  fadeInDelay: number;
}> = ({ type, label, fadeInDelay }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [fadeInDelay, fadeInDelay + 10], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div style={{ ...iconRow, opacity }}>
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
  const ref = useRef<HTMLDivElement>(null);
  const scaler = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender());
  const [contentHeight, setHeight] = useState(0);

  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const slideDelay = transitionDuration + 20;

  const slideUp = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    delay: transitionDuration + 20,
  });

  useEffect(() => {
    const calc = () => {
      window.requestAnimationFrame(() => {
        const height = ref.current?.getBoundingClientRect().height as number;
        if (height === 0) {
          calc();
          return;
        }

        const scale =
          (scaler.current?.getBoundingClientRect().height as number) / 100;

        const scaled = height / scale;

        setHeight(scaled);
        continueRender(handle);
      });
    };

    calc();
  }, [handle]);

  return (
    <AbsoluteFill
      style={{
        left: 80,
        justifyContent: "center",
      }}
    >
      <div
        ref={scaler}
        style={{ height: 100, position: "absolute", top: -100000 }}
      />
      <div
        style={{
          transform: `translateY(${interpolate(
            slideUp,
            [0, 1],
            [contentHeight / 2, 0],
          )}px)`,
        }}
      >
        <FollowCTA />
      </div>
      <div ref={ref}>
        <div style={{ height: 80 }} />
        <IconRow
          fadeInDelay={slideDelay + 9}
          type="youtube"
          label="/JonnyBurger"
        />
        <IconRow
          fadeInDelay={slideDelay + 6}
          type="linkedin"
          label="Jonny Burger"
        />
        <div style={{ height: 80 }} />
        <IconRow
          fadeInDelay={slideDelay + 3}
          type="link"
          label="remotion.pro"
        />
        <IconRow
          fadeInDelay={slideDelay}
          type="link"
          label="remotion.dev/shapes"
        />
      </div>
    </AbsoluteFill>
  );
};
