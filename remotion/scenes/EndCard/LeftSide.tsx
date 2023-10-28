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
import { COLORS } from "../../colors";
import type { Channel, Platform } from "../../configuration";
import { avatars, channels, transitionDuration } from "../../configuration";
import { FollowButton, followButtonHeight } from "./FollowButton";
import {
  InstagramIcon,
  LinkedInIcon,
  LinkIcon,
  XIcon,
  YouTubeIcon,
} from "./icons";

const Avatar: React.FC<{
  avatar: string;
}> = ({ avatar }) => {
  return (
    <Img
      style={{
        height: followButtonHeight,
        width: followButtonHeight,
        borderRadius: "50%",
        border: "6px solid " + COLORS.WORD_COLOR_ON_BG_APPEARED,
      }}
      src={avatar}
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
  avatar: string;
}> = ({ platform, avatar }) => {
  return (
    <div style={style}>
      <Avatar avatar={avatar} />
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
  color: COLORS.ENDCARD_TEXT_COLOR,
};

const IconRow: React.FC<{
  type: Platform | "link";
  label: string;
  opacity: number;
}> = ({ type, label, opacity }) => {
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
  const slideDuration = 30;

  const slideUp = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    delay: slideDelay,
    durationInFrames: slideDuration,
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

  const totalLinks = links.length + otherPlatforms.length;

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
        <FollowCTA avatar={avatars[channel]} platform={platform} />
      </div>
      <div ref={ref}>
        <div style={{ height: 80 }} />
        {otherPlatforms.map((p, i) => {
          const indexFromLast = links.length + otherPlatforms.length - i;
          const opacity = spring({
            fps,
            frame,
            config: {
              damping: 200,
            },
            delay:
              slideDelay +
              ((indexFromLast - 1) / totalLinks) * (slideDuration - 15),
            durationInFrames: 15,
          });

          return (
            <IconRow
              key={p.platform}
              opacity={opacity}
              type={p.platform}
              label={p.name}
            />
          );
        })}
        {links.length > 0 ? <div style={{ height: 80 }} /> : null}
        {links.map((l, i) => {
          const indexFromLast = links.length - i;
          const opacity = spring({
            fps,
            frame,
            config: {
              damping: 200,
            },
            delay:
              slideDelay +
              ((indexFromLast - 1) / totalLinks) * (slideDuration - 15),
            durationInFrames: 15,
          });

          return (
            <IconRow
              key={l.link}
              opacity={opacity}
              type="link"
              label={l.link}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
