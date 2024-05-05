import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NewFolderDialog } from "./components/NewFolderDialog";
import { SelectedFolder } from "./components/SelectedFolder";
import { SmallSpinner } from "./components/SmallSpinner";
import { Button } from "./components/ui/button";
import type { CurrentBlobs } from "./components/UseThisTake";
import {
  currentBlobsInitialState,
  UseThisTake,
} from "./components/UseThisTake";
import {
  fetchProjectFolders,
  loadFolderFromUrl,
  loadSelectedFolder,
  persistSelectedFolder,
} from "./get-projects";
import type { MediaSources } from "./RecordButton";
import { RecordButton } from "./RecordButton";

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

export const TopBar: React.FC<{
  mediaSources: MediaSources;
}> = ({ mediaSources }) => {
  const [recording, setRecording] = useState<false | number>(false);
  const [currentBlobs, setCurrentBlobs] = useState<CurrentBlobs>(
    currentBlobsInitialState,
  );

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
              recording={recording}
              showHandleVideos={showHandleVideos}
              recordingDisabled={recordingDisabled}
              setCurrentBlobs={setCurrentBlobs}
              mediaSources={mediaSources}
              setRecording={setRecording}
              setShowHandleVideos={setShowHandleVideos}
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
