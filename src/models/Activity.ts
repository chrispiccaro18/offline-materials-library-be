import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface for the Activity document
export interface IActivity extends Document {
  title: string; // Name of the activity
  materials: string[]; // List of materials needed
  ageRange: 'Infant' | 'Toddler' | 'Preschooler' | 'Kindergarten' | 'School Age'; // Age group
  instructions: string; // Detailed activity instructions
  tags?: string[]; // Optional tags for categorization
  estimatedTime: number; // Estimated time in minutes
  createdAt?: Date; // Timestamp when the activity was created
}

// Define the Mongoose schema for the Activity model
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

// Define the Mongoose model with the interface
const Activity: Model<IActivity> =
  mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;

// import connectMongo from './lib/mongodb';
// import Activity, { IActivity } from './models/Activity';

// const addActivity = async (): Promise<void> => {
//   await connectMongo();

//   const newActivity: IActivity = new Activity({
//     title: 'DIY Treasure Hunt',
//     materials: ['paper', 'crayons', 'markers'],
//     ageRange: 'Preschooler',
//     instructions: 'Draw a treasure map and hide clues around the house!',
//     tags: ['indoor', 'creative'],
//     estimatedTime: 30,
//   });

//   await newActivity.save();
//   console.log('Activity saved:', newActivity);
// };

// addActivity();
