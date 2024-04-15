/* eslint-disable no-alert */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ALTERNATIVE1_PREFIX,
  ALTERNATIVE2_PREFIX,
  DISPLAY_PREFIX,
  WEBCAM_PREFIX,
} from "../config/cameras";
import "./App.css";
import { Button } from "./components/ui/button";
import type { CurrentBlobs } from "./components/UseThisTake";
import { currentBlobsInitialState } from "./components/UseThisTake";
import type { Label } from "./helpers";
import { formatLabel } from "./helpers";
import type { MediaSources } from "./RecordButton";
import { TopBar } from "./TopBar";
import { useKeyPress } from "./use-key-press";
import type { Prefix } from "./Views";
import { View } from "./Views";

export const getDeviceLabel = (device: MediaDeviceInfo): string => {
  const labels: Label[] = JSON.parse(localStorage.getItem("labels") ?? "[]");
  const found = labels.find((l) => l.id === device.deviceId);
  if (found) {
    return found.label;
  }

  return formatLabel(device);
};

const storeLabelsToLS = (devices: MediaDeviceInfo[]) => {
  const labels: Label[] = JSON.parse(localStorage.getItem("labels") ?? "[]");
  devices.forEach((device) => {
    const id = device.deviceId;
    const cleanLabel = formatLabel(device);

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

let endDate = 0;

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
};

const mediaRecorderOptions: MediaRecorderOptions = {
  audioBitsPerSecond: 128000,
  videoBitsPerSecond: 8 * 4000000,
};

const App = () => {
  const [showAlternativeViews, setShowAlternativeViews] = useState<boolean>(
    localStorage.getItem("showAlternativeViews") === "true",
  );
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [recorders, setRecorders] = useState<MediaRecorder[] | null>(null);
  const [recording, setRecording] = useState<false | number>(false);

  const [mediaSources, setMediaSources] = useState<MediaSources>({
    webcam: null,
    display: null,
    alternative1: null,
    alternative2: null,
  });

  const [currentBlobs, setCurrentBlobs] = useState<CurrentBlobs>(
    currentBlobsInitialState,
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

  const discardVideos = useCallback(() => {
    setCurrentBlobs(currentBlobsInitialState);
  }, []);

  const setMediaStream = useCallback(
    (prefix: Prefix, source: MediaStream | null) => {
      setMediaSources((prevMediaSources) => ({
        ...prevMediaSources,
        [prefix]: source,
      }));
    },
    [],
  );
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
  }, [mediaSources]);

  const stop = useCallback(() => {
    if (recorders) {
      for (const recorder of recorders) {
        recorder.stop();
      }
    }

    endDate = Date.now();
    setRecording(false);
  }, [recorders]);

  const onPressR = useCallback(() => {
    if (mediaSources.webcam === null || !mediaSources.webcam.active) {
      return;
    }

    if (recording) {
      stop();
    } else {
      start();
    }
  }, [mediaSources.webcam, recording, start, stop]);

  useKeyPress(["r"], onPressR);

  useEffect(() => {
    const checkDeviceLabels = async () => {
      const fetchedDevices = await navigator.mediaDevices.enumerateDevices();
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
    };

    checkDeviceLabels();
  }, []);

  return (
    <div style={outer}>
      <TopBar
        start={start}
        stop={stop}
        discardVideos={discardVideos}
        recording={recording}
        currentBlobs={currentBlobs}
        setCurrentBlobs={setCurrentBlobs}
        mediaSources={mediaSources}
      />
      <div style={dynamicGridContainer}>
        <View
          prefix={WEBCAM_PREFIX}
          devices={devices}
          setMediaStream={setMediaStream}
          mediaStream={mediaSources.webcam}
        />
        <View
          prefix={DISPLAY_PREFIX}
          devices={devices}
          setMediaStream={setMediaStream}
          mediaStream={mediaSources.display}
        />
        {showAlternativeViews ? (
          <>
            <View
              prefix={ALTERNATIVE1_PREFIX}
              devices={devices}
              setMediaStream={setMediaStream}
              mediaStream={mediaSources.alternative1}
            />
            <View
              prefix={ALTERNATIVE2_PREFIX}
              devices={devices}
              setMediaStream={setMediaStream}
              mediaStream={mediaSources.alternative2}
            />
          </>
        ) : null}
      </div>
      <div style={{ marginBottom: 10 }}>
        {/* eslint-disable-next-line no-negated-condition */}
        {!showAlternativeViews ? (
          <Button
            variant={"ghost"}
            onClick={handleShowMore}
            style={{ margin: "0px 10px" }}
          >
            Show more views
          </Button>
        ) : (
          <Button
            variant={"ghost"}
            onClick={handleShowLess}
            style={{ margin: "0px 10px", width: 100 }}
          >
            Show Less
          </Button>
        )}
      </div>
    </div>
  );
};

export default App;
