import { webReader } from "@remotion/media-parser/web";
import {
  ConvertMediaProgress,
  convertMedia,
  webcodecsController,
} from "@remotion/webcodecs";

export const convertInBrowser = ({
  src,
  onProgress,
}: {
  src: Blob;
  onProgress: (progress: ConvertMediaProgress, abort: () => void) => void;
}) => {
  const controller = webcodecsController();

  return convertMedia({
    container: "webm",
    src: new File([src.slice()], `temp`),
    reader: webReader,
    resize: {
      maxHeight: 1080,
      mode: "max-height",
    },
    onProgress: (progress) => {
      onProgress?.(progress, () => controller.abort());
    },
    controller: controller,
  });
};
