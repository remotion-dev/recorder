import type { Request, Response } from "express";
import { existsSync, mkdirSync } from "fs";
import path from "path";

export const createProject = (req: Request, res: Response, rootDir: string) => {
  const { projectName } = req.body;

  if (projectName === "") {
    res.status(500);
    return res.send({
      success: false,
      message: "Empty string is an invalid project name",
    });
  }

  const finalPath = path.join(rootDir, "public", projectName);

  if (existsSync(finalPath)) {
    res.status(409);
    return res.send({
      success: false,
      message: `Name conflict: A project named "${projectName}" already exists. Choose another name.`,
    });
  }

  try {
    mkdirSync(finalPath);
    res.status(201);
    res.send({ success: true, message: "Project successfully created." });
  } catch (e) {
    res.status(500);
    return res.send({
      success: false,
      message: "Something went wrong while creating the new folder.",
    });
  }
};
