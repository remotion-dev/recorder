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

const topBarContainer: React.CSSProperties = {
  display: "flex",
  gap: 10,
  margin: 10,
  alignItems: "center",
};

export const TopBar: React.FC<{
  readonly start: () => void;
  readonly stop: () => void;
  readonly discardVideos: () => void;
  readonly recording: false | number;
  readonly setCurrentBlobs: React.Dispatch<React.SetStateAction<CurrentBlobs>>;
  readonly mediaSources: MediaSources;
  readonly currentBlobs: CurrentBlobs;
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
        stop={stop}
        recording={recording}
        setShowHandleVideos={setShowHandleVideos}
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
