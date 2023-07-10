const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const config = require("../../config");
const db: any = {};
class DatabaseService {
  static instance: any;

  private static async getInstance() {
    if (DatabaseService.instance) {
      return DatabaseService.instance;
    }
    // create your instance of sequelize
    const sequelize = new Sequelize(
      config.db.database,
      config.db.username,
      config.db.password,
      {
        host: config.db.host,
        port: config.db.port,
        dialect: "mysql",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    );

    sequelize.authenticate().then((err: any) => {
      if (!!err) {
        console.log("Unable to connect to the database:", err);
      } else {
        console.log("Connection has been established successfully.");
      }
    });

    // loop through all files in models directory ignoring hidden files and this file
    fs.readdirSync(config.dbModelsDir)
      .filter(
        (file: string) =>
          file.indexOf(".") !== 0 &&
          file !== "index.js" &&
          path.extname(file) === ".js"
      )
      // import model files and save model names
      .forEach((file: string) => {
        const model = require(path.join(config.dbModelsDir, file))(
          sequelize,
          Sequelize.DataTypes
        );
        db[model.name] = model;
      });
    // invoke associations on each of the models
    Object.keys(db).forEach((modelName) => {
      if (
        Object.prototype.hasOwnProperty.call(db[modelName].options, "associate")
      ) {
        db[modelName].options.associate(db);
      }
    });

    // assign the sequelize letiables to the db object and returning the db.
    DatabaseService.instance = _.extend(
      {
        sequelize,
        Sequelize,
      },
      db
    );
    return DatabaseService.instance;
  }

  async getDb(): Promise<any> {
    return DatabaseService.getInstance();
  }
}

export default new DatabaseService();
