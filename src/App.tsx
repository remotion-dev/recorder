/* eslint-disable no-alert */
import React, { useCallback, useMemo, useState } from "react";
import {
  ALTERNATIVE1_PREFIX,
  ALTERNATIVE2_PREFIX,
  DISPLAY_PREFIX,
  WEBCAM_PREFIX,
} from "../config/cameras";
import "./App.css";
import type { RecordingStatus } from "./RecordButton";
import { RecordingView } from "./RecordingView";
import { TopBar } from "./TopBar";
import { WaitingForDevices } from "./WaitingForDevices";
import { Button } from "./components/ui/button";
import { MediaSourcesProvider } from "./state/media-sources";

const outer: React.CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

const gridContainer: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  alignItems: "center",
  justifyItems: "center",
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  gap: 10,
  margin: 10,
  marginTop: 2,
};

const App = () => {
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>({
    type: "idle",
  });

  const [showAlternativeViews, setShowAlternativeViews] = useState<boolean>(
    localStorage.getItem("showAlternativeViews") === "true",
  );

  const dynamicGridContainer = useMemo(() => {
    if (showAlternativeViews) {
      return { ...gridContainer, gridTemplateRows: "repeat(2, 1fr)" };
    }

    return { ...gridContainer, maxHeight: "50%" };
  }, [showAlternativeViews]);

  const handleShowMore = useCallback(() => {
    setShowAlternativeViews(true);
    localStorage.setItem("showAlternativeViews", "true");
  }, []);

  const handleShowLess = useCallback(() => {
    setShowAlternativeViews(false);
    localStorage.setItem("showAlternativeViews", "false");
  }, []);

  return (
    <WaitingForDevices>
      <MediaSourcesProvider>
        <div style={outer}>
          <TopBar
            setRecordingStatus={setRecordingStatus}
            recordingStatus={recordingStatus}
          />
          <div style={dynamicGridContainer}>
            <RecordingView
              recordingStatus={recordingStatus}
              prefix={WEBCAM_PREFIX}
            />
            <RecordingView
              recordingStatus={recordingStatus}
              prefix={DISPLAY_PREFIX}
            />
            {showAlternativeViews ? (
              <>
                <RecordingView
                  recordingStatus={recordingStatus}
                  prefix={ALTERNATIVE1_PREFIX}
                />
                <RecordingView
                  recordingStatus={recordingStatus}
                  prefix={ALTERNATIVE2_PREFIX}
                />
              </>
            ) : null}
          </div>

          <div style={{ marginBottom: 10, textAlign: "center" }}>
            {showAlternativeViews ? (
              <Button
                variant={"ghost"}
                onClick={handleShowLess}
                style={{ margin: "0px 10px", width: 100 }}
              >
                Show Less
              </Button>
            ) : (
              <Button
                variant={"ghost"}
                onClick={handleShowMore}
                style={{ margin: "0px 10px" }}
              >
                Show more views
              </Button>
            )}
          </div>
        </div>
      </MediaSourcesProvider>
    </WaitingForDevices>
  );
};

export default App;
