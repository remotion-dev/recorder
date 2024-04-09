import type { NextFunction, Request, Response } from "express";

export const copyEndpoint = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("hello world");
  console.log(req.body);

  res.send("Hello");
};
