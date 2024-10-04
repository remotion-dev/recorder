import { Caption } from "@remotion/captions";

export type CaptionPage = {
  words: Caption[];
};

export type LayoutedCaptions = {
  segments: CaptionPage[];
};
