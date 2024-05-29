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
import { MaxResolution } from "./helpers/get-max-resolution-of-device";
import { VIDEO_SIZES, VideoSize } from "./helpers/get-selected-video-source";

const buttonStyle: React.CSSProperties = {
  display: "inline",
  color: "rgba(255, 255, 255, 0.5)",
  borderBottom: "1px solid",
};

export const ResolutionLimiter: React.FC<{
  maxResolution: MaxResolution | null;
  sizeConstraint: VideoSize | null;
  setSizeConstraint: (val: VideoSize | null) => void;
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

  const onOpen: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.stopPropagation();
      setOpen(true);
    },
    [],
  );

  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open);
  }, []);

  const fullResolutionLabel = useMemo(() => {
    if (maxResolution === null) {
      return "Full resolution";
    }
    const { width, height } = maxResolution;
    if (width && !height) {
      return `Full resolution (${width}p)`;
    }

    return "Full resolution";
  }, [maxResolution]);

  return (
    <>
      <div style={{ width: 4 }}></div>
      <button onClick={onOpen} style={buttonStyle}>
        Change
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
                <span
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
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
