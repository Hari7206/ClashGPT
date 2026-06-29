import mongoose, { Schema, Document } from "mongoose";

export interface IBattle extends Document {
  chatId: mongoose.Types.ObjectId;
  userMessage: string;

  solution_1: string;
  solution_2: string;

  solution_1_score: number;
  solution_2_score: number;

  winner: "solution_1" | "solution_2" | "draw";

  createdAt: Date;
  updatedAt: Date;
}

const battleSchema = new Schema<IBattle>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    userMessage: {
      type: String,
      required: true,
    },

    solution_1: String,
    solution_2: String,

    solution_1_score: Number,
    solution_2_score: Number,

    winner: {
      type: String,
      enum: ["solution_1", "solution_2", "draw"],
      default: "draw",
    },
  },
  {
    timestamps: true,
  }
);

const BattleModel = mongoose.model<IBattle>("Battle", battleSchema);

export default BattleModel;