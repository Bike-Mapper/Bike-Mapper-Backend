import mongoose, { Document, model, Schema } from "mongoose";

/**
 * Type to model the Company Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param avatar:string
 */

export type TCompany = {
  name: string;
  description: string;
  price: string;
  image_path: string;
};

/**
 * Mongoose Document based on TCompany for TypeScript.
 * https://mongoosejs.com/docs/documents.html
 *
 * TCompany
 */

export interface ICompany extends TCompany, Document {}

const companySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
  },
  image_path: {
    type: String,
    default: "https://picsum.photos/512/512?random=9"

  },
});

/**
 * Mongoose Model based on TCompany for TypeScript.
 * https://mongoosejs.com/docs/models.html
 *
 * TCompany
 */
const Company = model<ICompany>("Company", companySchema);

export default Company;