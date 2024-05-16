import { JWT_KEY } from '../../config/configVariables.js'
import jwt from 'jsonwebtoken'
import { logger } from '../../Utils/createLogger.js'

export const validateAccessToken = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization
    if (!accessToken) {
      res.status(401).json({ error: 'Access denied' })
    }

    jwt.verify(accessToken, JWT_KEY, (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: 'Access denied, token expired or incorrect' })
      }
      next()
    })
  } catch (error) {
    logger.error('Error -> ', error)
    return { status: 500, data: { message: 'Internal server error' } }
  }
}
