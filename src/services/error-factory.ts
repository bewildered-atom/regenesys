export class ErrorFactory {
  public databaseError = (err?: any) => {
    if (err) {
      if (err.code && err.statusCode && err.message) {
        return err;
      }
      if (err.errors) {
        return {
          code: "INTERNAL_SERVER_ERROR",
          statusCode: 500,
          message: err.errors.map((e: any) => e.message),
        };
      }
      if (err.message) {
        return {
          code: "INTERNAL_SERVER_ERROR",
          statusCode: 500,
          message: err.message,
        };
      }
      return {
        code: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
        message: "internal server error",
      };
    }
    return {
      code: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
      message: "internal server error",
    };
  };

  public unauthorizedRequest = (code: any = "", err?: any) => {
    if (err && err.code && err.statusCode && err.message) {
      return err;
    }
    return {
      code: "UNAUTHORIZED_REQUEST",
      statusCode: 401,
      message: code,
    };
  };
  public invalidParameter = (msg: any) => ({
    code: "INVALID_PARAMETERS",
    statusCode: 422,
    message: msg,
  });
  public notFoundData = (code: any) => ({
    code: "INVALID_REQUEST",
    statusCode: 404,
    message: code,
  });
}
