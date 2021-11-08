import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Not authorized user");

    Object.setPrototypeOf(this, NotAuthorizedError);
  }

  serializeErrors() {
    return [{ message: "Not authorized user" }];
  }
}
