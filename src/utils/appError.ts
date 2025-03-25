import AppErrorCode from "../constants/appErrorCode";
import HttpStatus from "../constants/httpStatus";

class AppError extends Error {
  constructor(
    public statusCode: HttpStatus,
    public message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);
  }
}

export default AppError