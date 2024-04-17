import { interpolate } from "remotion";
import type { Layout } from "../layout/layout-types";

export const interpolateLayout = (
  firstLayout: Layout,
  secondLayout: Layout,
  progress: number,
) => {
  const enterX = interpolate(
    progress,
    [0, 1],
    [firstLayout.left, secondLayout.left],
  );
  const enterY = interpolate(
    progress,
    [0, 1],
    [firstLayout.top, secondLayout.top],
  );
  const enterWidth = interpolate(
    progress,
    [0, 1],
    [firstLayout.width, secondLayout.width],
  );
  const enterHeight = interpolate(
    progress,
    [0, 1],
    [firstLayout.height, secondLayout.height],
  );
  const borderRadius = interpolate(
    progress,
    [0, 1],
    [firstLayout.borderRadius, secondLayout.borderRadius],
  );
  const opacity = interpolate(
    progress,
    [0, 1],
    [firstLayout.opacity, secondLayout.opacity],
  );

  return {
    left: enterX,
    top: enterY,
    width: enterWidth,
    height: enterHeight,
    borderRadius,
    opacity,
  };
};

export const interpolateLayoutAndFade = (
  firstLayout: Layout,
  secondLayout: Layout,
  progress: number,
  shouldFade: boolean,
) => {
  const layout = interpolateLayout(firstLayout, secondLayout, progress);

  return {
    ...layout,
    opacity: shouldFade ? (progress > 0.5 ? 1 : 0) : 1,
  };
};
