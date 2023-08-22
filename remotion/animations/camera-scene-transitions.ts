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
  previous,
  canvasSize,
  canvasLayout,
}: {
  enter: number;
  exit: number;
  width: number;
  previous: { scene: SceneType; metadata: SceneMetadata } | null;
  scene: { scene: SceneType; metadata: SceneMetadata };
  next: { scene: SceneType; metadata: SceneMetadata } | null;
  canvasSize: Dimensions;
  canvasLayout: CanvasLayout;
}) => {
  const previousLayout =
    previous?.scene.type === "scene"
      ? getLayout({
          canvasLayout,
          canvasSize,
          display: previous.metadata.videos?.display as Dimensions,
          webcam: previous.metadata.videos?.webcam as Dimensions,
          webcamPosition: previous.scene.webcamPosition,
        }).displayLayout
      : null;

  const currentLayout =
    scene.scene.type === "scene"
      ? getLayout({
          canvasLayout,
          canvasSize,
          display: scene.metadata.videos?.display as Dimensions,
          webcam: scene.metadata.videos?.webcam as Dimensions,
          webcamPosition: scene.scene.webcamPosition,
        }).displayLayout
      : null;

  const nextLayout =
    next?.scene?.type === "scene"
      ? (getLayout({
          canvasLayout,
          canvasSize,
          display: next.metadata.videos?.display as Dimensions,
          webcam: next.metadata.videos?.webcam as Dimensions,
          webcamPosition: next.scene.webcamPosition,
        }).displayLayout as Layout)
      : null;

  const enterStartX =
    currentLayout && previousLayout
      ? previousLayout.x - currentLayout.x
      : width;

  const enterStartY =
    currentLayout && previousLayout
      ? previousLayout.y - currentLayout.y
      : width;

  const exitEndX =
    currentLayout && nextLayout ? nextLayout.x - currentLayout.x : -width;

  const exitEndY =
    currentLayout && nextLayout ? nextLayout.y - currentLayout.y : 0;

  const startOpacity = currentLayout && previousLayout ? 0 : 1;

  const enterX = interpolate(enter, [0, 1], [enterStartX, 0]);
  const enterY = interpolate(enter, [0, 1], [enterStartY, 0]);

  const exitX = interpolate(exit, [0, 1], [0, exitEndX]);
  const exitY = interpolate(exit, [0, 1], [0, exitEndY]);

  const opacity = interpolate(enter, [0, 0.5], [startOpacity, 1]);

  const translationX = enterX + exitX;
  const translationY = enterY + exitY;

  return { translationX, translationY, opacity };
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
