import express, { Request, Response } from "express";
import connectDb from "./src/config/database.config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authenticateToken from "./authenticateToken"; // Ajustez le chemin selon votre structure de projet
import { rollDice, checkCombination } from "./gameLogic"; // Assurez-vous que le chemin est correct
import exportPastries from "./exportPastries";
import PastryEntity from "./src/entity/Pastry.model";
import cors from "cors";
import Game from "./src/models/Game";

const User = require("./src/entity/User.model");

const app = express();
const port = 8080;

async function checkStockAvailability() {
  const totalAvailable = await PastryEntity.countDocuments({
    stock: { $gt: 0 },
  });
  return totalAvailable > 0;
}

// Middleware pour parser le JSON dans les corps de requête
app.use(express.json());
app.use(cors());

app.get("/", async (req: Request, res: Response) => {
  const users = await User.find();
  res.send(users);
});

// Endpoint pour l'inscription
app.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send("All input is required");
      return;
    }

    const oldUser = await User.findOne({ username });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: encryptedPassword,
    });

    await user.save();

    const game = new Game({
      userId: user._id,
      dices: [1, 2, 3, 4, 5],
      combination: null,
      winnings: [],
      attemptsLeft: 3,
      createdAt: new Date(),
    });

    await game.save();

    // Création du token JWT
    // const token = "toto";
    const token = jwt.sign(
      { user_id: user._id, username },
      String(process.env.TOKEN_KEY), // Utilisez une clé secrète stockée dans vos variables d'environnement
      {
        expiresIn: "1h", // Définissez une durée de validité pour le token
      }
    );

    // Renvoyer le token en réponse
    res.status(201).json({ token });
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    // Extraire le nom d'utilisateur et le mot de passe de la requête
    const { username, password } = req.body;

    // Vérifier si le nom d'utilisateur et le mot de passe ont été fournis
    if (!(username && password)) {
      res.status(400).send("All input is required");
      return;
    }

    // Rechercher l'utilisateur par son nom d'utilisateur
    const user = await User.findOne({ username });

    // Si l'utilisateur existe et que les mots de passe correspondent
    if (user && (await bcrypt.compare(password, user.password))) {
      // Générer un token JWT
      const token = jwt.sign(
        { user_id: user._id, username },
        String(process.env.TOKEN_KEY),
        {
          expiresIn: "1h",
        }
      );

      // Renvoyer le token à l'utilisateur
      res.status(200).json({ token });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

// app.post("/play", authenticateToken, async (req: Request, res: Response) => {
//   // const user = req.app.get("user"); // Récupérer l'utilisateur à partir du JWT
//   const user = res.locals.user; // Modifié pour correspondre à la nouvelle façon de stocker l'utilisateur

//   const userData = await User.findOne({ _id: user.user_id });

//   if (!userData) {
//     return res.status(404).send("User not found");
//   }

//   if (userData.attempts <= 0) {
//     return res.status(400).send("No attempts left");
//   }

//   userData.attempts -= 1; // Décrémenter une tentative
//   const rolls = rollDice();
//   const combination = checkCombination(rolls);

//   let winnings = 0;
//   let wonPastriesIds = [];
//   if (combination === "YAMS") winnings = 3;
//   else if (combination === "CARRÉ") winnings = 2;
//   else if (combination === "DOUBLE") winnings = 1;

//   // Logique pour attribuer les pâtisseries ici
//   if (winnings > 0) {
//     const availablePastries = await PastryEntity.find({ stock: { $gt: 0 } });
//     const wonPastries = [];

//     for (let i = 0; i < winnings && availablePastries.length > i; i++) {
//       const pastry = availablePastries[i];
//       pastry.stock -= 1;
//       await pastry.save();

//       userData.winnings.push(pastry._id); // Ajoutez l'ID de la pâtisserie gagnée aux gains de l'utilisateur
//       wonPastries.push(pastry); // Ajoutez la pâtisserie gagnée à la réponse
//     }

//     wonPastriesIds = wonPastries.map((p) => p._id);
//     res.json({ rolls, combination, winnings: wonPastries.map((p) => p.name) });
//   } else {
//     res.json({ rolls, combination, winnings: "No winnings" });
//   }

//   const game = new Game({
//     userId: res.locals.user.user_id,
//     dices: rolls,
//     combination,
//     winnings: wonPastriesIds,
//     attemptsLeft: userData.attempts,
//     createdAt: new Date(),
//   });

//   await game.save();
//   await userData.save();
// });

app.post("/play", authenticateToken, async (req: Request, res: Response) => {
  const user = res.locals.user; // Récupérer l'utilisateur à partir du JWT

  const userData = await User.findOne({ _id: user.user_id });

  if (!userData) {
    return res.status(404).send("User not found");
  }

  if (userData.attempts <= 0) {
    return res.status(400).send("No attempts left");
  }

  const rolls = rollDice();
  const combination = checkCombination(rolls);

  let winnings = 0;
  let wonPastries = []; // Déclaration de la variable ici pour utilisation dans toute la portée de la fonction
  if (combination === "YAMS") winnings = 3;
  else if (combination === "CARRÉ") winnings = 2;
  else if (combination === "DOUBLE") winnings = 1;

  if (winnings > 0) {
    const availablePastries = await PastryEntity.find({
      stock: { $gt: 0 },
    }).limit(winnings);
    wonPastries = []; // Initialiser à nouveau pour être sûr

    for (const pastry of availablePastries) {
      pastry.stock -= 1;
      await pastry.save();

      userData.winnings.push(pastry._id);
      wonPastries.push(pastry);
    }

    userData.attempts = 0; // Réinitialiser les tentatives si l'utilisateur gagne
    await userData.save();
  } else {
    userData.attempts -= 1; // Décrémenter une tentative seulement si l'utilisateur n'a pas gagné
    await userData.save();
  }

  const game = new Game({
    userId: userData._id,
    dices: rolls,
    combination: combination,
    winnings: wonPastries.map((p) => p._id),
    attemptsLeft: userData.attempts,
    createdAt: new Date(),
  });

  await game.save();

  res.json({
    rolls: rolls,
    combination: combination,
    winnings: wonPastries.map((p: any) => p.name), // Typage explicite si nécessaire
    attemptsLeft: userData.attempts,
  });
});

app.get("/results", async (req: Request, res: Response) => {
  const games = await Game.find({ winnings: { $ne: [] } })
    .populate({
      path: "userId",
      select: "-password",
    })
    .populate("winnings")
    .sort({ createdAt: "desc" });
  res.json(games);
});

// app.post("/reset-stocks", async (req: Request, res: Response) => {
//   try {
//     // Réinitialiser le stock de chaque pâtisserie
//     const updated = await PastryEntity.updateMany(
//       {},
//       { $set: { stock: 5, quantityWon: 0 } } // Mettre à jour le stock à une valeur prédéfinie, par exemple 5
//     );
//     res.status(200).json({
//       message: "All stocks have been reset successfully.",
//       updatedCount: updated.nModified,
//     });
//   } catch (error) {
//     console.error("Error resetting stocks: ", error);
//     res.status(500).send("Failed to reset stocks");
//   }
// });

app.post("/reset-stocks", async (req: Request, res: Response) => {
  try {
    // Réinitialiser le stock de chaque pâtisserie
    const updatedPastry = await PastryEntity.updateMany(
      {},
      { $set: { stock: 5 } } // Mettre à jour le stock à une valeur prédéfinie, par exemple 5
    );

    // Supprimer toutes les entrées de jeu
    const deletedGames = await Game.deleteMany({});

    res.status(200).json({
      message: "All stocks and games have been reset successfully.",
      updatedPastryCount: updatedPastry.nModified,
      deletedGamesCount: deletedGames.deletedCount, // Nombre de jeux supprimés
    });
  } catch (error) {
    console.error("Error resetting stocks and games: ", error);
    res.status(500).send("Failed to reset stocks and games");
  }
});

app.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = res.locals.user;
    // Utilisation de res.locals si configuré par le middleware
    // const gameAvailable = false;
    const game = await Game.findOne({
      userId: user.user_id,
    })
      .populate("winnings")
      .sort({ createdAt: "desc" });

    const stockAvailable = await checkStockAvailability(); // Votre logique pour vérifier le stock

    // Si aucune partie active n'est trouvée, renvoyez un état initial prêt à jouer sans sauvegarder dans la DB
    return res.json({
      game,
      message: "Ready to start a new game.",
      gameAvailable: stockAvailable,
      // gameAvailable,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  connectDb().then(() => {
    exportPastries();
    console.log("MongoDb connected");
  });
  // const user = new User({ username: "userTest" });

  // await user.save().then(() => console.log("User created"));
});
