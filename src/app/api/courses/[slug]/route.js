import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import { getOfflineCourseById } from "@/lib/offlineCourseStore";

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const db = await connectToDatabase();
    let course = null;

    if (db) {
      course = await Course.findOne({ slug }).lean();
    }

    if (!course) {
      course = getOfflineCourseById(slug);
    }

    if (!course) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // SANITIZATION: Never leak correct answers to public learner client
    const sanitizedCourse = { ...course };

    if (sanitizedCourse.steps) {
      sanitizedCourse.steps = sanitizedCourse.steps.map((step) => {
        const sanitizedStep = { ...step };
        if (sanitizedStep.quiz) {
          sanitizedStep.quiz = {
            question: sanitizedStep.quiz.question,
            options: sanitizedStep.quiz.options,
            explanation: sanitizedStep.quiz.explanation,
            // answerIndex is deliberately stripped
          };
        }
        if (sanitizedStep.blocks) {
          sanitizedStep.blocks = sanitizedStep.blocks.map((block) => {
            if (block.type === "quiz" && block.data) {
              return {
                ...block,
                data: {
                  question: block.data.question,
                  options: block.data.options,
                  explanation: block.data.explanation,
                },
              };
            }
            return block;
          });
        }
        return sanitizedStep;
      });
    }

    if (sanitizedCourse.assessment?.questions) {
      sanitizedCourse.assessment = {
        ...sanitizedCourse.assessment,
        questions: sanitizedCourse.assessment.questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          type: q.type,
          points: q.points,
          // correctAnswer is deliberately stripped
        })),
      };
    }

    return NextResponse.json({ success: true, course: sanitizedCourse });
  } catch (error) {
    console.error("GET /api/courses/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project details" },
      { status: 500 }
    );
  }
}
