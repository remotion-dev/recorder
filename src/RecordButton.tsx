import React, { useCallback } from "react";
import { FPS } from "../config/fps";
import { truthy } from "../remotion/helpers/truthy";
import { RecordCircle } from "./BlinkingCircle";
import { Button } from "./components/ui/button";
import { Prefix } from "./helpers/prefixes";
import {
  FinishedRecording,
  startMediaRecorder,
} from "./helpers/start-media-recorder";
import { useKeyPress } from "./helpers/use-key-press";

export type MediaSources = {
  [key in Prefix]: MediaStream | null;
};

type CurrentRecorder = {
  recorder: MediaRecorder;
  waitUntilDone: Promise<FinishedRecording>;
};

export type RecordingStatus =
  | {
      type: "idle";
    }
  | {
      type: "recording";
      ongoing: OngoingRecording;
    }
  | {
      type: "processing-recording";
    }
  | {
      type: "recording-finished";
      blobs: FinishedRecording[];
      expectedFrames: number;
      endDate: number;
    };

type OngoingRecording = {
  startDate: number;
  recorders: CurrentRecorder[];
};

export const RecordButton: React.FC<{
  recordingStatus: RecordingStatus;
  setRecordingStatus: React.Dispatch<React.SetStateAction<RecordingStatus>>;
  recordingDisabled: boolean;
  mediaSources: MediaSources;
}> = ({
  recordingDisabled,
  mediaSources,
  setRecordingStatus,
  recordingStatus,
}) => {
  const discardVideos = useCallback(() => {
    setRecordingStatus({ type: "idle" });
  }, [setRecordingStatus]);

  const start = useCallback(() => {
    const recorders = Object.entries(mediaSources)
      .map(([prefix, source]): CurrentRecorder | null => {
        if (!source) {
          return null;
        }

        return startMediaRecorder(prefix as Prefix, source);
      })
      .filter(truthy);

    return setRecordingStatus({
      type: "recording",
      ongoing: { recorders: recorders, startDate: Date.now() },
    });
  }, [mediaSources, setRecordingStatus]);

  const onStop = useCallback(async () => {
    if (recordingStatus.type !== "recording") {
      return;
    }

    setRecordingStatus({ type: "processing-recording" });

    for (const recorder of recordingStatus.ongoing.recorders) {
      recorder.recorder.stop();
    }

    const blobs = await Promise.all(
      recordingStatus.ongoing.recorders.map((r) => r.waitUntilDone),
    );

    const endDate = Date.now();
    const expectedFrames =
      ((endDate - recordingStatus.ongoing.startDate) / 1000) * FPS;

    setRecordingStatus({
      type: "recording-finished",
      blobs,
      expectedFrames,
      endDate,
    });
  }, [recordingStatus, setRecordingStatus]);

  const onPressR = useCallback(() => {
    if (mediaSources.webcam === null || !mediaSources.webcam.active) {
      return;
    }

    const dialog = document.querySelector('[role="dialog"]');

    if (
      (document.activeElement && document.activeElement.tagName === "input") ||
      dialog
    ) {
      return;
    }

    if (recordingStatus.type === "recording") {
      onStop();
    } else if (recordingStatus.type === "idle") {
      start();
    }
  }, [mediaSources.webcam, onStop, recordingStatus.type, start]);

  const onDiscardAndRetake = useCallback(() => {
    discardVideos();
    start();
  }, [discardVideos, start]);

  useKeyPress({ keys: ["r"], callback: onPressR, metaKey: false });

  if (
    recordingStatus.type === "recording" ||
    recordingStatus.type === "processing-recording"
  ) {
    return (
      <>
        <Button
          variant="outline"
          type="button"
          disabled={recordingStatus.type === "processing-recording"}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
          title="Press R to stop recording"
          onClick={onStop}
        >
          Stop recording
        </Button>
      </>
    );
  }

  if (recordingStatus.type === "recording-finished") {
    return (
      <Button
        variant="outline"
        type="button"
        style={{ display: "flex", alignItems: "center", gap: 10 }}
        title="Press R to start recording"
        onClick={onDiscardAndRetake}
      >
        <RecordCircle recordingDisabled={recordingDisabled} />
        Discard and retake
      </Button>
    );
  }

  return (
    <div
      title={
        recordingDisabled
          ? "A webcam and an audio source have to be selected to start the recording"
          : undefined
      }
    >
      <Button
        variant="outline"
        type="button"
        disabled={recordingDisabled}
        style={{ display: "flex", alignItems: "center", gap: 10 }}
        title="Press R to start recording"
        onClick={start}
      >
        <RecordCircle recordingDisabled={recordingDisabled} />
        Start recording
      </Button>
    </div>
  );
};
