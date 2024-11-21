import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivity extends Document {
  title: string;
  materials: string[];
  ageRange:
    | 'Infant'
    | 'Toddler'
    | 'Preschooler'
    | 'Kindergarten'
    | 'School Age';
  instructions: string;
  tags?: string[];
  estimatedTime: number;
  createdAt?: Date;
}

const ActivitySchema: Schema<IActivity> = new Schema({
  title: {
    type: String,
    required: true,
  },
  materials: {
    type: [String],
    required: true,
  },
  ageRange: {
    type: String,
    required: true,
    enum: ['Infant', 'Toddler', 'Preschooler', 'Kindergarten', 'School Age'],
  },
  instructions: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  estimatedTime: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Activity: Model<IActivity> =
  mongoose.models.Activity ||
  mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;
