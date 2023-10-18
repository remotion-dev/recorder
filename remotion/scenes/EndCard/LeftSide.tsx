import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { z } from "zod";
import type { Channel, Platform } from "../../configuration";
import { channels, transitionDuration } from "../../configuration";
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

const FollowCTA: React.FC<{
  platform: Platform;
}> = ({ platform }) => {
  return (
    <div style={style}>
      <Avatar />
      <div style={{ width: spaceBetweenAvatarAndCta }} />
      <FollowButton platform={platform} />
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
  type: Platform | "link";
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

export const linkType = z.object({
  link: z.string(),
});

export type LinkType = z.infer<typeof linkType>;

export const LeftSide: React.FC<{
  platform: Platform;
  channel: Channel;
  links: LinkType[];
}> = ({ platform, channel, links }) => {
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

  const otherPlatforms = useMemo(() => {
    const configs: {
      name: string;
      platform: Platform;
    }[] = [];

    for (const c in channels[channel]) {
      const name = channels[channel][c as Platform];
      if (!name) {
        continue;
      }

      if (c === platform) {
        continue;
      }

      configs.push({
        name,
        platform: c as Platform,
      });
    }

    return configs;
  }, [channel, platform]);

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
        <FollowCTA platform={platform} />
      </div>
      <div ref={ref}>
        <div style={{ height: 80 }} />
        {otherPlatforms.map((p, i) => {
          return (
            <IconRow
              key={p.platform}
              fadeInDelay={
                slideDelay + (links.length + otherPlatforms.length - i) * 3
              }
              type={p.platform}
              label={p.name}
            />
          );
        })}
        {links.length > 0 ? <div style={{ height: 80 }} /> : null}
        {links.map((l, i) => {
          return (
            <IconRow
              key={l.link}
              fadeInDelay={slideDelay + (links.length - i) * 3}
              type="link"
              label={l.link}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
