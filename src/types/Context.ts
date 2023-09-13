import { Request, Response } from "express";
import { UserAuthPayload } from "./userAuthPayload";

export type Context = {
  req: Request;
  res: Response;
  user?: UserAuthPayload;
};
