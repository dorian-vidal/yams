// Dans custom.d.ts ou tout autre fichier .d.ts approprié
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // Utiliser `any` ou un type plus spécifique si disponible
    }
  }
}
