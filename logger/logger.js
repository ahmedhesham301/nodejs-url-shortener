import winston from "winston";

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }), // 👈 THIS
        winston.format.json()
    ),
    transports: [new winston.transports.Console()]
}
)