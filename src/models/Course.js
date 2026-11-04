import mongoose from "mongoose";

const ContentBlockSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "heading",
        "rich-text",
        "image",
        "code",
        "definition",
        "warning",
        "tip",
        "video",
        "checklist",
        "expected-output",
        "external-resource",
        "reflection",
        "quiz",
        "evidence",
        "attachment",
      ],
    },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const StepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  objective: { type: String, default: "" },
  estimatedMinutes: { type: Number, default: 30 },
  isRequired: { type: Boolean, default: true },

  // Flexible Content Blocks for Course Studio
  blocks: [ContentBlockSchema],

  // Legacy fallback compatibility fields
  contentMarkdown: { type: String, default: "" },
  videoUrl: { type: String, default: null },
  hasVideo: { type: Boolean, default: false },
  costAlert: { type: String, default: null },
  promptQuestion: { type: String, default: "" },
  requiresScreenshot: { type: Boolean, default: true },
  quiz: {
    question: { type: String, default: "" },
    options: [{ type: String }],
    answerIndex: { type: Number, default: 0 },
    explanation: { type: String, default: "" },
  },
});

const CourseSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    summary: { type: String, default: "" },
    fullDescription: { type: String, default: "" },

    track: {
      type: String,
      required: true,
      enum: [
        "Cloud & DevOps",
        "Full-Stack Web Dev",
        "AI & Automation",
        "Linux & Networking",
        "Cybersecurity",
      ],
      default: "Cloud & DevOps",
    },
    category: { type: String, default: "Cloud Engineering" },
    tags: [{ type: String }],

    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Beginner",
    },

    status: {
      type: String,
      required: true,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    thumbnail: { type: String, default: "" },

    isPaid: { type: Boolean, default: false },
    priceNGN: { type: Number, default: 0 },
    priceUSD: { type: Number, default: 0 },
    currency: { type: String, default: "NGN" },

    estimatedHours: { type: Number, default: 2 },
    estimatedDuration: { type: String, default: "2–3 hours" },

    // Infrastructure / Build Cost Details
    buildCost: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
      explanation: { type: String, default: "Free Tier resources are typically sufficient." },
      requiresPaidAccount: { type: Boolean, default: false },
      freeTierSufficient: { type: Boolean, default: true },
      cleanupWarning: { type: String, default: "Remember to destroy billable cloud resources after completion." },
      isApproximate: { type: Boolean, default: true },
    },

    // Problem Statement & Target Audience
    problemStatement: {
      whatProblem: { type: String, default: "" },
      whyImportant: { type: String, default: "" },
      realWorldContext: { type: String, default: "" },
      whatWillBuild: { type: String, default: "" },
    },
    targetAudience: {
      whoShouldTake: { type: String, default: "" },
      expectedBackground: { type: String, default: "" },
    },

    // Introduction Section
    introduction: {
      markdown: { type: String, default: "" },
      videoUrl: { type: String, default: "" },
      videoDescription: { type: String, default: "" },
      whatYouWillBuild: { type: String, default: "" },
      whyItMatters: { type: String, default: "" },
      expectedResult: { type: String, default: "" },
    },

    // Architecture Specifications
    architecture: {
      diagrams: [
        {
          url: { type: String, default: "" },
          caption: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
      dataFlow: { type: String, default: "" },
      components: [
        {
          name: { type: String, default: "" },
          role: { type: String, default: "" },
          service: { type: String, default: "" },
        },
      ],
    },

    // Prerequisites (structured & interactive for learners)
    prerequisites: [
      {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        setupInstructions: { type: String, default: "" },
        docUrl: { type: String, default: "" },
        verifyCommand: { type: String, default: "" },
        isRequired: { type: Boolean, default: true },
      },
    ],

    // Learning Objectives
    learningObjectives: [{ type: String }],

    // Opening Reflection
    openingReflection: {
      question: {
        type: String,
        default:
          "In your own words, what do you think we are going to build, and what do you hope to understand by the end of this project?",
      },
      instructions: { type: String, default: "Take a moment to record your initial perspective before provisioning." },
      isRequired: { type: Boolean, default: true },
      minWords: { type: Number, default: 20 },
    },

    // Steps
    steps: [StepSchema],

    // Project-level Assessment
    assessment: {
      passingScore: { type: Number, default: 80 },
      maxAttempts: { type: Number, default: 3 },
      isRequired: { type: Boolean, default: false },
      questions: [
        {
          id: { type: String },
          type: {
            type: String,
            enum: ["single-choice", "multiple-choice", "true-false", "short-answer"],
            default: "single-choice",
          },
          question: { type: String, required: true },
          options: [{ type: String }],
          correctAnswer: { type: mongoose.Schema.Types.Mixed }, // Never leaked publicly to learners
          explanation: { type: String, default: "" },
          points: { type: Number, default: 10 },
        },
      ],
    },

    // Final Reflection Questions
    finalReflection: {
      questions: [
        {
          id: { type: String },
          question: { type: String, required: true },
          isRequired: { type: Boolean, default: true },
        },
      ],
    },

    version: { type: Number, default: 1 },
    publishedAt: { type: Date, default: null },
    archivedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
