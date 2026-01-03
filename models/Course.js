import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
      maxlength: [100, 'Course title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
      trim: true,
      maxlength: [1000, 'Course description cannot be more than 1000 characters'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    duration: {
      type: String,
      required: [true, 'Please provide course duration'],
      trim: true,
    },
    format: {
      type: String,
      enum: ['Virtual', 'In-Person', 'Hybrid'],
      default: 'Virtual',
    },
    instructor: {
      type: String,
      trim: true,
      maxlength: [100, 'Instructor name cannot be more than 100 characters'],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    maxEnrollment: {
      type: Number,
      default: 30,
      min: [1, 'Max enrollment must be at least 1'],
    },
    currentEnrollment: {
      type: Number,
      default: 0,
      min: [0, 'Current enrollment cannot be negative'],
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    prerequisites: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during hot reloads in development
export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
