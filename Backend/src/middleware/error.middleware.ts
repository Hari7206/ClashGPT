import type { NextFunction, Request, Response } from "express";



const errorMiddleware = ( err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(" Error:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;