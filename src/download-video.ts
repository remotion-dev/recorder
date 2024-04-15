import { PROCESS_VIDEOS, UPLOAD_VIDEO } from "../scripts/server/constants";

export const downloadVideo = (data: Blob, endDate: number, prefix: string) => {
  let webcamchunks: Blob[] = [];
  if (data.size > 0) {
    webcamchunks.push(data);
  }

  const blob = new Blob(webcamchunks);

  const link = document.createElement("a");
  const blobUrl = URL.createObjectURL(blob);
  link.href = blobUrl;
  link.download = `${prefix}${endDate}.webm`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(blobUrl);
  webcamchunks = [];
};

export const handleUploadFileToServer = async ({
  blob,
  endDate,
  prefix,
  selectedFolder,
}: {
  blob: Blob;
  endDate: number;
  prefix: string;
  selectedFolder: string;
}) => {
  const videoFile = new File([blob], "video.webm", { type: blob.type });

  const url = new URL(UPLOAD_VIDEO, window.location.origin);

  url.search = new URLSearchParams({
    folder: selectedFolder,
    prefix,
    endDateAsString: endDate.toString(),
  }).toString();

  // might add query params to define name & folder
  const res = await fetch(url, {
    method: "POST",
    body: videoFile,
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message);
  }
};

export const convertFilesInServer = async ({
  endDate,
  selectedFolder,
}: {
  endDate: number;
  selectedFolder: string;
}) => {
  const url = new URL(PROCESS_VIDEOS, window.location.origin);

  url.search = new URLSearchParams({
    folder: selectedFolder,
    endDateAsString: endDate.toString(),
  }).toString();

  // might add query params to define name & folder
  const res = await fetch(url, {
    method: "POST",
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message);
  }
};
