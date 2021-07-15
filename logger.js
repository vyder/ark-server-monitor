const { DateTime } = require('luxon')
const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file')

const _createLogger = config => {
    const convertTimestamp = timestamp => {
        const dt = DateTime.fromISO(timestamp)
        if (config.TIMEZONE) {
            dt.setZone(config.TIMEZONE)
            return dt.toISO()
        } else {
            return dt.toUTC()
        }
    }

    const simpleFormat = format.printf(({ level, message, timestamp }) => {
        return `${convertTimestamp(timestamp)} ${level.toUpperCase()}: ${message}`
    })
    const formats = format.combine(
        format.splat(),
        format.timestamp(),
        simpleFormat,
    )

    const rotateTransport = new transports.DailyRotateFile({
        filename: 'log/monitor-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '7d'
    })

    const logger  = createLogger({
        format: formats,
        transports: [rotateTransport]
    })
    if (process.env.NODE_ENV !== 'production') {
        logger.add(new transports.Console())
    }

    return logger
}

module.exports = _createLogger