import * as dotenv from 'dotenv';
import { UtilsService } from '../src/services/utils-service';
const dbConfig = require('./db.config');
const path = require('path');

const utilService = new UtilsService();
dotenv.config();
export class Config {
    static get config() {
        return {
            db: { ...dbConfig.development },
            auth: {
                username: 'shivam',
                password: 'shivam'
            },
            server: {
                timeout: process.env.SERVER_TIMEOUT || 10 * 60 * 1000,
                port: process.env.SERVER_PORT || 10040,
                allowedOrigins: utilService.normalize(process.env.ALLOWED_ORIGINS) || ['*']
            },
            log: {
                enableSequelizeLog: false,
                level: process.env.LOGS_LEVEL || 'debug',
                maxFiles: process.env.LOGS_MAX_FILES || 60,
                datePattern: process.env.LOGS_DATE_PATTERN || 'DD-MM-YYYY',
                storage: process.env.LOG_STORAGE || 'file'
            },
            dbModelsDir: path.join(__dirname, '/../') + '/src/database/model',
            rootPath: path.join(__dirname, '/../')
        };
    }
}
