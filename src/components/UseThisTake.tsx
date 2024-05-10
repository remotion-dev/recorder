import React, { useCallback } from "react";
import { convertFilesInServer } from "../actions/convert-files";
import { transcribeVideoInServer } from "../actions/transcribe-video-in-server";
import { downloadVideo } from "../helpers/download-video";
import { uploadFileToServer } from "../helpers/upload-file";
import { Button } from "./ui/button";

export type CurrentBlobs =
  | {
      endDate: number;
      blobs: {
        webcam: Blob | null;
        display: Blob | null;
        alt1: Blob | null;
        alt2: Blob | null;
      };
    }
  | {
      endDate: null;
      blobs: {
        webcam: null;
        display: null;
        alt1: null;
        alt2: null;
      };
    };

export const currentBlobsInitialState: CurrentBlobs = {
  endDate: null,
  blobs: {
    webcam: null,
    display: null,
    alt1: null,
    alt2: null,
  },
};

export const UseThisTake: React.FC<{
  readonly selectedFolder: string | null;
  readonly currentBlobs: CurrentBlobs;
  readonly setCurrentBlobs: React.Dispatch<React.SetStateAction<CurrentBlobs>>;
  readonly setShowHandleVideos: React.Dispatch<React.SetStateAction<boolean>>;
  readonly uploading: boolean;
  readonly setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTranscribing: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  currentBlobs,
  selectedFolder,
  setCurrentBlobs,
  setShowHandleVideos,
  uploading,
  setUploading,
  setTranscribing,
}) => {
  const keepVideoOnServer = useCallback(async () => {
    if (currentBlobs.endDate === null) {
      return Promise.resolve();
    }

    if (selectedFolder === null) {
      // eslint-disable-next-line no-alert
      alert("Please select a folder first.");
      return Promise.resolve();
    }

    for (const [prefix, blob] of Object.entries(currentBlobs.blobs)) {
      if (blob === null) {
        continue;
      }

      await uploadFileToServer({
        blob,
        endDate: currentBlobs.endDate,
        prefix,
        selectedFolder,
      });
    }

    await convertFilesInServer({
      endDate: currentBlobs.endDate,
      selectedFolder,
    });

    setCurrentBlobs(currentBlobsInitialState);
    return Promise.resolve();
  }, [
    selectedFolder,
    currentBlobs.blobs,
    currentBlobs.endDate,
    setCurrentBlobs,
  ]);

  const keepVideoOnClient = useCallback(() => {
    if (currentBlobs.endDate === null) {
      return Promise.resolve();
    }

    for (const [prefix, blob] of Object.entries(currentBlobs.blobs)) {
      if (blob !== null) {
        downloadVideo(blob, currentBlobs.endDate, prefix);
      }
    }

    setCurrentBlobs(currentBlobsInitialState);
  }, [currentBlobs.blobs, currentBlobs.endDate, setCurrentBlobs]);

  const keepVideos = useCallback(async () => {
    if (currentBlobs.endDate === null) {
      return Promise.resolve();
    }

    if (window.remotionServerEnabled) {
      await keepVideoOnServer();
    } else {
      keepVideoOnClient();
    }
  }, [currentBlobs.endDate, keepVideoOnClient, keepVideoOnServer]);

  const handleUseTake = useCallback(async () => {
    setUploading(true);
    const { endDate } = currentBlobs;
    try {
      await keepVideos();
      setShowHandleVideos(false);
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line no-alert
      alert((err as Error).stack);
    } finally {
      setUploading(false);
    }

    try {
      if (endDate && selectedFolder) {
        setTranscribing(true);
        await transcribeVideoInServer({ endDate, selectedFolder });
      }
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line no-alert
      alert((err as Error).stack);
    } finally {
      setTranscribing(false);
    }
  }, [
    currentBlobs,
    keepVideos,
    selectedFolder,
    setShowHandleVideos,
    setTranscribing,
    setUploading,
  ]);

  return (
    <Button
      variant={"default"}
      type="button"
      onClick={handleUseTake}
      title="Copy this take"
      disabled={uploading}
    >
      {uploading
        ? "Copying..."
        : window.remotionServerEnabled
          ? `Copy to public/${selectedFolder}`
          : "Download this take"}
    </Button>
  );
};
