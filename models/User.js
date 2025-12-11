import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide a first name'],
      trim: true,
      maxlength: [50, 'First name cannot be more than 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Please provide a last name'],
      trim: true,
      maxlength: [50, 'Last name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number cannot be more than 20 characters'],
    },
    coursesEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during hot reloads in development
export default mongoose.models.User || mongoose.model('User', UserSchema);
