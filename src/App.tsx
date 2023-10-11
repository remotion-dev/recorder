/* eslint-disable no-alert */
import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { onVideo } from "./on-video";
import { View } from "./Views";

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
  const [mediaSources, setMediaSources] = useState<MediaStream[]>([]);
  console.log("mediaSources", mediaSources);
  const addMediaSource = useCallback(
    (source: MediaStream) => {
      const filteredSources = mediaSources.filter((s) => s.id === source.id);

      if (filteredSources.length > 0) {
        return;
      }

      setMediaSources([...mediaSources, source]);
    },
    [mediaSources],
  );

  const removeMediaSource = useCallback(
    (source: MediaStream) => {
      const filteredSources = mediaSources.filter((s) => s.id !== source.id);
      if (filteredSources.length === mediaSources.length) {
        return;
      }

      setMediaSources(filteredSources);
    },
    [mediaSources],
  );

  const selectWebcam = useCallback(() => {
    // const microphone = devices.find(
    //   (d) => d.kind === "audioinput" && d.label.includes("NT-USB"),
    // );

    // if (!microphone) {
    //   alert("NT USB mic is not connected");
    //   return;
    // }

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
        // audio: { deviceId: microphone.deviceId },
      })
      .then((stream) => {
        if (liveRef.current) {
          liveRef.current.srcObject = stream;
          liveRef.current.play();
        }

        setWebcam(stream);
      });
  }, [selectedWebcam]);

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
                <View
                  name={"Webcam"}
                  recordAudio
                  devices={devices}
                  addMediaSource={addMediaSource}
                  removeMediaSource={removeMediaSource}
                />
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
      <View
        name={"Screen1"}
        recordAudio={false}
        devices={devices}
        addMediaSource={addMediaSource}
        removeMediaSource={removeMediaSource}
      />
    </div>
  );
};

export default App;
