import React, { useCallback, useState } from "react";
import { WEBCAM_PREFIX } from "../config/cameras";
import { BlinkingCircle, RecordCircle } from "./BlinkingCircle";
import { Button } from "./components/ui/button";
import type { CurrentBlobs } from "./components/UseThisTake";
import { currentBlobsInitialState } from "./components/UseThisTake";
import { useKeyPress } from "./helpers/use-key-press";
import { Timer } from "./Timer";
import type { prefixes } from "./Views";

export type MediaSources = {
  [key in (typeof prefixes)[number]]: MediaStream | null;
};

const mediaRecorderOptions: MediaRecorderOptions = {
  audioBitsPerSecond: 128000,
  videoBitsPerSecond: 8 * 4000000,
};

let endDate = 0;

export const RecordButton: React.FC<{
  recording: false | number;
  setRecording: React.Dispatch<React.SetStateAction<false | number>>;
  recordingDisabled: boolean;
  setCurrentBlobs: React.Dispatch<React.SetStateAction<CurrentBlobs>>;
  mediaSources: MediaSources;
  showHandleVideos: boolean;
  setShowHandleVideos: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  recording,
  showHandleVideos,
  recordingDisabled,
  mediaSources,
  setCurrentBlobs,
  setShowHandleVideos,
  setRecording,
}) => {
  const [recorders, setRecorders] = useState<MediaRecorder[] | null>(null);

  const discardVideos = useCallback(() => {
    setCurrentBlobs(currentBlobsInitialState);
  }, [setCurrentBlobs]);

  const start = useCallback(() => {
    setRecording(() => Date.now());
    const toStart = [];
    const newRecorders: MediaRecorder[] = [];
    for (const [prefix, source] of Object.entries(mediaSources)) {
      if (!source) {
        continue;
      }

      const mimeType =
        prefix === WEBCAM_PREFIX
          ? "video/webm;codecs=vp8,opus"
          : "video/webm;codecs=vp8";

      const completeMediaRecorderOptions = {
        ...mediaRecorderOptions,
        mimeType,
      };

      const recorder = new MediaRecorder(source, completeMediaRecorderOptions);
      newRecorders.push(recorder);

      recorder.addEventListener("dataavailable", ({ data }) => {
        setCurrentBlobs((prev) => ({
          ...prev,
          endDate,
          blobs: {
            ...prev.blobs,
            [prefix]: data,
          },
        }));
      });

      recorder.addEventListener("error", (event) => {
        console.log("error: ", prefix, event);
      });

      toStart.push(() => {
        return recorder.start();
      });
    }

    setRecorders(newRecorders);
    toStart.forEach((f) => f());
  }, [mediaSources, setCurrentBlobs, setRecording]);

  const onStop = useCallback(() => {
    if (recorders) {
      for (const recorder of recorders) {
        recorder.stop();
      }
    }

    endDate = Date.now();
    setRecording(false);
    setShowHandleVideos(true);
  }, [recorders, setRecording, setShowHandleVideos]);

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

    if (recording) {
      onStop();
    } else {
      start();
    }
  }, [mediaSources.webcam, onStop, recording, start]);

  const onDiscard = useCallback(() => {
    discardVideos();
    setShowHandleVideos(false);
    start();
  }, [discardVideos, setShowHandleVideos, start]);

  useKeyPress({ keys: ["r"], callback: onPressR, metaKey: false });

  const disabled = recordingDisabled || recording !== false || showHandleVideos;

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
          ? "A webcam and an audio source have to be selected to start the recording"
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
