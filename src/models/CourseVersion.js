import mongoose from "mongoose";

const CourseVersionSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    slug: { type: String, required: true },
    version: { type: Number, required: true },
    snapshotData: { type: mongoose.Schema.Types.Mixed, required: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

CourseVersionSchema.index({ courseId: 1, version: 1 }, { unique: true });

export default mongoose.models.CourseVersion ||
  mongoose.model("CourseVersion", CourseVersionSchema);
