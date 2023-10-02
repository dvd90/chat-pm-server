import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export interface ISpec {
  spec_id: string;
  title: string;
  description: string;
  chatbase_id: string;
}

const SpecSchema: Schema = new Schema(
  {
    spec_id: String,
    title: String,
    description: String,
    chatbase_id: String
  },
  { timestamps: true }
);

export const Spec = mongoose.model<ISpec>('specs', SpecSchema, 'specs');
