import { webFileReader } from "@remotion/media-parser/web-file";
import { ConvertMediaProgress, convertMedia } from "@remotion/webcodecs";

export const convertInBrowser = ({
  src,
  onProgress,
}: {
  src: Blob;
  onProgress: (progress: ConvertMediaProgress, abort: () => void) => void;
}) => {
  const controller = new AbortController();
  return convertMedia({
    container: "webm",
    src: new File([src.slice()], `temp`),
    reader: webFileReader,
    resize: {
      maxHeight: 1080,
      mode: "max-height",
    },
    onProgress: (progress) => {
      onProgress?.(progress, () => controller.abort());
    },
    signal: controller.signal,
  });
};
