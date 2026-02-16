import mongoose, { Document, Schema } from 'mongoose';

export interface ICreditPackage extends Document {
  name: string;
  credits: number;
  price: number;
  description?: string;
  isActive: boolean;
  stripePriceId?: string;
  features?: string[]; // List of features included in this package
  bonus?: number; // Extra credits for this package
  popular?: boolean; // Mark as popular for UI
  period?: string; // e.g. "month", "year" for subscription-based packages
  createdAt: Date;
  updatedAt: Date;
}

const creditPackageSchema = new Schema<ICreditPackage>({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  credits: { 
    type: Number, 
    required: true,
    min: 1 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  description: { 
    type: String,
    trim: true 
  },
  isActive: { 
    type: Boolean, 
    default: true,
    index: true 
  },
  stripePriceId: { 
    type: String,
    unique: true,
    sparse: true 
  },
  bonus: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  popular: { 
    type: Boolean, 
    default: false 
  },
  features: { 
    type: [String], 
    default: [] 
  },
  period: { 
    type: String,
    default: "month" 
  }
}, {
  timestamps: true
});

// Index for efficient queries
creditPackageSchema.index({ isActive: 1, price: 1 });

export const CreditPackage = mongoose.model<ICreditPackage>('CreditPackage', creditPackageSchema);