import type { Request, Response } from "express";
import { copyToDownloads } from "../../copy";

export const copyEndpoint = async (req: Request, res: Response) => {
  try {
    await copyToDownloads();
  } catch (e) {
    console.error(e);
    return res.end(`Error while copying from downloads! ${e}`);
  }

  res.send("Successfully copied!");
};
