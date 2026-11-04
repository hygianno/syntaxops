import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import { mockCourses } from "@/data/mockCourses";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();
    let original = null;

    if (db) {
      original =
        (await Course.findById(id).lean().catch(() => null)) ||
        (await Course.findOne({ slug: id }).lean().catch(() => null));
    }

    if (!original) {
      original = mockCourses.find((c) => c._id === id || c.slug === id);
    }

    if (!original) {
      return NextResponse.json({ error: "Source project not found" }, { status: 404 });
    }

    const timestamp = Date.now().toString().slice(-4);
    const newSlug = `${original.slug}-copy-${timestamp}`;
    const newTitle = `${original.title} (Copy)`;

    const duplicatedData = {
      ...original,
      _id: undefined,
      title: newTitle,
      slug: newSlug,
      status: "draft",
      version: 1,
      publishedAt: null,
      archivedAt: null,
      createdAt: undefined,
      updatedAt: undefined,
    };

    let duplicatedCourse = null;
    if (db) {
      duplicatedCourse = await Course.create(duplicatedData);
    } else {
      duplicatedCourse = {
        _id: `custom_${Date.now()}`,
        ...duplicatedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return NextResponse.json({ success: true, course: duplicatedCourse }, { status: 201 });
  } catch (error) {
    console.error("POST duplicate course error:", error);
    return NextResponse.json({ error: error.message || "Failed to duplicate course" }, { status: 500 });
  }
}
