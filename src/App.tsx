/* eslint-disable no-alert */
import { useCallback, useEffect, useRef, useState } from "react";
import { webmFixDuration } from "webm-fix-duration";
import "./App.css";

let displaychunks: Blob[] = [];
let webcamchunks: Blob[] = [];

let duration = 0;
let endDate = 0;

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

  const [selectedVideo, setSelectedVideo] = useState<ConstrainDOMString | null>(
    null
  );

  const select = useCallback(() => {
    const microphone = devices.find(
      (d) => d.kind === "audioinput" && d.label.includes("NT-USB")
    );

    if (!microphone) {
      alert("NT USB mic is not connected");
      return;
    }

    if (!selectedVideo) {
      alert("No video selected");
      return;
    }

    window.navigator.mediaDevices
      .getUserMedia({
        video: { deviceId: selectedVideo },
        audio: { deviceId: microphone.deviceId },
      })
      .then((stream) => {
        if (live.current) {
          live.current.srcObject = stream;
          live.current.play();
        }

        setWebcam(stream);
      });
  }, [devices, selectedVideo]);

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
    if (!display) {
      throw new Error("No display");
    }

    if (!webcam) {
      throw new Error("No webcam");
    }

    const displayRecorder = new MediaRecorder(display, {
      audioBitsPerSecond: 128000,
      mimeType: "video/webm;codecs=vp8,opus",
      videoBitsPerSecond: 4000000,
    });
    const webcamRecorder = new MediaRecorder(webcam, {
      audioBitsPerSecond: 128000,
      mimeType: "video/webm;codecs=vp8,opus",
      videoBitsPerSecond: 4000000,
    });
    setMediaDisplayRecorder(displayRecorder);
    setWebcamDisplayRecorder(webcamRecorder);

    displayRecorder.start();
    webcamRecorder.start();
    setRecording(Date.now());
    displayRecorder.addEventListener("dataavailable", ({ data }) => {
      if (data.size > 0) {
        displaychunks.push(data);
      }

      const blob = new Blob(displaychunks);

      webmFixDuration(blob, duration).then((fixedBlob) => {
        const blobUrl = URL.createObjectURL(fixedBlob);
        const link = document.createElement("a");

        link.href = blobUrl;
        link.download = `display${endDate}.webm`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);
        displaychunks = [];
        console.log("available");
      });
    });
    webcamRecorder.addEventListener("dataavailable", ({ data }) => {
      if (data.size > 0) {
        webcamchunks.push(data);
      }

      const blob = new Blob(webcamchunks);

      const link = document.createElement("a");
      webmFixDuration(blob, duration).then((fixedBlob) => {
        const blobUrl = URL.createObjectURL(fixedBlob);
        link.href = blobUrl;
        link.download = `webcam${endDate}.webm`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);
        webcamchunks = [];
      });
    });
  };

  const stop = () => {
    if (!displayMediaRecorder) {
      throw new Error("No display media recorder");
    }

    if (!webcamMediaRecorder) {
      throw new Error("No display media recorder");
    }

    displayMediaRecorder.stop();
    webcamMediaRecorder.stop();
    endDate = Date.now();
    duration = endDate - (recording as number);
    setRecording(false);
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((_devices) => {
      setSelectedVideo(_devices[0].deviceId);
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
      <button type="button" onClick={select}>
        Select media
      </button>
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
      Video:
      <select
        onChange={(e) => {
          setSelectedVideo(e.target.value as ConstrainDOMString);
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
      <br />
    </div>
  );
};

export default App;
