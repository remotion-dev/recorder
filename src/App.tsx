/* eslint-disable no-alert */
import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { onVideo } from "./on-video";

let endDate = 0;

const mediaRecorderOptions: MediaRecorderOptions = {
  audioBitsPerSecond: 128000,
  mimeType: "video/webm;codecs=h264,opus",
  videoBitsPerSecond: 8 * 4000000,
};

const App = () => {
  const liveRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const virtualScreenRef = useRef<HTMLVideoElement>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [display, setDisplay] = useState<MediaStream | null>(null);
  const [webcam, setWebcam] = useState<MediaStream | null>(null);
  const [virtualScreen, setVirtualScreen] = useState<MediaStream | null>(null);
  const [displayMediaRecorder, setMediaDisplayRecorder] =
    useState<MediaRecorder | null>(null);
  const [webcamMediaRecorder, setWebcamDisplayRecorder] =
    useState<MediaRecorder | null>(null);
  const [virtualScreenRecorder, setVirtualScreenRecorder] =
    useState<MediaRecorder | null>(null);
  const [recording, setRecording] = useState<number | false>(false);

  const [selectedWebcam, setSelectedWebcamVideo] =
    useState<ConstrainDOMString | null>(null);
  const [selectedScreen, setSelectedScreen] =
    useState<ConstrainDOMString | null>(null);

  const selectWebcam = useCallback(() => {
    const microphone = devices.find(
      (d) => d.kind === "audioinput" && d.label.includes("NT-USB"),
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
        // Highest possible resolution up to 1080p
        video: {
          deviceId: selectedWebcam,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      .then((stream) => {
        if (liveRef.current) {
          liveRef.current.srcObject = stream;
          liveRef.current.play();
        }

        setWebcam(stream);
      });
  }, [selectedWebcam]);

  const selectVirtualScreen = useCallback(() => {
    if (!selectedScreen) {
      alert("No video selected");
      return;
    }

    window.navigator.mediaDevices
      .getUserMedia({
        video: { deviceId: selectedScreen },
      })
      .then((stream) => {
        if (virtualScreenRef.current) {
          virtualScreenRef.current.srcObject = stream;
          virtualScreenRef.current.play();
        }

        setVirtualScreen(stream);
      });
  }, [selectedScreen]);

  const selectscreen = () => {
    window.navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then((stream) => {
        setDisplay(stream);
        if (!screenRef.current) {
          return;
        }

        screenRef.current.srcObject = stream;
        screenRef.current.play();
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
        onVideo(data, endDate, "display");
      });
      toStart.push(() => displayRecorder.start());
    } else {
      setMediaDisplayRecorder(null);
    }

    if (webcam) {
      const webcamRecorder = new MediaRecorder(webcam, mediaRecorderOptions);
      setWebcamDisplayRecorder(webcamRecorder);
      webcamRecorder.addEventListener("dataavailable", ({ data }) => {
        onVideo(data, endDate, "webcam");
      });

      toStart.push(() => webcamRecorder.start());
    } else {
      setWebcamDisplayRecorder(null);
    }

    if (virtualScreen) {
      const recorder = new MediaRecorder(virtualScreen, mediaRecorderOptions);
      setVirtualScreenRecorder(recorder);
      recorder.addEventListener("dataavailable", ({ data }) => {
        onVideo(data, endDate, "display");
      });

      toStart.push(() => recorder.start());
    } else {
      setVirtualScreenRecorder(null);
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

    if (virtualScreenRecorder) {
      virtualScreenRecorder.stop();
    }

    endDate = Date.now();
    setRecording(false);
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((_devices) => {
      console.log(_devices);
      setSelectedWebcamVideo(_devices[0].deviceId);
      setDevices(_devices);
    });
  }, []);

  useEffect(() => {
    if (devices.length > 0) {
      selectWebcam();
    }
  }, [devices, selectWebcam]);

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
        disabled={!webcam || recording !== false}
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
            {webcam && (
              <td>
                <video ref={liveRef} muted width="640" />
              </td>
            )}
            {display && (
              <td>
                <video ref={screenRef} muted width="640" />
              </td>
            )}
            {virtualScreen && (
              <td>
                <video ref={virtualScreenRef} muted width="640" />
              </td>
            )}
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
      <button type="button" onClick={selectWebcam}>
        Confirm
      </button>{" "}
      <br />
      Virtual screen:{" "}
      <select
        onChange={(e) => {
          setSelectedScreen(e.target.value as ConstrainDOMString);
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
      <button type="button" onClick={selectVirtualScreen}>
        Confirm
      </button>{" "}
      <br />
    </div>
  );
};

export default App;
