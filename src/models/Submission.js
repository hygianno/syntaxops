import mongoose from "mongoose";

const StepResponseSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  reflectionText: { type: String, required: true },
  screenshotUrl: { type: String, default: null },
  quizPassed: { type: Boolean, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const SubmissionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    userFullName: { type: String, required: true },
    userEmail: { type: String, required: true },
    courseSlug: { type: String, required: true, index: true },
    courseTitle: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    verificationHash: { type: String, unique: true, sparse: true },
    completedAt: { type: Date, default: null },
    stepResponses: [StepResponseSchema],
  },
  { timestamps: true }
);

// Compound index to prevent duplicate concurrent active submissions per user per course
SubmissionSchema.index({ userEmail: 1, courseSlug: 1 });

export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
