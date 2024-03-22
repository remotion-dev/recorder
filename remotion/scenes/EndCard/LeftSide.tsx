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
import type { LinkType, Theme } from "../../../config/scenes";
import type { Channel, Platform } from "../../../config/socials";
import { avatars, channels } from "../../../config/socials";
import { TRANSITION_DURATION } from "../../../config/transitions";
import { COLORS } from "../../colors";
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
  theme: Theme;
}> = ({ avatar, theme }) => {
  return (
    <Img
      style={{
        height: followButtonHeight,
        width: followButtonHeight,
        borderRadius: "50%",
        border: "6px solid " + COLORS[theme].WORD_COLOR_ON_BG_APPEARED,
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
  theme: Theme;
  isLinkedInBusinessPage: boolean;
}> = ({ platform, avatar, theme, isLinkedInBusinessPage }) => {
  return (
    <div style={style}>
      <Avatar theme={theme} avatar={avatar} />
      <div style={{ width: spaceBetweenAvatarAndCta }} />
      <FollowButton
        theme={theme}
        platform={platform}
        isLinkedInBusinessPage={isLinkedInBusinessPage}
      />
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

const IconRow: React.FC<{
  type: Platform | "link";
  label: string;
  opacity: number;
  theme: Theme;
}> = ({ type, label, opacity, theme }) => {
  const labelStyle: React.CSSProperties = {
    fontSize: 50,
    fontFamily: "GT Planar",
    fontWeight: 500,
    marginLeft: 20,
    color: COLORS[theme].ENDCARD_TEXT_COLOR,
  };
  return (
    <div style={{ ...iconRow, opacity }}>
      <div style={iconContainer}>
        {type === "link" ? <LinkIcon theme={theme} height={60} /> : null}
        {type === "youtube" ? <YouTubeIcon theme={theme} height={60} /> : null}
        {type === "x" ? <XIcon theme={theme} height={60} /> : null}
        {type === "instagram" ? (
          <InstagramIcon theme={theme} height={70} />
        ) : null}
        {type === "linkedin" ? (
          <LinkedInIcon theme={theme} height={60} />
        ) : null}
      </div>
      <div style={{ width: spaceBetweenAvatarAndCta }} />
      <div style={labelStyle}>{label}</div>
    </div>
  );
};

export const LeftSide: React.FC<{
  platform: Platform;
  channel: Channel;
  links: LinkType[];
  theme: Theme;
}> = ({ platform, channel, links, theme }) => {
  const ref = useRef<HTMLDivElement>(null);
  const scaler = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender());
  const [contentHeight, setHeight] = useState(0);

  const { fps, width } = useVideoConfig();
  const frame = useCurrentFrame();

  const slideDelay = TRANSITION_DURATION + 20;
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

  const padding = 80;
  const maxWidth = width - padding * 2;
  return (
    <AbsoluteFill
      style={{
        left: 80,
        justifyContent: "center",
        maxWidth: Math.min(maxWidth, 1000),
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
        <FollowCTA
          theme={theme}
          avatar={avatars[channel]}
          platform={platform}
          isLinkedInBusinessPage={channels[channel].isLinkedInBusinessPage}
        />
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
              theme={theme}
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
              theme={theme}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
