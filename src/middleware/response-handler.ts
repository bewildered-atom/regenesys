import { ErrorFactory } from "../services/error-factory";
const log: any = require("../logger/winston").LOG;

export class ResponseHandler {
  private errorFactory = new ErrorFactory();
  public sendSuccess = (req: any, res: any, data: any, code: any = 200) => {
    log.info("sendSuccess", data);
    res.status(code).json({ status: 1, ...(data && { data }) });
  };

  public sendError = (req: any, res: any, error: any) => {
    log.debug("sendError", error);
    if (error && error.error && error.transactionReferenceId) {
      res.status(error.statusCode || 200).json({
        status: 0,
        error: {
          code: error.error.code,
          message: error.error.message,
          transactionReferenceId: error.transactionReferenceId,
          ...(error.transactionStatus && {
            transactionStatus: error.transactionStatus,
          }),
        },
      });
    } else {
      res.status(error.statusCode || 500).json({
        status: 0,
        error: {
          code: error.code,
          message: error.message || error,
        },
      });
    }
  };
  public sendResponse = (req: any, res: any, data: any) => {
    log.info("sendResponse", data);
    const { message: msg = {}, code = 404 } = data;
    res.format({
      [req.headers["content-type"]]() {
        res.status(code).send(msg);
      },

      "application/json": function () {
        res.status(code).send(msg);
      },
    });
  };
  public sendXML = (req: any, res: any, data: any) => {
    log.info("sendXML", data);
    res.set("Content-type", "type/xml");
    res.send(data);
  };
  public sendErrorXML = (req: any, res: any, error: any) => {
    log.info("sendXML", error);
    res.set("Content-type", "type/xml");
    res.send(error);
  };
}
