import type { SetStateAction } from "react";
import React, { useCallback, useState } from "react";
import { RecordCircle } from "./BlinkingCircle";
import { NewFolderDialog } from "./components/NewFolderDialog";
import { SelectedFolder } from "./components/SelectedFolder";
import { Button } from "./components/ui/button";
import type { CurrentBlobs } from "./components/UseThisTake";
import { UseThisTake } from "./components/UseThisTake";
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
  readonly folders: string[] | null;
  readonly disabledByParent: boolean;
  readonly selectedFolder: string | null;
  readonly setSelectedFolder: React.Dispatch<SetStateAction<string | null>>;
  readonly setCurrentBlobs: React.Dispatch<React.SetStateAction<CurrentBlobs>>;
  readonly refreshProjectList: () => Promise<void>;
  currentBlobs: CurrentBlobs;
}> = ({
  start,
  stop,
  discardVideos,
  folders,
  recording,
  disabledByParent,
  selectedFolder,
  setSelectedFolder,
  refreshProjectList,
  currentBlobs,
  setCurrentBlobs,
}) => {
  const [showHandleVideos, setShowHandleVideos] = useState<boolean>(false);

  const handleDiscardTake = useCallback(() => {
    discardVideos();
    setShowHandleVideos(false);
    start();
  }, [discardVideos, start]);

  return (
    <div style={topBarContainer}>
      <RecordButton
        stop={stop}
        recording={recording}
        disabledByParent={disabledByParent}
        setShowHandleVideos={setShowHandleVideos}
        showHandleVideos={showHandleVideos}
        start={start}
      />
      {showHandleVideos ? (
        <>
          <Button
            variant={"outline"}
            type="button"
            onClick={handleDiscardTake}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
            title="Press R to start recording"
          >
            <RecordCircle disabledByParent={disabledByParent} />
            Discard and retake
          </Button>
          <UseThisTake
            selectedFolder={selectedFolder}
            currentBlobs={currentBlobs}
            setCurrentBlobs={setCurrentBlobs}
            setShowHandleVideos={setShowHandleVideos}
          />
        </>
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
            refreshProjectList={refreshProjectList}
            setSelectedFolder={setSelectedFolder}
          />
        </>
      ) : null}
    </div>
  );
};
