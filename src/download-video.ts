import { UPLOAD_VIDEO } from "../scripts/server/constants";

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

export const handleUploadFileToServer = async (
  data: Blob,
  endDate: number,
  prefix: string,
  selectedProject: string,
) => {
  const videoFile = new File([data], "video.webm", { type: data.type });

  const url = new URL(UPLOAD_VIDEO, window.location.origin);

  url.search = new URLSearchParams({
    folder: selectedProject,
    prefix,
    endDateAsString: endDate.toString(),
  }).toString();

  // might add query params to define name & folder
  const res = await fetch(url, {
    method: "POST",
    body: videoFile,
  });

  if (res.status !== 200) {
    throw new Error("Error occured while downloading the video");
  }
};
