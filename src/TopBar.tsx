import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NewFolderDialog } from "./components/NewFolderDialog";
import { SelectedFolder } from "./components/SelectedFolder";
import type { CurrentBlobs } from "./components/UseThisTake";
import { UseThisTake } from "./components/UseThisTake";
import {
  fetchProjectFolders,
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
  alignItems: "center",
};

export const TopBar: React.FC<{
  start: () => void;
  stop: () => void;
  discardVideos: () => void;
  recording: false | number;
  setCurrentBlobs: React.Dispatch<React.SetStateAction<CurrentBlobs>>;
  mediaSources: MediaSources;
  currentBlobs: CurrentBlobs;
}> = ({
  start,
  stop,
  discardVideos,
  recording,
  currentBlobs,
  setCurrentBlobs,
  mediaSources,
}) => {
  const [folders, setFolders] = useState<string[] | null>(null);

  const [showHandleVideos, setShowHandleVideos] = useState<boolean>(false);
  const [preferredSelectedFolder, setSelectedFolder] = useState<string | null>(
    loadSelectedFolder(),
  );
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

  useKeyPress(["r"], onPressR);

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
      <RecordButton
        onStop={onStop}
        recording={recording}
        showHandleVideos={showHandleVideos}
        start={start}
        recordingDisabled={recordingDisabled}
        onDiscard={handleDiscardTake}
      />
      {showHandleVideos ? (
        <UseThisTake
          selectedFolder={selectedFolder}
          currentBlobs={currentBlobs}
          setCurrentBlobs={setCurrentBlobs}
          setShowHandleVideos={setShowHandleVideos}
        />
      ) : null}
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
    </div>
  );
};
