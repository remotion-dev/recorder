/* eslint-disable no-alert */
import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { onVideo } from "./on-video";

let duration = 0;
let endDate = 0;

const mediaRecorderOptions: MediaRecorderOptions = {
  audioBitsPerSecond: 128000,
  mimeType: "video/webm;codecs=vp8,opus",
  videoBitsPerSecond: 4000000,
};

const App = () => {
  const live = useRef<HTMLVideoElement>(null);
  const screen = useRef<HTMLVideoElement>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [display, setDisplay] = useState<MediaStream | null>(null);
  const [webcam, setWebcam] = useState<MediaStream | null>(null);
  const [displayMediaRecorder, setMediaDisplayRecorder] =
    useState<MediaRecorder | null>(null);
  const [webcamMediaRecorder, setWebcamDisplayRecorder] =
    useState<MediaRecorder | null>(null);
  const [recording, setRecording] = useState<number | false>(false);

  const [selectedWebcam, setSelectedWebcamVideo] =
    useState<ConstrainDOMString | null>(null);

  const select = useCallback(() => {
    const microphone = devices.find(
      (d) => d.kind === "audioinput" && d.label.includes("NT-USB")
    );

    if (!microphone) {
      alert("NT USB mic is not connected");
      return;
    }

    if (!selectedWebcam) {
      alert("No video selected");
      return;
    }

    window.navigator.mediaDevices
      .getUserMedia({
        video: { deviceId: selectedWebcam },
        audio: { deviceId: microphone.deviceId },
      })
      .then((stream) => {
        if (live.current) {
          live.current.srcObject = stream;
          live.current.play();
        }

        setWebcam(stream);
      });
  }, [devices, selectedWebcam]);

  const selectscreen = () => {
    window.navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then((stream) => {
        setDisplay(stream);
        if (!screen.current) {
          return;
        }

        screen.current.srcObject = stream;
        screen.current.play();
      });
  };

  const start = () => {
    if (!webcam) {
      throw new Error("No webcam");
    }

    setRecording(Date.now());

    const toStart = [];

    if (display) {
      const displayRecorder = new MediaRecorder(display, mediaRecorderOptions);
      setMediaDisplayRecorder(displayRecorder);
      displayRecorder.addEventListener("dataavailable", ({ data }) => {
        onVideo(data, duration, endDate, "display");
      });
      toStart.push(() => displayRecorder.start());
    } else {
      setMediaDisplayRecorder(null);
    }

    if (webcam) {
      const webcamRecorder = new MediaRecorder(webcam, mediaRecorderOptions);
      setWebcamDisplayRecorder(webcamRecorder);
      webcamRecorder.addEventListener("dataavailable", ({ data }) => {
        onVideo(data, duration, endDate, "webcam");
      });

      toStart.push(() => webcamRecorder.start());
    } else {
      setWebcamDisplayRecorder(null);
    }

    toStart.forEach((f) => f());
  };

  const stop = () => {
    if (displayMediaRecorder) {
      displayMediaRecorder.stop();
    }

    if (webcamMediaRecorder) {
      webcamMediaRecorder.stop();
    }

    endDate = Date.now();
    duration = endDate - (recording as number);
    setRecording(false);
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((_devices) => {
      setSelectedWebcamVideo(_devices[0].deviceId);
      setDevices(_devices);
    });
  }, []);

  useEffect(() => {
    if (devices.length > 0) {
      select();
    }
  }, [devices, select]);

  return (
    <div className="App">
      <div style={{ color: recording ? "red" : "black" }}>
        {recording ? "recording" : "not recording"}
      </div>
      <button type="button" onClick={selectscreen}>
        Select screen
      </button>
      <button
        type="button"
        disabled={!webcam || !display || recording !== false}
        onClick={start}
      >
        Start
      </button>
      <button type="button" disabled={!recording} onClick={stop}>
        Stop
      </button>
      <table>
        <tbody>
          <tr>
            <td>
              <video ref={live} muted width="320" />
            </td>
            <td>
              <video ref={screen} muted width="320" />
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      Webcam:
      <select
        onChange={(e) => {
          setSelectedWebcamVideo(e.target.value as ConstrainDOMString);
        }}
      >
        {devices
          .filter((d) => d.kind === "videoinput")
          .map((d) => {
            return (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label} ({d.kind})
              </option>
            );
          })}
      </select>
      <button type="button" onClick={select}>
        Select webcam
      </button>
      <br />
    </div>
  );
};

export default App;
