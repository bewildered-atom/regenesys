import { Users } from "./users";
import { AuthenticateJWTToken } from "../middleware/authenticate-JWT-token";

const config: any = require("../../config");

export class Routes {
  public static setup(app: any) {
    app.use(
      `/api/v1/users`,
      AuthenticateJWTToken.authenticateAccount,
      Users.manageUsers
    );
  }
}
