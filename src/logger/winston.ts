require('winston-daily-rotate-file');
const { createLogger, format } = require('winston');
const { combine, timestamp, simple, colorize, splat } = format;
const fs = require('fs');
const winston = require('winston');

const config = require('../../config');
if (!fs.existsSync('logs')) {
    // Create the directory if it does not exist
    fs.mkdirSync('logs');
}

const logger = createLogger({
    format: combine(timestamp(), simple()),
    transports: [
        new winston.transports.Console({
            level: config.log.level,
            format: combine(timestamp(), simple(), splat(), colorize({ all: true }))
        }),

        // new files will be generated each day, the date patter indicates the frequency of creating a file.
        new winston.transports.DailyRotateFile({
            filename: 'logs/debug-%DATE%.log',
            level: 'debug',
            prepend: true,
            datePattern: config.log.datePattern,
            maxFiles: 200,
            maxSize: 1024 * 1024 * 10
        }),
        new winston.transports.DailyRotateFile({
            filename: 'logs/errors-%DATE%.log',
            level: 'error',
            prepend: true,
            datePattern: config.log.datePattern,
            maxFiles: 200,
            maxSize: 1024 * 1024 * 10
        }),
        ...(config.log.storage === 'remote'
            ? [
                  new winston.transports.Http({
                      host: config.log.fluentd.host,
                      port: config.log.fluentd.port,
                      path: config.log.fluentd.path
                  })
              ]
            : [])
    ]
});

const logging = {
    error: (functionName: any, data: any, ...args: any[]) =>
        logger.error(JSON.stringify({ requestMethod: functionName, data, otherArgument: args })),
    debug: (functionName: any, data: any, ...args: any[]) =>
        logger.debug(JSON.stringify({ requestMethod: functionName, data, otherArgument: args })),
    info: (functionName: any, data: any, ...args: any[]) =>
        logger.info(JSON.stringify({ requestMethod: functionName, data, otherArgument: args }))
};

console.info = logging.info.bind(logging);
console.warn = logging.debug.bind(logging);
console.error = logging.error.bind(logging);
console.debug = logging.debug.bind(logging);

Object.defineProperty(exports, 'LOG', { value: logging });
