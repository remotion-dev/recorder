import { interpolate } from "remotion";
import type { WebcamPosition } from "../configuration";
import type { Layout } from "../layout/get-layout";

export const getDisplayTranslation = ({
  enter,
  exit,
  width,
  nextLayout,
  previousLayout,
  currentLayout,
}: {
  enter: number;
  exit: number;
  width: number;
  previousLayout: Layout | null;
  nextLayout: Layout | null;
  currentLayout: Layout | null;
}) => {
  const enterStartX =
    currentLayout && previousLayout
      ? previousLayout.x - currentLayout.x
      : width;

  const enterStartY =
    currentLayout && previousLayout ? previousLayout.y - currentLayout.y : 0;

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

  return {
    translationX: Math.round(translationX),
    translationY: Math.round(translationY),
    opacity,
  };
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
