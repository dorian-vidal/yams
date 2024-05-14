// Game.ts
import mongoose, { Document, Schema } from "mongoose";

interface IGame extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  dices: number[];
  combination: string | null;
  attemptsLeft: number;
  winnings: Schema.Types.ObjectId[];
  createdAt: Date;
}

const gameSchema = new Schema<IGame>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  dices: [Number],
  combination: String,
  attemptsLeft: Number,
  winnings: [{ type: Schema.Types.ObjectId, ref: "Pastry" }],
  createdAt: Date,
});

const Game = mongoose.model<IGame>("Game", gameSchema);

export default Game;
