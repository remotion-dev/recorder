/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { onVideo } from "./on-video";
import { TopBar } from "./TopBar";
import type { Prefix, prefixes } from "./Views";
import { View } from "./Views";

let endDate = 0;

const outer: React.CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

const gridContainer: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gridTemplateRows: "repeat(2, 1fr)",
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
  // mimeType: "video/webm;codecs=vp8",
  videoBitsPerSecond: 8 * 4000000,
};

const App = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const [recorders, setRecorders] = useState<MediaRecorder[] | null>(null);
  const [recording, setRecording] = useState<false | number>(false);
  const [mediaSources, setMediaSources] = useState<{
    [key in (typeof prefixes)[number]]: MediaStream | null;
  }>({ webcam: null, display: null, alternative1: null, alternative2: null });
  const setMediaStream = useCallback(
    (prefix: Prefix, source: MediaStream | null) => {
      setMediaSources((prevMediaSources) => ({
        ...prevMediaSources,
        [prefix]: source,
      }));
    },
    [],
  );

  const start = () => {
    setRecording(() => Date.now());
    const toStart = [];
    const newRecorders: MediaRecorder[] = [];
    for (const [prefix, source] of Object.entries(mediaSources)) {
      if (!source) {
        continue;
      }

      const mimeType =
        prefix === "webcam"
          ? "video/webm;codecs=vp8,opus"
          : "video/webm;codecs=vp8";

      const completeMediaRecorderOptions = {
        ...mediaRecorderOptions,
        mimeType,
      };

      const recorder = new MediaRecorder(source, completeMediaRecorderOptions);
      newRecorders.push(recorder);

      recorder.addEventListener("dataavailable", ({ data }) => {
        onVideo(data, endDate, prefix);
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
  };

  const stop = () => {
    if (recorders) {
      for (const recorder of recorders) {
        recorder.stop();
      }
    }

    endDate = Date.now();
    setRecording(false);
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((_devices) => {
      setDevices(_devices);
    });
  }, []);

  return (
    <div style={outer}>
      <TopBar
        start={start}
        stop={stop}
        recording={recording}
        disabledByParent={false}
      />

      <div style={gridContainer}>
        <View
          prefix={"webcam"}
          devices={devices}
          setMediaStream={setMediaStream}
          mediaStream={mediaSources.webcam}
        />
        <View
          prefix={"display"}
          devices={devices}
          setMediaStream={setMediaStream}
          mediaStream={mediaSources.display}
        />
        <View
          prefix={"alternative1"}
          devices={devices}
          setMediaStream={setMediaStream}
          mediaStream={mediaSources.alternative1}
        />
        <View
          prefix={"alternative2"}
          devices={devices}
          setMediaStream={setMediaStream}
          mediaStream={mediaSources.alternative2}
        />
      </div>
    </div>
  );
};

export default App;
