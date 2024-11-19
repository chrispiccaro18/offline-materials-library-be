"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the Mongoose schema for the Activity model
const ActivitySchema = new mongoose_1.Schema({
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
const Activity = mongoose_1.default.models.Activity || mongoose_1.default.model('Activity', ActivitySchema);
exports.default = Activity;
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
