import type { SetStateAction } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { ProjectDialog } from "./components/ProjectDialog";
import { SelectedProject } from "./components/SelectProject";
import { Button } from "./components/ui/button";

const topBarContainer: React.CSSProperties = {
  display: "flex",
  gap: 10,
  margin: 10,
  alignItems: "center",
};

const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const formattedSeconds = seconds % 60;
  const formattedMinutes = minutes % 60;

  const timeArray = [];

  if (hours > 0) {
    timeArray.push(hours.toString().padStart(2, "0"));
  }

  timeArray.push(formattedMinutes.toString().padStart(2, "0"));
  timeArray.push(formattedSeconds.toString().padStart(2, "0"));

  return timeArray.join(":");
};

export const TopBar: React.FC<{
  readonly start: () => void;
  readonly stop: () => void;
  readonly keepVideos: () => Promise<void>;
  readonly discardVideos: () => void;
  readonly recording: false | number;
  readonly projects: string[] | null;
  readonly disabledByParent: boolean;
  readonly selectedProject: string | null;
  readonly setSelectedProject: React.Dispatch<SetStateAction<string | null>>;
  readonly refreshProjectList: () => Promise<void>;
}> = ({
  start,
  stop,
  keepVideos,
  discardVideos,
  projects,
  recording,
  disabledByParent,
  selectedProject,
  setSelectedProject,
  refreshProjectList,
}) => {
  const [showHandleVideos, setShowHandleVideos] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(true);
  const disabled = disabledByParent || recording !== false || showHandleVideos;
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 800);
    return () => clearInterval(intervalId);
  }, []);

  const handleUseTake = useCallback(async () => {
    try {
      await keepVideos();

      setShowHandleVideos(false);
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line no-alert
      alert((err as Error).stack);
    }
  }, [keepVideos]);

  const handleDiscardTake = useCallback(() => {
    discardVideos();
    setShowHandleVideos(false);
  }, [discardVideos]);

  const recordCircle = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="10px"
      viewBox="0 0 512 512"
      style={{ opacity: disabledByParent ? 0.4 : 1 }}
    >
      <path fill="red" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );

  const blinkingCircle = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="10px"
      viewBox="0 0 512 512"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      <path fill="red" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );

  return (
    <div style={topBarContainer}>
      {recording ? (
        <>
          <Button
            variant={"outline"}
            type="button"
            disabled={!recording}
            onClick={() => {
              stop();
              setShowHandleVideos(true);
            }}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
            title="Press R to stop recording"
          >
            Stop recording
          </Button>
          {blinkingCircle}
          {formatTime(Date.now() - recording)}
        </>
      ) : (
        <div
          title={
            disabled
              ? "A webcam has to be selected to start the recording"
              : undefined
          }
        >
          <Button
            variant={"outline"}
            type="button"
            disabled={disabled}
            onClick={start}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
            title="Press R to start recording"
          >
            {recordCircle}
            Start recording
          </Button>
        </div>
      )}
      {showHandleVideos ? (
        <>
          <Button
            variant={"default"}
            type="button"
            onClick={handleUseTake}
            title="Press R to start recording"
          >
            Use this take
          </Button>
          <Button
            variant={"destructive"}
            type="button"
            onClick={handleDiscardTake}
            title="Press R to start recording"
          >
            Discard Videos
          </Button>
        </>
      ) : null}
      <div style={{ flex: 1 }} />
      {projects ? (
        <>
          <SelectedProject
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
          <ProjectDialog
            refreshProjectList={refreshProjectList}
            setSelectedProject={setSelectedProject}
          />
        </>
      ) : null}
    </div>
  );
};
