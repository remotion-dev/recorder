import { Cameras } from "../../config/scenes";

export const hasDisplay = (cameras: Cameras): boolean => {
  return cameras.display !== null || cameras.code !== null;
};
