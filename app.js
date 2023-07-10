const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const express = require('express'); // call expr
const log = require('./src/logger/winston').LOG;
const { Cors } = require('./src/middleware/cors');
const config = require('./config');
class Server {
    constructor(options) {
        this.config = options;
        this.baseRoute = options.baseRoute;
        this.app = express();
        this.setup();
    }

    setup() {
        this.addMiddlewares();
        this.addRoutes();
    }

    addMiddlewares() {
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.text({ type: '*/xml' }));
        this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
        new Cors().corsConfiguration(this.app);
        this.app.use(morgan('dev'));
        this.app.disable('x-powered-by');
        this.app.use(helmet());
        this.app.use(helmet.dnsPrefetchControl({ allow: false }));
    }

    addRoutes() {
        this.app.get('/health', (req, res) => {
            res.status(200).json({ message: 'Service is healthy' });
        });

        require('./src/route').Routes.setup(this.app);
    }

    startServer() {
        require('./src/database/database-initializer').DatabaseInitializer.getInstance();
        const { port } = this.config.server;
        const server = http.createServer(this.app).listen(port);
        server.timeout = this.config.server.timeout;
        log.debug(`Server is running on port ${port}`);

        process
            .on('unhandledRejection', (reason, p) => {
                // call handler here
                console.log('uncaughtException. Something went wrong with application. Blame this ', reason);
            })
            .on('uncaughtException', (err) => {
                console.log('uncaughtException. Something went wrong with application. Blame this ', err);
            });
    }
}

if (require.main === module) {
    new Server(config).startServer();
}

module.exports = Server;
