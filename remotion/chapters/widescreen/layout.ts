import { getSafeSpace } from "../../../config/layout";
import type { VideoSceneAndMetadata } from "../../../config/scenes";
import {
  isWebCamAtBottom,
  isWebCamRight,
} from "../../animations/webcam-transitions";
import type { Layout } from "../../layout/layout-types";
export const getWidescreenChapterLayout = (
  scene: VideoSceneAndMetadata,
  tableOfContentHeight: number,
) => {
  const { layout, finalWebcamPosition } = scene;

  const rightAligned = isWebCamRight(finalWebcamPosition);
  const bottomAligned = isWebCamAtBottom(finalWebcamPosition);

  const chapterLayout: Layout = {
    height: 1000,
    borderRadius: 0,
    opacity: 1,
    ...(rightAligned
      ? {
          left: 0,
          width: layout.webcamLayout.left + layout.webcamLayout.width,
        }
      : { left: layout.webcamLayout.left, width: 100000 }),
    ...(bottomAligned
      ? {
          top:
            layout.webcamLayout.top -
            tableOfContentHeight -
            getSafeSpace("landscape"),
        }
      : {
          top:
            getSafeSpace("landscape") +
            layout.webcamLayout.top +
            layout.webcamLayout.height,
        }),
  };

  return chapterLayout;
};

export const getWidescreenChapterStyle = (
  scene: VideoSceneAndMetadata,
  tableOfContentHeight: number,
) => {
  const chapterLayout = getWidescreenChapterLayout(scene, tableOfContentHeight);

  const rightAligned = isWebCamRight(scene.finalWebcamPosition);

  const style: React.CSSProperties = {
    left: chapterLayout.left,
    top: chapterLayout.top,
    width: chapterLayout.width,
    height: chapterLayout.height,
    ...(rightAligned
      ? {
          alignSelf: "flex-end",
          alignItems: "flex-end",
        }
      : {}),
  };
  return style;
};
