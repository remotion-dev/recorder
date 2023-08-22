import { interpolate } from "remotion";
import type {
  CanvasLayout,
  Dimensions,
  SceneMetadata,
  SceneType,
  WebcamPosition,
} from "../configuration";
import type { Layout } from "../layout/get-layout";
import { getLayout } from "../layout/get-layout";

export const getDisplayTranslation = ({
  enter,
  exit,
  width,
  scene,
  next,
  previousScene,
  canvasSize,
  canvasLayout,
}: {
  enter: number;
  exit: number;
  width: number;
  previous: { scene: SceneType; metadata: SceneMetadata } | null;
  scene: { scene: SceneType; metadata: SceneMetadata } | null;
  next: { scene: SceneType; metadata: SceneMetadata } | null;
  canvasSize: Dimensions;
  canvasLayout: CanvasLayout;
}) => {
  const enterX = interpolate(enter, [0, 1], [width, 0]);

  const exitEndX =
    next?.scene?.type === "scene"
      ? (
          getLayout({
            canvasLayout,
            canvasSize,
            display: next.metadata.videos?.display as Dimensions,
            webcam: next.metadata.videos?.webcam as Dimensions,
            webcamPosition: next.scene.webcamPosition,
          }).displayLayout as Layout
        ).x
      : -width;

  const exitX = interpolate(exit, [0, 1], [0, exitEndX]);

  const translationX = enterX + exitX + "px 0";
  const translationY = 0;

  return { translationX, translationY };
};

export const getWebcamTranslation = ({
  enter,
  exit,
  width,
  height,
  webcamPosition,
}: {
  enter: number;
  exit: number;
  width: number;
  height: number;
  webcamPosition: WebcamPosition;
}) => {
  const initialPosition =
    webcamPosition === "top-left" ||
    webcamPosition === "top-right" ||
    webcamPosition === "center"
      ? -height
      : height;

  const translationX = interpolate(exit, [0, 1], [0, -width]);
  const translationY = interpolate(enter, [0, 1], [initialPosition, 0]);
  return { translationX, translationY };
};

export const getSubtitleTranslation = ({
  enter,
  exit,
  width,
  height,
  webcamPosition,
}: {
  enter: number;
  exit: number;
  width: number;
  height: number;
  webcamPosition: WebcamPosition;
}) => {
  const initialPosition =
    webcamPosition === "top-left" ||
    webcamPosition === "top-right" ||
    webcamPosition === "center"
      ? -height
      : height;

  const translationX = interpolate(exit, [0, 1], [0, -width]);
  const translationY = interpolate(enter, [0, 1], [initialPosition, 0]);
  return { translationX, translationY };
};
