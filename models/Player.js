import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 5,
    max: 18
  },
  position: {
    type: String,
    required: true,
    enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']
  },
  skillLevel: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  contactNumber: {
    type: String,
    required: true
  },
  parentName: {
    type: String,
    required: true
  },
  parentContact: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Active',
    enum: ['Active', 'Inactive', 'On Leave']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Player', playerSchema); 