import { Dimensions } from "@remotion/layout-utils";
import React, { useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { VIDEO_SIZES, VideoSize } from "./helpers/get-selected-video-source";

export const ResolutionLimiter: React.FC<{
  activeResolution: Dimensions;
  sizeConstraint: VideoSize | null;
  setSizeConstraint: React.Dispatch<React.SetStateAction<VideoSize | null>>;
}> = ({
  activeResolution,
  sizeConstraint: videoConstraint,
  setSizeConstraint: setActiveVideoSize,
}) => {
  const availableLowerResolutions = useMemo(() => {
    return Object.entries(VIDEO_SIZES).filter(([, value]) => {
      return (
        value.width <= activeResolution.width &&
        value.height <= activeResolution.height
      );
    });
  }, [activeResolution.height, activeResolution.width]);

  const onValueChange = useCallback(
    (value: VideoSize | "full") => {
      if (value === "full") {
        setActiveVideoSize(null);
        return;
      } else {
        setActiveVideoSize(value);
      }
    },
    [setActiveVideoSize],
  );

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={videoConstraint ?? "Full resolution"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key={"full"} value={"full"}>
          <span style={{ whiteSpace: "nowrap" }}>Full resolution</span>
        </SelectItem>
        {availableLowerResolutions.map(([key]) => (
          <SelectItem key={key} value={key}>
            <span style={{ whiteSpace: "nowrap" }}>{key}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
