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
import { useMediaSources } from "./state/media-sources";

export type CurrentRecorder = {
  recorder: MediaRecorder;
  stopAndWaitUntilDone: () => Promise<FinishedRecording>;
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
}> = ({ recordingDisabled, setRecordingStatus, recordingStatus }) => {
  const discardVideos = useCallback(async () => {
    if (recordingStatus.type !== "recording-finished") {
      throw new Error("Recording not finished");
    }
    for (const blob of recordingStatus.blobs) {
      await blob.releaseData();
    }

    setRecordingStatus({ type: "idle" });
  }, [recordingStatus, setRecordingStatus]);

  const mediaSources = useMediaSources().mediaSources;

  const start = useCallback(async () => {
    const startDate = Date.now();
    const recorders = (
      await Promise.all(
        Object.entries(mediaSources).map(
          ([prefix, source]): Promise<CurrentRecorder | null> => {
            if (source.streamState.type !== "loaded") {
              return Promise.resolve(null);
            }

            return startMediaRecorder({
              prefix: prefix as Prefix,
              source: source.streamState,
              timestamp: startDate,
            });
          },
        ),
      )
    ).filter(truthy);

    return setRecordingStatus({
      type: "recording",
      ongoing: { recorders: recorders, startDate },
    });
  }, [mediaSources, setRecordingStatus]);

  const onStop = useCallback(async () => {
    if (recordingStatus.type !== "recording") {
      return;
    }

    const blobs = await Promise.all(
      recordingStatus.ongoing.recorders.map((r) => r.stopAndWaitUntilDone()),
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
    if (recordingDisabled) {
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
  }, [onStop, recordingDisabled, recordingStatus.type, start]);

  const onDiscardAndRetake = useCallback(() => {
    discardVideos();
    start();
  }, [discardVideos, start]);

  useKeyPress({ keys: ["r"], callback: onPressR, metaKey: false });

  if (recordingStatus.type === "recording") {
    return (
      <>
        <Button
          variant="outline"
          type="button"
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
