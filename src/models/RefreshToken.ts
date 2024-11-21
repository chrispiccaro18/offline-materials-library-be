import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshToken extends Document {
  token: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  expiresAt: Date;
  deviceInfo?: string;
  ipAddress?: string;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  deviceInfo: { type: String },
  ipAddress: { type: String },
});

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
