const cors = require('cors');
const config: any = require('../../config');

export class Cors {
    corsConfiguration = (app: any) => {
        const corsOptions = {
            origin(origin: any, callback: any) {
                if (config.server.allowedOrigins.indexOf(origin) !== -1 || config.server.allowedOrigins[0] === '*') {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            }
        };

        app.use(cors(corsOptions));
    };
}
