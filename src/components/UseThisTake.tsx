import { webFileReader } from "@remotion/media-parser/web-file";
import { convertMedia } from "@remotion/webcodecs";
import React, { useCallback } from "react";
import { RecordingStatus } from "../RecordButton";
import { downloadVideo } from "../helpers/download-video";
import { formatMilliseconds } from "../helpers/format-time";
import { transcribeVideoOnServer } from "../helpers/transcribe-video";
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
      throw new Error("Recording not finished");
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
            title: `Converting ${blob.prefix}${blob.endDate}.mp4`,
            description: "Starting...",
          });
          return convertMedia({
            container: "webm",
            src: blob.data,
            reader: webFileReader,
            resize: {
              maxHeight: 1080,
              mode: "max-height",
            },
            onProgress: ({ millisecondsWritten }) => {
              setStatus({
                title: `Converting ${blob.prefix}${blob.endDate}.mp4`,
                description: `${formatMilliseconds(millisecondsWritten)} processed`,
              });
            },
          });
        })
        .then((d) => d.save())
        .then((convertedBlob) => {
          setStatus({
            title: `Transcribing ${blob.prefix}${blob.endDate}.mp4`,
            description: "Initiating Whisper.cpp...",
          });
          return uploadFileToServer({
            blob: convertedBlob,
            endDate: recordingStatus.endDate,
            prefix: blob.prefix,
            selectedFolder,
            expectedFrames: recordingStatus.expectedFrames,
          });
        })
        .then(() => {
          setStatus(null);
        })
        .catch((err) => {
          // download blob
          blob.data.arrayBuffer().then((buffer) => {
            const blobToDownload = new Blob([buffer], { type: "video/mp4" });
            const a = document.createElement("a");
            const url = URL.createObjectURL(blobToDownload);
            a.href = url;
            a.download = `${blob.prefix}${blob.endDate}.mp4`;
            a.click();
          });
          alert(
            "Failed to convert video. Downloaded original video for backup.",
          );
          console.log(err);
        });
    }

    currentProcessing = currentProcessing
      .then(() => {
        setStatus({
          title: `Initiating Whisper.cpp...`,
          description: "See Terminal for progress",
        });
        return transcribeVideoOnServer({
          endDate: recordingStatus.endDate,
          selectedFolder,
          onProgress: (stat) => {
            setStatus(stat);
          },
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        setStatus(null);
      });

    setRecordingStatus({ type: "idle" });
  }, [recordingStatus, selectedFolder, setRecordingStatus, setStatus]);

  const keepVideoOnClient = useCallback(async () => {
    if (recordingStatus.type !== "recording-finished") {
      throw new Error("Recording not finished");
    }

    for (const blob of recordingStatus.blobs) {
      await downloadVideo({
        data: blob.data,
        endDate: recordingStatus.endDate,
        prefix: blob.prefix,
        setStatus,
      });
    }

    setRecordingStatus({ type: "idle" });
  }, [recordingStatus, setRecordingStatus, setStatus]);

  const keepVideos = useCallback(async () => {
    if (window.remotionServerEnabled) {
      await keepVideoOnServer();
    } else {
      await keepVideoOnClient();
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
