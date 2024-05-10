import { UPLOAD_VIDEO } from "../../scripts/server/constants";

export const uploadFileToServer = async ({
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
