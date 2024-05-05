import React, { useCallback, useEffect, useMemo, useState } from "react";
import { WEBCAM_PREFIX } from "../config/cameras";
import { NewFolderDialog } from "./components/NewFolderDialog";
import { SelectedFolder } from "./components/SelectedFolder";
import { SmallSpinner } from "./components/SmallSpinner";
import { Button } from "./components/ui/button";
import type { CurrentBlobs } from "./components/UseThisTake";
import { UseThisTake } from "./components/UseThisTake";
import {
  fetchProjectFolders,
  loadFolderFromUrl,
  loadSelectedFolder,
  persistSelectedFolder,
} from "./get-projects";
import type { MediaSources } from "./RecordButton";
import { RecordButton } from "./RecordButton";
import { useKeyPress } from "./use-key-press";

const topBarContainer: React.CSSProperties = {
  display: "flex",
  gap: 10,
  margin: 10,
  marginBottom: 0,
  alignItems: "center",
};

const recordWrapper: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 10,
};

const transcribeIndicator: React.CSSProperties = {
  fontSize: 10,
  display: "flex",
  paddingLeft: 2,
  alignItems: "center",
  marginTop: 2,
  gap: 4,
  color: "grey",
};

const mediaRecorderOptions: MediaRecorderOptions = {
  audioBitsPerSecond: 128000,
  videoBitsPerSecond: 8 * 4000000,
};

let endDate = 0;

export const TopBar: React.FC<{
  discardVideos: () => void;
  setCurrentBlobs: React.Dispatch<React.SetStateAction<CurrentBlobs>>;
  mediaSources: MediaSources;
  currentBlobs: CurrentBlobs;
}> = ({ discardVideos, currentBlobs, setCurrentBlobs, mediaSources }) => {
  const [recorders, setRecorders] = useState<MediaRecorder[] | null>(null);
  const [recording, setRecording] = useState<false | number>(false);

  const [folders, setFolders] = useState<string[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [showHandleVideos, setShowHandleVideos] = useState<boolean>(false);

  const folderFromUrl: string | null = useMemo(() => {
    return loadFolderFromUrl();
  }, []);

  const [preferredSelectedFolder, setSelectedFolder] = useState<string | null>(
    folderFromUrl ?? loadSelectedFolder(),
  );

  const dynamicTranscribeIndicator: React.CSSProperties = useMemo(() => {
    return {
      ...transcribeIndicator,
      visibility: transcribing ? "visible" : "hidden",
    };
  }, [transcribing]);

  const selectedFolder = useMemo(() => {
    return preferredSelectedFolder ?? folders?.[0] ?? null;
  }, [folders, preferredSelectedFolder]);
  const refreshFoldersList = useCallback(async () => {
    const json = await fetchProjectFolders();
    setFolders(json.folders);
    if (selectedFolder && !json.folders.includes(selectedFolder)) {
      setSelectedFolder(json.folders[0] ?? "");
    }
  }, [selectedFolder]);

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
  }, [mediaSources, setCurrentBlobs]);

  const stop = useCallback(() => {
    if (recorders) {
      for (const recorder of recorders) {
        recorder.stop();
      }
    }

    endDate = Date.now();
    setRecording(false);
  }, [recorders]);

  const onStop = useCallback(() => {
    stop();
    setShowHandleVideos(true);
  }, [setShowHandleVideos, stop]);

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

  useKeyPress({ keys: ["r"], callback: onPressR, metaKey: false });

  useEffect(() => {
    if (!window.remotionServerEnabled) {
      return;
    }

    refreshFoldersList();
  }, [refreshFoldersList]);

  useEffect(() => {
    if (!window.remotionServerEnabled) {
      return;
    }

    persistSelectedFolder(selectedFolder ?? "");
  }, [selectedFolder]);

  const handleDiscardTake = useCallback(() => {
    discardVideos();
    setShowHandleVideos(false);
    start();
  }, [discardVideos, start]);

  const recordingDisabled = useMemo(() => {
    return (
      mediaSources.webcam === null ||
      mediaSources.webcam.getAudioTracks().length === 0
    );
  }, [mediaSources.webcam]);

  return (
    <div style={topBarContainer}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={recordWrapper}>
          {uploading ? null : (
            <RecordButton
              onStop={onStop}
              recording={recording}
              showHandleVideos={showHandleVideos}
              start={start}
              recordingDisabled={recordingDisabled}
              onDiscard={handleDiscardTake}
            />
          )}

          {showHandleVideos ? (
            <UseThisTake
              selectedFolder={selectedFolder}
              currentBlobs={currentBlobs}
              setCurrentBlobs={setCurrentBlobs}
              setShowHandleVideos={setShowHandleVideos}
              uploading={uploading}
              setUploading={setUploading}
              setTranscribing={setTranscribing}
            />
          ) : null}
        </div>

        <div style={dynamicTranscribeIndicator}>
          Transcribing last recording <SmallSpinner />
        </div>
      </div>

      <div style={{ flex: 1 }} />
      {folders ? (
        <>
          <SelectedFolder
            folders={folders}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
          />
          <NewFolderDialog
            refreshFoldersList={refreshFoldersList}
            setSelectedFolder={setSelectedFolder}
          />
        </>
      ) : null}
      {window.remotionServerEnabled ? (
        <Button asChild variant="outline">
          <a href={`http://localhost:3000/${selectedFolder}`} target="_blank">
            Go to Studio
          </a>
        </Button>
      ) : null}
    </div>
  );
};
