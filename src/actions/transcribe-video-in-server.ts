import { TRANSCRIBE_VIDEO } from "../../scripts/server/constants";

export const transcribeVideoInServer = async ({
  endDate,
  selectedFolder,
}: {
  endDate: number;
  selectedFolder: string;
}) => {
  const url = new URL(TRANSCRIBE_VIDEO, window.location.origin);

  url.search = new URLSearchParams({
    folder: selectedFolder,
    endDateAsString: endDate.toString(),
  }).toString();

  const res = await fetch(url, { method: "POST" });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message);
  }
};
