import { createLogger, format, transports } from 'winston'
import { ERR_LOG_FILE } from '../config/configVariables.js'

export const logger = createLogger({
  level: 'debug',
  format: format.json(),
  transports: [
    new transports.Console(),
    new transports.File({ filename: ERR_LOG_FILE, level: 'error' })
  ]
})
