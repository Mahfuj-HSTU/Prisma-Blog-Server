import type { NextFunction, Request, Response } from 'express'

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('checking error')
  res.status(500)
  res.json({
    success: false,
    message: err
  })
}

export default errorHandler
