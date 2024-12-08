/**
 * Configure the social media channels that you can display in the endcard here.
 * and the links that you can show.
 */

import { staticFile } from "remotion";
import { z } from "zod";

// TODO: 1. Replace with your own channels (e.g personal and company)
export const brand = z.enum(["jonny", "remotion"]);
export type Brand = z.infer<typeof brand>;

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
	[key in Brand]: ChannelConfig & {
		isLinkedInBusinessPage: boolean;
	};
} = {
	// TODO: 2. Fill out the socials
	jonny: {
		instagram: "algomaxproject",
		linkedin: "Virgile RIETSCH",
		x: "@Varkoffs",
		youtube: "/@algomax-dev",
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

// TODO: 3. Add your own avatars
export const avatars: { [key in Brand]: string } = {
	jonny:
		"https://algomax.fr/api/image?src=%2Fimages%2Fme-converted.webp&width=400&height=400&fit=cover&position=center&background[]=0&background[]=0&background[]=0&background[]=0&quality=80&compressionLevel=9&loop=0&delay=100&crop=null&contentType=image%2Fwebp",
	remotion: staticFile("remotion.png"),
};

export const linkType = z.object({
	link: z.string(),
});

export type LinkType = z.infer<typeof linkType>;
