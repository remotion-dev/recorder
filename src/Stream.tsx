import type { Dimensions } from "@remotion/layout-utils";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Spinner } from "./components/Spinner";
import { CropIndicator } from "./CropIndicator";
import type { SelectedSource } from "./video-source";
import type { Prefix } from "./Views";

const container: React.CSSProperties = {
  flex: 1,
  overflow: "hidden",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

type StreamState = "initial" | "loading" | "loaded";

export const Stream: React.FC<{
  prefix: Prefix;
  setMediaStream: (prefix: Prefix, source: MediaStream | null) => void;
  mediaStream: MediaStream | null;
  resolution: Dimensions | null;
  setResolution: React.Dispatch<React.SetStateAction<Dimensions | null>>;
  recordAudio: boolean;
  showCropIndicator: boolean;
  selectedVideoSource: SelectedSource | null;
  selectedAudioSource: ConstrainDOMString | null;
  preferPortrait: boolean;
}> = ({
  prefix,
  mediaStream,
  setMediaStream,
  resolution,
  setResolution,
  recordAudio,
  showCropIndicator,
  selectedVideoSource,
  selectedAudioSource,
  preferPortrait,
}) => {
  const [streamState, setStreamState] = useState<StreamState>("initial");

  const sourceRef = useRef<HTMLVideoElement>(null);

  const dynamicVideoStyle: React.CSSProperties = useMemo(() => {
    return {
      opacity: mediaStream ? 1 : 0,
      height: "100%",
    };
  }, [mediaStream]);

  useEffect(() => {
    if (mediaStream) {
      const track = mediaStream.getVideoTracks()[0];
      if (!track) {
        return;
      }

      track.onended = () => {
        setMediaStream(prefix, null);
      };
    }
  }, [mediaStream, prefix, setMediaStream]);

  useEffect(() => {
    if (recordAudio) {
      return () => {
        mediaStream?.getVideoTracks().forEach((track) => track.stop());
        mediaStream?.getAudioTracks().forEach((track) => track.stop());
      };
    }

    return () => {
      mediaStream?.getVideoTracks().forEach((track) => track.stop());
    };
  }, [mediaStream, recordAudio]);

  useEffect(() => {
    const { current } = sourceRef;
    if (!current) {
      return;
    }

    if (selectedVideoSource === null) {
      setMediaStream(prefix, null);
      return;
    }

    setStreamState("loading");
    const video: MediaTrackConstraints = {
      deviceId: selectedVideoSource.deviceId,
      width: preferPortrait
        ? undefined
        : selectedVideoSource.maxWidth
          ? { min: selectedVideoSource.maxWidth }
          : undefined,
      height: preferPortrait
        ? selectedVideoSource.maxHeight
          ? { min: selectedVideoSource.maxHeight }
          : undefined
        : undefined,
    };

    const mediaStreamConstraints: MediaStreamConstraints = {
      video,
      audio:
        recordAudio && selectedAudioSource
          ? { deviceId: selectedAudioSource }
          : undefined,
    };

    const cleanup: Function[] = [];

    window.navigator.mediaDevices
      .getUserMedia(mediaStreamConstraints)
      .then((stream) => {
        if (current) {
          current.srcObject = stream;
          current.play();
        }

        cleanup.push(() => {
          stream.getVideoTracks().forEach((track) => track.stop());
          stream.getAudioTracks().forEach((track) => track.stop());
          current.srcObject = null;
        });

        setMediaStream(prefix, stream);
        setStreamState("loaded");
      })
      .catch((e) => {
        if (e.name === "NotReadableError") {
          // eslint-disable-next-line no-alert
          alert(
            "The selected device is not readable. Is the device already in use by another program?",
          );
        } else {
          console.log(e);
        }

        setMediaStream(prefix, null);
        setStreamState("initial");
      });

    return () => {
      cleanup.forEach((f) => f());
    };
  }, [
    preferPortrait,
    prefix,
    recordAudio,
    selectedAudioSource,
    selectedVideoSource,
    setMediaStream,
  ]);

  const onLoadedMetadata = useCallback(() => {
    setResolution({
      width: sourceRef.current?.videoWidth as number,
      height: sourceRef.current?.videoHeight as number,
    });
  }, [setResolution]);

  return (
    <div style={container} id={prefix + "-video-container"}>
      <video
        ref={sourceRef}
        muted
        style={dynamicVideoStyle}
        onLoadedMetadata={onLoadedMetadata}
      />
      {streamState === "loading" ? <Spinner /> : null}
      {showCropIndicator && resolution ? (
        <CropIndicator resolution={resolution} />
      ) : null}
    </div>
  );
};
