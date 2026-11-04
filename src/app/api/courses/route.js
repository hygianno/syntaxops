import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import { mockCourses } from "@/data/mockCourses";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const courses = await Course.find({}).sort({ createdAt: -1 });
      if (courses && courses.length > 0) {
        return NextResponse.json({ courses, source: "database" });
      }
    }
  } catch (err) {
    console.warn("API /courses DB query failed. Serving mock fallback:", err.message);
  }

  // Graceful offline fallback
  return NextResponse.json({ courses: mockCourses, source: "offline-mock" });
}
