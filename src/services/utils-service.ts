export class UtilsService {
  numberConvert = (param: any) =>
    param && !Number.isNaN(param) ? parseInt(param) : null;

  booleanConvert = (param: any) => param === "true" || param === true;

  normalize = (param: any) => {
    // tslint:disable-next-line:triple-equals
    if (typeof param == "string") {
      param = param.replace(/\s+/g, "");
      return JSON.parse(param);
    }
    return param;
  };
}
