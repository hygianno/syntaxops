import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Submission from "@/models/Submission";
import { generateVerificationHash } from "@/lib/hmac";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      userEmail,
      userFullName,
      courseSlug,
      courseTitle,
      stepResponses = [],
      openingReflection = null,
      finalReflection = null,
      assessmentScore = null,
      architectureDiagramUrl = null,
      courseProblemStatement = null,
    } = body;

    if (!userEmail || !courseSlug) {
      return NextResponse.json(
        { error: "Missing required submission parameters." },
        { status: 400 }
      );
    }

    const completedAt = new Date();
    const verificationHash = generateVerificationHash({
      userEmail,
      courseSlug,
      completedAt,
    });

    // Attempt persistence to MongoDB Atlas if connected
    let savedSubmissionId = `sub_${Date.now()}`;
    try {
      const db = await connectToDatabase();
      if (db) {
        const submissionDoc = await Submission.findOneAndUpdate(
          { userEmail: userEmail.toLowerCase(), courseSlug },
          {
            userId: userEmail.toLowerCase(),
            userFullName: userFullName || "Guest Engineer",
            userEmail: userEmail.toLowerCase(),
            courseSlug,
            courseTitle: courseTitle || courseSlug,
            isCompleted: true,
            verificationHash,
            completedAt,
            stepResponses,
            openingReflection,
            finalReflection,
            assessmentScore,
            architectureDiagramUrl,
            courseProblemStatement,
          },
          { upsert: true, new: true }
        );
        savedSubmissionId = submissionDoc._id.toString();
      }
    } catch (dbErr) {
      console.warn("MongoDB write skipped (offline dev fallback):", dbErr.message);
    }

    return NextResponse.json({
      success: true,
      submissionId: savedSubmissionId,
      verificationHash,
      completedAt: completedAt.toISOString(),
      userFullName: userFullName || "Guest Engineer",
      userEmail,
      courseSlug,
      courseTitle,
      openingReflection,
      finalReflection,
      assessmentScore,
      architectureDiagramUrl,
      courseProblemStatement,
    });
  } catch (error) {
    console.error("Submission finalization error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during lab finalization." },
      { status: 500 }
    );
  }
}
