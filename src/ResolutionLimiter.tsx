import { DialogTitle } from "@radix-ui/react-dialog";
import React, { useCallback, useMemo } from "react";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "./components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { MaxResolution } from "./get-max-resolution-of-device";
import { VIDEO_SIZES, VideoSize } from "./helpers/get-selected-video-source";

const buttonStyle: React.CSSProperties = {
  display: "inline",
};

const iconStyle: React.CSSProperties = {
  width: 14,
  height: 14,
};

export const ResolutionLimiter: React.FC<{
  maxResolution: MaxResolution | null;
  sizeConstraint: VideoSize | null;
  setSizeConstraint: React.Dispatch<React.SetStateAction<VideoSize | null>>;
  deviceName: string;
}> = ({
  deviceName,
  maxResolution,
  sizeConstraint: videoConstraint,
  setSizeConstraint: setActiveVideoSize,
}) => {
  const [open, setOpen] = React.useState(false);

  const availableLowerResolutions = useMemo(() => {
    return Object.entries(VIDEO_SIZES).filter(([, value]) => {
      if (maxResolution === null) {
        return true;
      }
      return (
        (maxResolution.width === null || value.width <= maxResolution.width) &&
        (maxResolution.height === null || value.height <= maxResolution.height)
      );
    });
  }, [maxResolution]);

  const onValueChange = useCallback(
    (value: VideoSize | "full") => {
      if (value === "full") {
        setActiveVideoSize(null);
        return;
      }

      setActiveVideoSize(value);
    },
    [setActiveVideoSize],
  );

  const handleSubmit = useCallback(async () => {
    setOpen(false);
  }, []);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open);
  }, []);

  const fullResolutionLabel = useMemo(() => {
    if (maxResolution === null) {
      return "Full resolution";
    }
    const { width, height } = maxResolution;
    if (width && height) {
      return `Full resolution (${width}x${height})`;
    }
    if (width) {
      return `Full resolution (${width}p)`;
    }

    return "Full resolution";
  }, [maxResolution]);

  return (
    <>
      <div style={{ width: 4 }}></div>
      <button onClick={onOpen} style={buttonStyle}>
        <svg
          style={iconStyle}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="white"
            d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
          />
        </svg>
      </button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Limit resolution</DialogTitle>
            <DialogDescription>
              Constrain the resolution of {deviceName} to a lower value if you
              experience dropped frames.
            </DialogDescription>
          </DialogHeader>
          <Select onValueChange={onValueChange}>
            <SelectTrigger>
              <SelectValue
                placeholder={videoConstraint ?? fullResolutionLabel}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={"full"} value={"full"}>
                <span style={{ whiteSpace: "nowrap" }}>
                  {fullResolutionLabel}
                </span>
              </SelectItem>
              {availableLowerResolutions.map(([key]) => (
                <SelectItem key={key} value={key}>
                  <span style={{ whiteSpace: "nowrap" }}>Limit to {key}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
