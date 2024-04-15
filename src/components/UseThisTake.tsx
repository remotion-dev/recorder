import React, { useCallback, useMemo } from "react";
import {
  convertFilesInServer,
  downloadVideo,
  handleUploadFileToServer,
} from "../download-video";
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
  readonly currentBlobs: CurrentBlobs;
  readonly selectedProject: string | null;
  readonly folders: string[] | null;
  readonly setCurrentBlobs: React.Dispatch<React.SetStateAction<CurrentBlobs>>;
  readonly setShowHandleVideos: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  currentBlobs,
  selectedProject,
  folders,
  setCurrentBlobs,
  setShowHandleVideos,
}) => {
  const actualSelectedProject = useMemo(() => {
    return selectedProject ?? folders?.[0] ?? null;
  }, [folders, selectedProject]);

  const keepVideos = useCallback(async () => {
    const runsOnServer = Boolean(window.remotionServerEnabled);
    if (currentBlobs.endDate === null) {
      return Promise.resolve();
    }

    for (const [prefix, blob] of Object.entries(currentBlobs.blobs)) {
      if (blob !== null) {
        if (runsOnServer) {
          if (actualSelectedProject === null) {
            // eslint-disable-next-line no-alert
            alert("Please select a folder first.");
            return Promise.resolve();
          }

          await handleUploadFileToServer(
            blob,
            currentBlobs.endDate,
            prefix,
            actualSelectedProject,
          );
        } else {
          downloadVideo(blob, currentBlobs.endDate, prefix);
        }
      }
    }

    if (runsOnServer) {
      if (!actualSelectedProject) {
        throw new Error("No project selected");
      }

      await convertFilesInServer(currentBlobs.endDate, actualSelectedProject);
    }

    setCurrentBlobs(currentBlobsInitialState);
    return Promise.resolve();
  }, [
    actualSelectedProject,
    currentBlobs.blobs,
    currentBlobs.endDate,
    setCurrentBlobs,
  ]);

  const handleUseTake = useCallback(async () => {
    try {
      await keepVideos();

      setShowHandleVideos(false);
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line no-alert
      alert((err as Error).stack);
    }
  }, [keepVideos, setShowHandleVideos]);

  return (
    <Button
      variant={"default"}
      type="button"
      onClick={handleUseTake}
      title="Copy this take"
    >
      Use this take
    </Button>
  );
};
