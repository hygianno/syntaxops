import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import { mockCourses } from "@/data/mockCourses";

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

    // Merge or fallback to mock courses
    if (!courses || courses.length === 0) {
      courses = mockCourses.map((mc) => ({
        ...mc,
        status: "published",
        estimatedDuration: `${mc.estimatedHours || 2} hours`,
      }));

      if (track && track !== "All tracks") {
        courses = courses.filter((c) => c.track === track);
      }
      if (level && level !== "All levels") {
        courses = courses.filter((c) => c.level === level);
      }
      if (search) {
        courses = courses.filter(
          (c) =>
            c.title?.toLowerCase().includes(search) ||
            c.summary?.toLowerCase().includes(search)
        );
      }
    }

    return NextResponse.json({ courses, source: db ? "database" : "offline-mock" });
  } catch (err) {
    console.warn("API /courses DB query failed. Serving mock fallback:", err.message);
    return NextResponse.json({ courses: mockCourses, source: "offline-mock" });
  }
}
