import type { Dimensions } from "@remotion/layout-utils";
import { getVideoMetadata } from "@remotion/media-utils";
import type { BRoll, BRollWithDimensions } from "../../../config/scenes";

const imageFileExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "ico",
];

const videoFileExtensions = ["mp4", "webm", "mov", "mkv"];

const getImageDimensions = (src: string): Promise<Dimensions> => {
  const img = new Image();
  img.src = src;
  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = reject;
  });
};

export const getBRollDimensions = async (
  bRoll: BRoll,
): Promise<BRollWithDimensions> => {
  if (imageFileExtensions.some((ext) => bRoll.source.endsWith(ext))) {
    const { width, height } = await getImageDimensions(bRoll.source);
    return {
      ...bRoll,
      type: "image",
      assetWidth: width,
      assetHeight: height,
    };
  }

  if (videoFileExtensions.some((ext) => bRoll.source.endsWith(ext))) {
    const metadata = await getVideoMetadata(bRoll.source);
    return {
      ...bRoll,
      type: "video",
      assetWidth: metadata.width,
      assetHeight: metadata.height,
    };
  }

  throw new Error(
    `Unsupported file extension for bRoll: ${bRoll.source}. Only ${[...imageFileExtensions, ...videoFileExtensions].join(", ")} are supported.`,
  );
};
