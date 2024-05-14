import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Récupérer le token de l'en-tête d'autorisation
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format attendu "Bearer TOKEN"

  if (token == null) return res.sendStatus(401); // Si aucun token n'est fourni, renvoyer un statut 401 Non Autorisé

  // jwt.verify(token, process.env.TOKEN_KEY as string, (err: any, user: any) => {
  //   if (err) return res.sendStatus(403); // Si le token n'est pas valide ou expiré, renvoyer un statut 403 Interdit
  //   req.app.set("user", user); // Stocker les données décodées du token dans req.user
  //   next(); // Passer au prochain middleware
  // });

  // jwt.verify(token, process.env.TOKEN_KEY as string, (err: any, user: any) => {
  //   if (err) return res.sendStatus(403);
  //   req.user = user; // Modification ici
  //   next();
  // });
  jwt.verify(token, process.env.TOKEN_KEY as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403); // Si le token n'est pas valide ou expiré, renvoyer un statut 403 Interdit
    res.locals.user = user; // Stocker les données décodées du token dans res.locals
    next(); // Passer au prochain middleware
  });
};

export default authenticateToken;
