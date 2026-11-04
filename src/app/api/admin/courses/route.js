import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import { mockCourses } from "@/data/mockCourses";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const status = searchParams.get("status") || "all";
    const track = searchParams.get("track") || "all";

    const db = await connectToDatabase();
    let courses = [];

    if (db) {
      const query = {};
      if (status !== "all") query.status = status;
      if (track !== "all") query.track = track;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { summary: { $regex: search, $options: "i" } },
          { slug: { $regex: search, $options: "i" } },
        ];
      }
      courses = await Course.find(query).sort({ updatedAt: -1 }).lean();
    }

    // If database has no courses yet (e.g. initial setup or offline development),
    // merge in mockCourses formatted with standard Course Studio attributes
    if (!courses || courses.length === 0) {
      courses = mockCourses.map((mc) => ({
        ...mc,
        status: "published",
        category: mc.track === "Cloud & DevOps" ? "AWS & Kubernetes" : "Software Engineering",
        estimatedDuration: `${mc.estimatedHours || 2} hours`,
        buildCost: { min: 0, max: 0, currency: "USD", freeTierSufficient: true },
        updatedAt: new Date().toISOString(),
      }));

      if (status !== "all") {
        courses = courses.filter((c) => c.status === status);
      }
      if (track !== "all") {
        courses = courses.filter((c) => c.track === track);
      }
      if (search) {
        courses = courses.filter(
          (c) =>
            c.title?.toLowerCase().includes(search) ||
            c.summary?.toLowerCase().includes(search) ||
            c.slug?.toLowerCase().includes(search)
        );
      }
    }

    // Compute stats
    let allCoursesForStats = courses;
    if (db) {
      allCoursesForStats = await Course.find({}).lean();
      if (!allCoursesForStats || allCoursesForStats.length === 0) {
        allCoursesForStats = mockCourses.map((mc) => ({ ...mc, status: "published" }));
      }
    }

    const stats = {
      total: allCoursesForStats.length,
      published: allCoursesForStats.filter((c) => c.status === "published").length,
      draft: allCoursesForStats.filter((c) => c.status === "draft").length,
      archived: allCoursesForStats.filter((c) => c.status === "archived").length,
    };

    return NextResponse.json({ courses, stats, source: db ? "database" : "offline-mock" });
  } catch (error) {
    console.error("GET /api/admin/courses error:", error);
    return NextResponse.json({ error: "Failed to fetch admin courses" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, summary, track, level } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Project title is required" }, { status: 400 });
    }

    const baseSlug = (body.slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const slug = `${baseSlug || "new-project"}-${Date.now().toString().slice(-4)}`;

    const newCourseData = {
      title: title.trim(),
      slug,
      summary: summary || "A hands-on engineering project created in Syntax_Ops Course Studio.",
      track: track || "Cloud & DevOps",
      level: level || "Beginner",
      status: "draft",
      isPaid: false,
      priceNGN: 0,
      estimatedHours: 2,
      estimatedDuration: "2 hours",
      prerequisites: [
        {
          name: "Local Development Terminal",
          description: "Access to a bash, zsh, or WSL terminal environment.",
          setupInstructions: "Open your terminal on Linux, macOS, or Windows WSL.",
          isRequired: true,
        },
      ],
      learningObjectives: ["Understand fundamental architecture principles.", "Deploy and verify resources."],
      openingReflection: {
        question:
          "In your own words, what do you think we are going to build, and what do you hope to understand by the end of this project?",
        instructions: "Reflect on your initial technical assumptions before writing or deploying code.",
        isRequired: true,
        minWords: 20,
      },
      steps: [
        {
          stepNumber: 1,
          title: "Initial Setup & Environment Configuration",
          objective: "Initialize the project environment and verify CLI tool connectivity.",
          estimatedMinutes: 20,
          isRequired: true,
          contentMarkdown: "### Step 1: Environment Setup\n\nRun the following verification command:",
          promptQuestion: "Why is verifying active authentication credentials essential before provisioning resources?",
          requiresScreenshot: true,
          quiz: {
            question: "What is the primary benefit of verifying authentication via CLI before running automation?",
            options: [
              "It eliminates the need for IAM policies",
              "It catches expired or invalid tokens before mutating infrastructure",
              "It encrypts the local bash history",
              "It provisions a VPC automatically",
            ],
            answerIndex: 1,
            explanation: "Verifying credentials early prevents partial deployments or half-provisioned cloud states.",
          },
          blocks: [
            {
              id: "b-intro-1",
              type: "rich-text",
              data: {
                content:
                  "Welcome to your first milestone. In this step, you will configure your local workspace and ensure your tools are authenticated.",
              },
            },
            {
              id: "b-code-1",
              type: "code",
              data: {
                language: "bash",
                code: "aws sts get-caller-identity\n# Verify your Account ID and ARN",
                explanation: "Runs an authentication check to confirm active credentials.",
              },
            },
            {
              id: "b-warning-1",
              type: "warning",
              data: {
                title: "Least Privilege Notice",
                message: "Ensure your IAM credentials have only the specific permissions needed for this lab.",
                severity: "security",
              },
            },
          ],
        },
      ],
      finalReflection: {
        questions: [
          { id: "fr-1", question: "What was the most challenging technical failure mode you encountered?", isRequired: true },
          { id: "fr-2", question: "How would you automate this deployment in a production CI/CD pipeline?", isRequired: true },
        ],
      },
      version: 1,
    };

    const db = await connectToDatabase();
    let createdCourse = null;

    if (db) {
      createdCourse = await Course.create(newCourseData);
    } else {
      // In offline mode, simulate creation with mock identifier
      createdCourse = {
        _id: `custom_${Date.now()}`,
        ...newCourseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return NextResponse.json({ success: true, course: createdCourse }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/courses error:", error);
    return NextResponse.json({ error: error.message || "Failed to create course" }, { status: 500 });
  }
}
