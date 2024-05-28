/* eslint-disable no-negated-condition */
/* eslint-disable no-alert */
import { useCallback, useEffect, useMemo, useState } from "react";
import { WEBCAM_PREFIX } from "../config/cameras";
import type { Dimensions } from "../config/layout";
import { getDeviceLabel } from "./App";
import { AudioSelector } from "./AudioSelector";
import { PrefixAndResolution } from "./PrefixAndResolution";
import { ToggleRotate } from "./Rotate";
import { Stream } from "./Stream";
import { ToggleCrop } from "./ToggleCrop";
import { VolumeMeter } from "./components/VolumeMeter";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { canRotateCamera } from "./helpers/can-rotate-camera";
import {
  SelectedSource,
  VIDEO_SIZES,
  VideoSize,
  getSelectedVideoSource,
} from "./helpers/get-selected-video-source";
import { Prefix } from "./helpers/prefixes";

const viewContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  margin: 10,
  backgroundColor: "#242424",
  borderRadius: 10,
  overflow: "hidden",
  width: "100%",
  height: "100%",
  maxHeight: "100%",
  maxWidth: "100%",
};

const viewName: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  padding: 4,
  paddingLeft: 10,
};

const localStorageKey = "showCropIndicator";

export const View: React.FC<{
  devices: MediaDeviceInfo[];
  setMediaStream: (prefix: Prefix, source: MediaStream | null) => void;
  mediaStream: MediaStream | null;
  prefix: Prefix;
}> = ({ devices, setMediaStream, prefix, mediaStream }) => {
  const initialCropIndicatorState = useMemo(() => {
    return (
      localStorage.getItem(localStorageKey) === "true" &&
      prefix === WEBCAM_PREFIX
    );
  }, [prefix]);

  const [showCropIndicator, setShowCropIndicator] = useState(
    initialCropIndicatorState,
  );

  const [selectedAudioSource, setSelectedAudioSource] =
    useState<ConstrainDOMString | null>(null);
  const [selectedVideoSource, setSelectedVideoSource] =
    useState<SelectedSource | null>(null);
  const recordAudio = prefix === WEBCAM_PREFIX;
  const [resolution, setResolution] = useState<Dimensions | null>(null);
  const [preferPortrait, setPreferPortrait] = useState(false);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
  const [activeVideoSize, setActiveVideoSize] = useState<VideoSize>(
    VideoSize.HD,
  );
  const [activeVideoMaxSize, setActiveVideoMaxSize] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  const onToggleCrop = useCallback(() => {
    setShowCropIndicator((prev) => {
      window.localStorage.setItem(localStorageKey, String(!prev));
      return !prev;
    });
  }, []);

  const onToggleRotate = useCallback(() => {
    setPreferPortrait((prev) => {
      return !prev;
    });
  }, []);

  const selectScreen = useCallback(async () => {
    setSelectedVideoSource({ type: "display" });
  }, [prefix, setMediaStream]);

  useEffect(() => {
    activeDeviceId &&
      setSelectedVideoSource(
        getSelectedVideoSource({
          value: activeDeviceId,
          devices,
          size: activeVideoSize,
        }),
      );
  }, [activeDeviceId, activeVideoSize]);

  useEffect(() => {
    const device = devices.find((d) => d.deviceId === activeDeviceId);

    if (
      typeof InputDeviceInfo !== "undefined" &&
      device instanceof InputDeviceInfo
    ) {
      const capabilities = device.getCapabilities();
      setActiveVideoMaxSize({
        width: capabilities.width?.max ?? 0,
        height: capabilities.height?.max ?? 0,
      });
    } else {
      setActiveVideoMaxSize({ width: 0, height: 0 });
    }
  }, [activeDeviceId]);

  const cameraRotateable = canRotateCamera({
    selectedSource: selectedVideoSource,
    preferPortrait,
    resolution,
  });

  return (
    <div style={viewContainer}>
      <div style={viewName}>
        <PrefixAndResolution prefix={prefix} resolution={resolution} />
        {prefix === WEBCAM_PREFIX ? (
          <ToggleCrop
            pressed={showCropIndicator}
            onPressedChange={onToggleCrop}
          />
        ) : null}
        {cameraRotateable ? (
          <ToggleRotate
            pressed={preferPortrait}
            onPressedChange={onToggleRotate}
          />
        ) : null}
        <Select onValueChange={(value: string) => setActiveDeviceId(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select video" />
          </SelectTrigger>
          <SelectContent>
            {devices
              .filter((d) => d.kind === "videoinput")
              .map((d) => {
                const label = getDeviceLabel(d);
                return (
                  <SelectItem key={d.deviceId} value={d.deviceId}>
                    {label}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>
        {Boolean(activeDeviceId) && (
          <div>
            <Select
              onValueChange={(value: VideoSize) => setActiveVideoSize(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={VideoSize.HD} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(VideoSize)
                  .filter(
                    ([, value]) =>
                      VIDEO_SIZES[value].width <= activeVideoMaxSize.width &&
                      VIDEO_SIZES[value].height <= activeVideoMaxSize.height,
                  )
                  .map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      <span style={{ whiteSpace: "nowrap" }}>{key}</span>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {prefix !== WEBCAM_PREFIX ? (
          <Button type="button" onClick={selectScreen}>
            Select screen
          </Button>
        ) : null}

        {recordAudio ? (
          <AudioSelector
            devices={devices}
            setSelectedAudioSource={setSelectedAudioSource}
            audioSource={selectedAudioSource}
          />
        ) : null}
      </div>
      {prefix === WEBCAM_PREFIX ? (
        <VolumeMeter mediaStream={mediaStream} />
      ) : null}
      <Stream
        selectedAudioSource={selectedAudioSource}
        selectedVideoSource={selectedVideoSource}
        recordAudio={recordAudio}
        resolution={resolution}
        setResolution={setResolution}
        mediaStream={mediaStream}
        setMediaStream={setMediaStream}
        prefix={prefix}
        showCropIndicator={showCropIndicator}
        preferPortrait={preferPortrait}
      />
    </div>
  );
};
