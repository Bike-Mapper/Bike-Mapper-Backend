import mongoose, { Document, model, Schema } from "mongoose";
import User from "./User";

export type TImperfection = {
  userId: IImperfection["_id"],
  coords: Array<Number>,
  
};

export interface IImperfection extends TImperfection, Document {}

const imperfectionSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  coords: {
    type: Array,
    of: Number
  }
});

const Imperfection = model<IImperfection>("Imperfection", imperfectionSchema);

export default Imperfection;
