import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema(
  {
    // Student Information
    firstName: {
      type: String,
      required: [true, 'Please provide a first name'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Please provide a last name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    
    // Address & Demographics
    addressMultiline: String,
    country: String,
    city: String,
    address: String,
    postalCode: String,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'X'],
    },
    
    // Immigration & Background
    immigrationStatus: String,
    countryOfOrigin: String,
    arrivalDate: String,
    workExperience: String,
    educationBackground: String,
    attendedLinc: String,
    attendedLincDetails: String,
    languageCompanion: String,
    dateIntake: String,
    assessmentDate: String,
    clbListening: String,
    clbSpeaking: String,
    clbReading: String,
    clbWriting: String,
    
    // Program Selection - Selected Course
    selectedCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Please select a course'],
    },
    
    // Special Needs & Consent
    specialNeeds: String,
    consentName: {
      type: String,
      required: [true, 'Please provide consent name'],
    },
    consentDate: {
      type: String,
      required: [true, 'Please provide consent date'],
    },
    
    // Enrollment Status
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    
    // Link to user account if exists
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    
    // Admin notes
    adminNotes: String,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite during hot reloads in development
export default mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
