import { SelectedSource } from "./helpers/get-selected-video-source";

const getDisplayStream = async (selectedVideoSource: SelectedSource) => {
  if (selectedVideoSource.type !== "display") {
    throw new Error("Unknown video source type");
  }

  const stream = await window.navigator.mediaDevices
    // GetDisplayMedia asks the user for permission to capture the screen
    .getDisplayMedia({ video: true });

  return stream;
};

const getCameraStram = ({
  selectedVideoSource,
  preferPortrait,
  recordAudio,
  selectedAudioSource,
}: {
  selectedVideoSource: SelectedSource;
  preferPortrait: boolean;
  recordAudio: boolean;
  selectedAudioSource: ConstrainDOMString | null;
}) => {
  if (selectedVideoSource.type !== "camera") {
    throw new Error("Unknown video source type");
  }
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

  return window.navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
};

export const getVideoStream = async ({
  selectedVideoSource,
  preferPortrait,
  recordAudio,
  selectedAudioSource,
}: {
  selectedVideoSource: SelectedSource;
  preferPortrait: boolean;
  recordAudio: boolean;
  selectedAudioSource: ConstrainDOMString | null;
}) => {
  if (selectedVideoSource.type === "display") {
    return getDisplayStream(selectedVideoSource);
  }
  if (selectedVideoSource.type === "camera") {
    return getCameraStram({
      selectedVideoSource,
      preferPortrait,
      recordAudio,
      selectedAudioSource,
    });
  }

  throw new Error("Unknown video source type");
};
