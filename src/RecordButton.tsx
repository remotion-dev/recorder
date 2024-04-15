import type { SetStateAction } from "react";
import React from "react";
import { BlinkingCircle, RecordCircle } from "./BlinkingCircle";
import { Button } from "./components/ui/button";
import { formatTime } from "./format-time";

export const RecordButton: React.FC<{
  readonly recording: false | number;
  readonly start: () => void;
  readonly stop: () => void;
  readonly disabledByParent: boolean;
  readonly setShowHandleVideos: React.Dispatch<SetStateAction<boolean>>;
  readonly showHandleVideos: boolean;
}> = ({
  recording,
  stop,
  disabledByParent,
  setShowHandleVideos,
  showHandleVideos,
  start,
}) => {
  const disabled = disabledByParent || recording !== false || showHandleVideos;

  if (recording) {
    return (
      <>
        <Button
          variant={"outline"}
          type="button"
          disabled={!recording}
          onClick={() => {
            stop();
            setShowHandleVideos(true);
          }}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
          title="Press R to stop recording"
        >
          Stop recording
        </Button>
        <BlinkingCircle />
        {formatTime(Date.now() - recording)}
      </>
    );
  }

  if (showHandleVideos) {
    return null;
  }

  return (
    <div
      title={
        disabled
          ? "A webcam has to be selected to start the recording"
          : undefined
      }
    >
      <Button
        variant={"outline"}
        type="button"
        disabled={disabled}
        onClick={start}
        style={{ display: "flex", alignItems: "center", gap: 10 }}
        title="Press R to start recording"
      >
        <RecordCircle disabledByParent={disabledByParent} />
        Start recording
      </Button>
    </div>
  );
};
