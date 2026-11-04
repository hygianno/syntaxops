import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import CourseVersion from "@/models/CourseVersion";
import { mockCourses } from "@/data/mockCourses";

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

    // Offline / Mock fallback lookup
    const mock = mockCourses.find((c) => c._id === id || c.slug === id);
    if (mock) {
      const enhancedMock = {
        ...mock,
        status: "published",
        category: "Cloud Engineering",
        estimatedDuration: `${mock.estimatedHours || 2} hours`,
        buildCost: { min: 0, max: 0, currency: "USD", freeTierSufficient: true },
        problemStatement: {
          whatProblem: "Production cloud setups require robust network tier isolation.",
          whyImportant: "Exposing internal compute instances directly to the internet is a severe vulnerability.",
          realWorldContext: "Enterprises segment applications into isolated public ingress and private VPC subnets.",
          whatWillBuild: "A complete multi-tier AWS network with routing tables and least-privilege security groups.",
        },
        architecture: {
          diagrams: [],
          dataFlow: "Internet Client -> Internet Gateway -> Public Load Balancer -> Private Application EC2",
          components: [
            { name: "Internet Gateway", role: "VPC Ingress", service: "AWS EC2" },
            { name: "Public Subnets", role: "ALB Load Balancing", service: "AWS VPC" },
            { name: "Private Subnets", role: "Workload Isolation", service: "AWS VPC" },
          ],
        },
        learningObjectives: [
          "Provision isolated VPC with CIDR planning.",
          "Configure Public & Private route tables.",
          "Verify connectivity and security group inbound filters.",
        ],
        openingReflection: {
          question:
            "In your own words, what do you think we are going to build, and what do you hope to understand by the end of this project?",
          instructions: "Document your initial perspective before running commands.",
          isRequired: true,
          minWords: 20,
        },
      };
      return NextResponse.json({ course: enhancedMock });
    }

    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  } catch (error) {
    console.error("GET /api/admin/courses/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch project details" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const updates = await req.json();

    const db = await connectToDatabase();
    if (!db) {
      // In offline development without MongoDB connection, echo updated data
      return NextResponse.json({
        success: true,
        course: { ...updates, _id: id, updatedAt: new Date().toISOString() },
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
    return NextResponse.json({ error: error.message || "Failed to update project" }, { status: 500 });
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
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/admin/courses/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
