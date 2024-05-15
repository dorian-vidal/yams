import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_KEY as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    res.locals.user = user;
    next();
  });
};

export default authenticateToken;
