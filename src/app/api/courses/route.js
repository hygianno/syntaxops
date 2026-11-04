import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import { getOfflineCourses } from "@/lib/offlineCourseStore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const track = searchParams.get("track");
    const level = searchParams.get("level");
    const search = searchParams.get("search")?.toLowerCase();

    const db = await connectToDatabase();
    let courses = [];

    if (db) {
      // Only query published projects for public learner catalog
      const query = { status: "published" };
      if (track && track !== "All tracks") query.track = track;
      if (level && level !== "All levels") query.level = level;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { summary: { $regex: search, $options: "i" } },
        ];
      }
      courses = await Course.find(query).sort({ publishedAt: -1, createdAt: -1 }).lean();
    }

    // Merge or fallback to offline published courses
    if (!courses || courses.length === 0) {
      courses = getOfflineCourses({
        status: "published",
        track: track && track !== "All tracks" ? track : undefined,
        search,
      });

      if (level && level !== "All levels") {
        courses = courses.filter((c) => c.level === level);
      }
    }

    return NextResponse.json({ courses, source: db ? "database" : "offline-store" });
  } catch (err) {
    console.warn("API /courses DB query failed. Serving offline fallback:", err.message);
    const fallback = getOfflineCourses({ status: "published" });
    return NextResponse.json({ courses: fallback, source: "offline-store" });
  }
}
