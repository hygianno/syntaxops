import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import CourseVersion from "@/models/CourseVersion";
import {
  getOfflineCourseById,
  saveOfflineCourse,
  deleteOfflineCourse,
} from "@/lib/offlineCourseStore";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    if (db) {
      const course =
        (await Course.findById(id).lean().catch(() => null)) ||
        (await Course.findOne({ slug: id }).lean().catch(() => null));
      if (course) {
        return NextResponse.json({ course });
      }
    }

    // Fallback to offline store (persisted drafts and mock courses)
    const offlineCourse = getOfflineCourseById(id);
    if (offlineCourse) {
      return NextResponse.json({ course: offlineCourse });
    }

    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  } catch (error) {
    console.error("GET /api/admin/courses/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project details" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const updates = await req.json();

    const db = await connectToDatabase();
    if (!db) {
      // In offline development without MongoDB connection, save to offline store
      const updated = saveOfflineCourse({ ...updates, _id: id });
      return NextResponse.json({
        success: true,
        course: updated,
        offline: true,
      });
    }

    // If publishing, increment version and capture immutable snapshot
    if (updates.status === "published") {
      updates.publishedAt = new Date();
      updates.version = (updates.version || 1) + 1;
    } else if (updates.status === "archived") {
      updates.archivedAt = new Date();
    }

    const updated = await Course.findOneAndUpdate(
      { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { slug: id }] },
      { $set: updates },
      { new: true, upsert: true }
    );

    // Save version snapshot if published
    if (updates.status === "published" && updated) {
      try {
        await CourseVersion.create({
          courseId: updated._id,
          slug: updated.slug,
          version: updated.version,
          snapshotData: updated.toObject(),
          publishedAt: new Date(),
        });
      } catch (vErr) {
        console.warn("Version snapshot capture warning:", vErr.message);
      }
    }

    return NextResponse.json({ success: true, course: updated });
  } catch (error) {
    console.error("PUT /api/admin/courses/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    if (db) {
      await Course.findOneAndDelete({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { slug: id }],
      });
    } else {
      deleteOfflineCourse(id);
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/admin/courses/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
