import React, { useCallback } from "react";
import { RecordingStatus } from "../RecordButton";
import { cancelTranscribeOnServer } from "../helpers/cancel-transcribe";
import { convertInBrowser } from "../helpers/convert-in-browser";
import { downloadVideo } from "../helpers/download-video";
import { formatMilliseconds } from "../helpers/format-time";
import { transcribeVideoOnServer } from "../helpers/transcribe-video";
import { uploadFileToServer } from "../helpers/upload-file";
import { ProcessStatus } from "./ProcessingStatus";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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

    let aborted = false;

    for (const blob of recordingStatus.blobs) {
      currentProcessing = currentProcessing
        .then(() => {
          setStatus({
            title: `Converting ${blob.prefix}${blob.endDate}.webm`,
            description: "Starting...",
            abort: null,
          });
          return blob.data();
        })
        .then((src) => {
          return convertInBrowser({
            src: src,
            onProgress: ({ millisecondsWritten }, abortFn) => {
              setStatus({
                title: `Converting ${blob.prefix}${blob.endDate}.webm`,
                description: `${formatMilliseconds(millisecondsWritten)} processed`,
                abort: abortFn,
              });
            },
          });
        })
        .then((d) => d.save())
        .then((convertedBlob) => {
          setStatus({
            title: `Copying to public folder ${blob.prefix}${blob.endDate}.webm`,
            description: "Copying in progress",
            abort: null,
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
          // ⚠️ might come from @remotion/webcodecs or from transcribe-video.ts
          if ((err as Error).message.includes("aborted by user")) {
            aborted = true;
            return;
          }
          alert(
            "Failed to convert video. Downloaded original video for backup.",
          );
          console.log(err);
          return blob.data();
        })
        .then((buffer) => {
          if (buffer) {
            const blobToDownload = new Blob([buffer], { type: "video/webm" });
            const a = document.createElement("a");
            const url = URL.createObjectURL(blobToDownload);
            a.href = url;
            a.download = `${blob.prefix}${blob.endDate}.webm`;
            a.click();
            blob.releaseData();
          }
        });
    }
    if (aborted) {
      return;
    }

    currentProcessing = currentProcessing
      .then(() => {
        setStatus({
          title: `Transcribing webcam${recordingStatus.endDate}.webm`,
          description: "See Terminal for progress",
          abort: () => cancelTranscribeOnServer(),
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
        // ⚠️ might come from @remotion/webcodecs or from transcribe-video.ts
        if ((err as Error).message.includes("aborted by user")) {
          return;
        }

        console.log(err);
      })
      .then(() => {
        setStatus(null);
      });

    setRecordingStatus({ type: "idle" });
  }, [recordingStatus, selectedFolder, setRecordingStatus, setStatus]);

  const keepVideosWithoutConverting = useCallback(async () => {
    if (recordingStatus.type !== "recording-finished") {
      throw new Error("Recording not finished");
    }

    for (const blob of recordingStatus.blobs) {
      const buffer = await blob.data();

      const blobToDownload = new Blob([buffer], { type: "video/webm" });
      const a = document.createElement("a");
      const url = URL.createObjectURL(blobToDownload);
      a.href = url;
      a.download = `${blob.prefix}${blob.endDate}-unprocessed.webm`;
      a.click();
    }
  }, [recordingStatus]);

  const keepVideoOnClient = useCallback(async () => {
    if (recordingStatus.type !== "recording-finished") {
      throw new Error("Recording not finished");
    }

    for (const blob of recordingStatus.blobs) {
      await downloadVideo({
        data: await blob.data(),
        endDate: recordingStatus.endDate,
        prefix: blob.prefix,
        setStatus,
      });
    }
  }, [recordingStatus, setStatus]);

  return (
    <>
      <div className="flex items-center">
        <Button
          variant="default"
          className={"rounded-r-none"}
          onClick={keepVideoOnServer}
        >
          {`Copy to public/${selectedFolder}`}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className={"rounded-l-none border-l-2 px-2"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                style={{ width: 12 }}
              >
                <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={keepVideoOnClient}>
              Download as file
            </DropdownMenuItem>
            <DropdownMenuItem onClick={keepVideosWithoutConverting}>
              Download without conversion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
