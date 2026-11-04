import mongoose from "mongoose";

const StepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  objective: { type: String, required: true },
  contentMarkdown: { type: String, required: true },
  videoUrl: { type: String, default: null },
  hasVideo: { type: Boolean, default: false },
  costAlert: { type: String, default: null },
  promptQuestion: { type: String, required: true },
  requiresScreenshot: { type: Boolean, default: true },
  quiz: {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    answerIndex: { type: Number, required: true },
  },
});

const CourseSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    track: {
      type: String,
      required: true,
      enum: ["Cloud & DevOps", "Full-Stack Web Dev", "AI & Automation"],
    },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    isPaid: { type: Boolean, default: false },
    priceNGN: { type: Number, default: 0 },
    summary: { type: String, required: true },
    estimatedHours: { type: Number, default: 2 },
    prerequisites: [{ type: String }],
    steps: [StepSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
