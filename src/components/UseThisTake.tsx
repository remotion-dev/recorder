import React, { useCallback } from "react";
import { RecordingStatus } from "../RecordButton";
import { downloadVideo } from "../helpers/download-video";
import { uploadFileToServer } from "../helpers/upload-file";
import { ProcessStatus } from "./ProcessingStatus";
import { Button } from "./ui/button";

let currentProcessing = Promise.resolve();

export const UseThisTake: React.FC<{
  readonly selectedFolder: string | null;
  recordingStatus: RecordingStatus;
  setRecordingStatus: React.Dispatch<React.SetStateAction<RecordingStatus>>;
  setStatus: React.Dispatch<React.SetStateAction<ProcessStatus | null>>;
}> = ({ selectedFolder, recordingStatus, setRecordingStatus, setStatus }) => {
  const keepVideoOnServer = useCallback(async () => {
    if (recordingStatus.type !== "recording-finished") {
      return Promise.resolve();
    }

    if (selectedFolder === null) {
      // eslint-disable-next-line no-alert
      alert("Please select a folder first.");
      return Promise.resolve();
    }

    for (const blob of recordingStatus.blobs) {
      currentProcessing = currentProcessing
        .then(() => {
          setStatus({
            title: `Processing ${blob.prefix}${blob.endDate}.mp4`,
            description: "Uploading...",
          });
          return uploadFileToServer({
            blob: blob.data,
            endDate: recordingStatus.endDate,
            prefix: blob.prefix,
            selectedFolder,
            onProgress: (stat) => {
              setStatus(stat);
            },
            expectedFrames: recordingStatus.expectedFrames,
          });
        })
        .catch((err) => {
          console.log(err);
        })
        .then(() => {
          setStatus(null);
        });
    }

    setRecordingStatus({ type: "idle" });
  }, [recordingStatus, selectedFolder, setRecordingStatus, setStatus]);

  const keepVideoOnClient = useCallback(() => {
    if (recordingStatus.type !== "recording-finished") {
      return Promise.resolve();
    }

    for (const blob of recordingStatus.blobs) {
      downloadVideo(blob.data, recordingStatus.endDate, blob.prefix);
    }

    setRecordingStatus({ type: "idle" });
  }, [recordingStatus, setRecordingStatus]);

  const keepVideos = useCallback(async () => {
    if (window.remotionServerEnabled) {
      await keepVideoOnServer();
    } else {
      keepVideoOnClient();
    }
  }, [keepVideoOnClient, keepVideoOnServer]);

  return (
    <Button
      variant="default"
      type="button"
      title="Copy this take"
      onClick={keepVideos}
      disabled={recordingStatus.type === "processing-recording"}
    >
      {recordingStatus.type === "processing-recording"
        ? "Uploading..."
        : window.remotionServerEnabled
          ? `Copy to public/${selectedFolder}`
          : "Download this take"}
    </Button>
  );
};
