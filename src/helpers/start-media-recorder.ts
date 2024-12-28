import { WEBCAM_PREFIX } from "../../config/cameras";
import { Prefix } from "./prefixes";

const mediaRecorderOptions: MediaRecorderOptions = {
  audioBitsPerSecond: 128000,
  videoBitsPerSecond: 8 * 4000000,
  // @ts-expect-error - not in the types yet
  videoKeyFrameIntervalDuration: 2,
};

export type FinishedRecording = {
  prefix: string;
  data: Blob;
  endDate: number;
};

export const startMediaRecorder = (
  prefix: Prefix,
  source: MediaStream | null,
) => {
  if (!source) {
    return null;
  }

  const mimeType =
    prefix === WEBCAM_PREFIX
      ? "video/webm;codecs=vp8,opus"
      : "video/webm;codecs=vp8";

  const completeMediaRecorderOptions = {
    ...mediaRecorderOptions,
    mimeType,
  };

  const recorder = new MediaRecorder(source, completeMediaRecorderOptions);

  const waitUntilDone = new Promise<FinishedRecording>((resolve, reject) => {
    recorder.addEventListener("dataavailable", ({ data }) => {
      resolve({
        prefix,
        data,
        endDate: Date.now(),
      });
    });

    recorder.addEventListener("error", (event) => {
      console.log(event);
      reject(new Error(`Error recording ${prefix}`));
    });
  });

  recorder.start();

  return { recorder, waitUntilDone };
};
