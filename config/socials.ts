/**
 * Configure the social media channels that you can display in the endcard here.
 */

import { staticFile } from "remotion";
import { z } from "zod";

export const channel = z.enum(["jonny", "remotion"]);
export type Channel = z.infer<typeof channel>;

export const platform = z.enum([
  "youtube",
  "linkedin",
  "instagram",
  "discord",
  "x",
]);

export type Platform = z.infer<typeof platform>;

type ChannelConfig = { [key in Platform]: string | null };

export const channels: {
  [key in Channel]: ChannelConfig & {
    isLinkedInBusinessPage: boolean;
  };
} = {
  jonny: {
    instagram: null,
    linkedin: "Jonny Burger",
    x: "@JNYBGR",
    youtube: "/JonnyBurger",
    discord: null,
    isLinkedInBusinessPage: false,
  },
  remotion: {
    instagram: "@remotion",
    linkedin: "Remotion",
    x: "@remotion",
    youtube: "@remotion_dev",
    discord: null,
    isLinkedInBusinessPage: true,
  },
};

export const avatars: { [key in Channel]: string } = {
  jonny: "https://jonny.io/avatar.png",
  remotion: staticFile("logo-on-white.png"),
};
