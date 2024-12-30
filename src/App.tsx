/* eslint-disable no-alert */
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { Button } from "./components/ui/button";
import { enumerateDevicesOrTimeOut } from "./helpers/enumerate-devices-or-time-out";
import type { Label } from "./helpers/format-device-label";
import { formatDeviceLabel } from "./helpers/format-device-label";
import { MediaSourcesProvider } from "./state/media-sources";

export const getDeviceLabel = (device: MediaDeviceInfo): string => {
  const labels: Label[] = JSON.parse(localStorage.getItem("labels") ?? "[]");
  const found = labels.find((l) => l.id === device.deviceId);
  if (found) {
    return found.label;
  }

  return formatDeviceLabel(device.label);
};

const storeLabelsToLS = (devices: MediaDeviceInfo[]) => {
  const labels: Label[] = JSON.parse(localStorage.getItem("labels") ?? "[]");
  devices.forEach((device) => {
    const id = device.deviceId;
    const cleanLabel = formatDeviceLabel(device.label);

    if (!labels.some((l) => l.id === id) && cleanLabel !== "") {
      labels.push({ id, label: cleanLabel });
    }
  });

  localStorage.setItem("labels", JSON.stringify(labels));
};

const hasNewDevices = (devices: MediaDeviceInfo[]): boolean => {
  const labels: Label[] = JSON.parse(localStorage.getItem("labels") || "[]");

  const hasNew = !devices.every((device) => {
    return labels.some((l) => l.id === device.deviceId);
  });

  return hasNew;
};

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
  const [devices, setDevices] = useState<MediaDeviceInfo[] | null>(null);

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

  useEffect(() => {
    const checkDeviceLabels = async () => {
      try {
        const fetchedDevices = await enumerateDevicesOrTimeOut();

        const hasEmptyLabels = fetchedDevices.some(
          (device) => device.label === "",
        );
        const hasNew = hasNewDevices(fetchedDevices);
        if (hasNew && hasEmptyLabels) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          const _devices = await navigator.mediaDevices.enumerateDevices();
          storeLabelsToLS(_devices);
          stream.getAudioTracks().forEach((track) => track.stop());
          stream.getVideoTracks().forEach((track) => track.stop());
        } else if (hasNew) {
          storeLabelsToLS(fetchedDevices);
        }

        setDevices(fetchedDevices);
      } catch (err) {
        alert((err as Error).message);
        console.log(err);
      }
    };

    checkDeviceLabels();
  }, []);

  return (
    <MediaSourcesProvider>
      <div style={outer}>
        <TopBar
          setRecordingStatus={setRecordingStatus}
          recordingStatus={recordingStatus}
        />
        {devices ? (
          <div style={dynamicGridContainer}>
            <RecordingView
              recordingStatus={recordingStatus}
              prefix={WEBCAM_PREFIX}
              devices={devices}
            />
            <RecordingView
              recordingStatus={recordingStatus}
              prefix={DISPLAY_PREFIX}
              devices={devices}
            />
            {showAlternativeViews ? (
              <>
                <RecordingView
                  recordingStatus={recordingStatus}
                  prefix={ALTERNATIVE1_PREFIX}
                  devices={devices}
                />
                <RecordingView
                  recordingStatus={recordingStatus}
                  prefix={ALTERNATIVE2_PREFIX}
                  devices={devices}
                />
              </>
            ) : null}
          </div>
        ) : null}

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
  );
};

export default App;
