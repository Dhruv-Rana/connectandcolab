const fs = require('fs')
const path = require('path')
const winston = require('winston')

const loggerConsts = require('./../../config/logger')

const logPath = path.join(__dirname, '..', '..', '..', 'log')

let folderStatus = fs.existsSync(logPath)

if (!folderStatus) {
  fs.mkdirSync(logPath)
}

// Un-Comment Lines Below To Enable Log Formatter
// const formatter = winston.format.printf(
//   ({ level, message, additional, label, timestamp }) => {
//     return `${timestamp} [ ${label} ] ${level}
//   message ${
//     typeof message === 'object' ? JSON.stringify(message, null, 2) : message
//   }
//   additional ${additional}`;
//   }
// );

const MainLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
    winston.format.prettyPrint()
    // formatter
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logPath, loggerConsts.name + '.error.log'),
      level: 'error',
      silent:
        !loggerConsts.overall &&
        !loggerConsts.file &&
        !loggerConsts.byLevel.error,
    }),
    new winston.transports.File({
      filename: path.join(logPath, loggerConsts.name + '.combined.log'),
      silent:
        !loggerConsts.overall &&
        !loggerConsts.file &&
        !loggerConsts.byLevel.all,
    }),
    new winston.transports.Console({
      silent: !loggerConsts.overall && !loggerConsts.console,
    }),
  ],
  silent: !loggerConsts.overall,
  exitOnError: false,
})

// logType
// 0 - info
// 1 - error

const logFormatter = (logType, filePath, label, message, additional) => {
  if (logType === 0) {
    MainLogger.info({
      label: filePath + ' => ' + label,
      message: message,
      additional: additional || '',
    })
  } else if (logType === 1) {
    MainLogger.error({
      label: filePath + ' => ' + label,
      message: message,
      additional: additional || '',
    })
  }
}

module.exports = logFormatter
