import { Request, Response, NextFunction } from "express";

import { CustomError } from "../errors";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
  } else {
    console.error(err);
    res.status(400).send({ errors: [{ message: err.message }] });
  }

  next();
}
