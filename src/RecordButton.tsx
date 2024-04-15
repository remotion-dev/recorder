import type { SetStateAction } from "react";
import React, { useCallback } from "react";
import { BlinkingCircle, RecordCircle } from "./BlinkingCircle";
import { Button } from "./components/ui/button";
import { Timer } from "./Timer";
import type { prefixes } from "./Views";

export type MediaSources = {
  [key in (typeof prefixes)[number]]: MediaStream | null;
};

export const RecordButton: React.FC<{
  readonly recording: false | number;
  readonly start: () => void;
  readonly stop: () => void;
  readonly setShowHandleVideos: React.Dispatch<SetStateAction<boolean>>;
  readonly showHandleVideos: boolean;
  readonly recordingDisabled: boolean;
  readonly onDiscard: () => void;
}> = ({
  recording,
  stop,
  setShowHandleVideos,
  showHandleVideos,
  start,
  recordingDisabled,
  onDiscard,
}) => {
  const disabled = recordingDisabled || recording !== false || showHandleVideos;

  const onStop = useCallback(() => {
    stop();
    setShowHandleVideos(true);
  }, [setShowHandleVideos, stop]);

  if (recording) {
    return (
      <>
        <Button
          variant={"outline"}
          type="button"
          disabled={!recording}
          onClick={onStop}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
          title="Press R to stop recording"
        >
          Stop recording
        </Button>
        <BlinkingCircle />
        <Timer recording={recording} />
      </>
    );
  }

  if (showHandleVideos) {
    return (
      <Button
        variant={"outline"}
        type="button"
        onClick={onDiscard}
        style={{ display: "flex", alignItems: "center", gap: 10 }}
        title="Press R to start recording"
      >
        <RecordCircle recordingDisabled={recordingDisabled} />
        Discard and retake
      </Button>
    );
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
        <RecordCircle recordingDisabled={recordingDisabled} />
        Start recording
      </Button>
    </div>
  );
};
