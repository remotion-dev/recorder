/* eslint-disable no-alert */
import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { onVideo } from "./on-video";
import { prefixes, View } from "./Views";

let endDate = 0;

const buttonStyle: React.CSSProperties = {
  margin: 10,
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
  const [amountOfViews, setAmountOfViews] = useState(2);

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
    <div className="App">
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

      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {new Array(amountOfViews).fill(0).map((_, i) => {
          const prefix = prefixes[i];
          return (
            <View
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              prefix={prefix}
              devices={devices}
              recordAudio={i === 0}
              type={i % 2 ? "screen" : "peripheral"}
              setMediaStream={setMediaStream}
              mediaStream={mediaSources[prefix] ?? null}
            />
          );
        })}
      </div>
      {amountOfViews > 2 ? (
        <button
          style={buttonStyle}
          type="button"
          onClick={() => setAmountOfViews((v) => v - 1)}
        >
          Remove source
        </button>
      ) : null}
      {amountOfViews < 4 ? (
        <button
          style={buttonStyle}
          type="button"
          onClick={() => setAmountOfViews((v) => v + 1)}
        >
          Add source
        </button>
      ) : null}
    </div>
  );
};

export default App;
