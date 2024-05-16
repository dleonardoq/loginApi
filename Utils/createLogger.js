import { createLogger, format, transports } from 'winston'
import { ERR_LOG_FILE, NODE_ENV } from '../config/configVariables.js'

export const logger = createLogger({
  level: 'debug',
  format: format.json(),
  transports: (NODE_ENV === 'test')
    ? [
        new transports.File({ filename: ERR_LOG_FILE, level: 'error' })
      ]
    : [
        new transports.Console(),
        new transports.File({ filename: ERR_LOG_FILE, level: 'error' })
      ]
})
