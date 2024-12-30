import { webFileReader } from "@remotion/media-parser/web-file";
import { ConvertMediaOnProgress, convertMedia } from "@remotion/webcodecs";

export const convertInBrowser = ({
  src,
  onProgress,
}: {
  src: Blob;
  onProgress: ConvertMediaOnProgress | undefined;
}) => {
  return convertMedia({
    container: "webm",
    src: new File([src.slice()], `temp`),
    reader: webFileReader,
    resize: {
      maxHeight: 1080,
      mode: "max-height",
    },
    onProgress,
  });
};
