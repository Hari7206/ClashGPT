import mongoose, { Schema, Document } from "mongoose";

interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  createdAt: Date;
}

const tokenSchema = new Schema<IToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const VerificationTokenModel = mongoose.model<IToken>(
  "VerificationToken",
  tokenSchema
);

export default VerificationTokenModel;