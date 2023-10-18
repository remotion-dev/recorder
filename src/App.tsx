/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { onVideo } from "./on-video";
import { TopBar } from "./TopBar";
import type { prefixes } from "./Views";
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
  height: "95%",
};

const mainContent: React.CSSProperties = {
  flex: 1,
};

const mediaRecorderOptions: MediaRecorderOptions = {
  audioBitsPerSecond: 128000,
  mimeType: "video/webm;codecs=h264,opus",
  videoBitsPerSecond: 8 * 4000000,
};

const App = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const [recorders, setRecorders] = useState<MediaRecorder[] | null>(null);
  const [recording, setRecording] = useState<number | false>(false);

  const [mediaSources, setMediaSources] = useState<{
    [key in (typeof prefixes)[number]]: MediaStream | null;
  }>({ webcam: null, display: null, alternative1: null, alternative2: null });

  console.log("Media Sources:  ", mediaSources);
  const setMediaStream = useCallback(
    (prefix: string, source: MediaStream | null) => {
      setMediaSources((prevMediaSources) => ({
        ...prevMediaSources,
        [prefix]: source,
      }));
    },
    [],
  );

  const start = () => {
    setRecording(Date.now());

    const toStart = [];
    const newRecorders: MediaRecorder[] = [];
    for (const [prefix, source] of Object.entries(mediaSources)) {
      if (!source) {
        continue;
      }

      const recorder = new MediaRecorder(source, mediaRecorderOptions);
      newRecorders.push(recorder);
      recorder.addEventListener("dataavailable", ({ data }) => {
        onVideo(data, endDate, prefix);
      });

      toStart.push(() => recorder.start());
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
      <TopBar />
      <div style={mainContent}>
        <div style={{ color: recording ? "red" : "black" }}>
          {recording ? "recording" : null}
        </div>
        {recording ? (
          <button type="button" disabled={!recording} onClick={stop}>
            Stop Recording
          </button>
        ) : (
          <button
            type="button"
            disabled={!mediaSources.webcam || recording !== false}
            onClick={start}
          >
            Start Recording
          </button>
        )}

        <div style={gridContainer}>
          <View
            prefix={"webcam"}
            devices={devices}
            setMediaStream={setMediaStream}
            mediaStream={mediaSources.webcam ?? null}
          />
          <View
            prefix={"display"}
            devices={devices}
            setMediaStream={setMediaStream}
            mediaStream={mediaSources.webcam ?? null}
          />
          <View
            prefix={"alternative1"}
            devices={devices}
            setMediaStream={setMediaStream}
            mediaStream={mediaSources.webcam ?? null}
          />
          <View
            prefix={"alternative2"}
            devices={devices}
            setMediaStream={setMediaStream}
            mediaStream={mediaSources.webcam ?? null}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
