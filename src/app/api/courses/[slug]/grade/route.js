import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import { mockCourses } from "@/data/mockCourses";

export async function POST(req, { params }) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { stepNumber, selectedIndex, assessmentAnswers } = body;

    const db = await connectToDatabase();
    let course = null;

    if (db) {
      course = await Course.findOne({ slug }).lean();
    }

    if (!course) {
      course = mockCourses.find((c) => c.slug === slug || c._id === slug);
    }

    if (!course) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 1. Grade individual step sanity quiz
    if (stepNumber !== undefined) {
      const step = course.steps?.find((s) => s.stepNumber === Number(stepNumber));
      if (!step || !step.quiz) {
        return NextResponse.json({ error: "Quiz not found for this step" }, { status: 404 });
      }

      const expectedAnswerIndex = step.quiz.answerIndex;
      const isCorrect = Number(selectedIndex) === expectedAnswerIndex;

      return NextResponse.json({
        success: true,
        passed: isCorrect,
        explanation: step.quiz.explanation || (isCorrect ? "Correct architectural analysis." : "Incorrect. Review the technical guidelines."),
        expectedAnswerIndex: isCorrect ? expectedAnswerIndex : undefined,
      });
    }

    // 2. Grade final project assessment
    if (assessmentAnswers && Array.isArray(assessmentAnswers)) {
      const questions = course.assessment?.questions || [];
      if (questions.length === 0) {
        return NextResponse.json({ success: true, score: 100, passed: true });
      }

      let totalPoints = 0;
      let earnedPoints = 0;
      const results = [];

      questions.forEach((q, idx) => {
        const studentAns = assessmentAnswers[idx];
        const pts = q.points || 10;
        totalPoints += pts;

        const isRight = String(studentAns).trim() === String(q.correctAnswer).trim();
        if (isRight) {
          earnedPoints += pts;
        }

        results.push({
          questionId: q.id || `q-${idx}`,
          isCorrect: isRight,
          explanation: q.explanation,
        });
      });

      const percentage = Math.round((earnedPoints / (totalPoints || 1)) * 100);
      const passingScore = course.assessment.passingScore || 80;
      const passed = percentage >= passingScore;

      return NextResponse.json({
        success: true,
        score: percentage,
        passed,
        passingScore,
        results,
      });
    }

    return NextResponse.json({ error: "Invalid grading request payload" }, { status: 400 });
  } catch (error) {
    console.error("Grading API error:", error);
    return NextResponse.json({ error: "Server grading evaluation failed" }, { status: 500 });
  }
}
