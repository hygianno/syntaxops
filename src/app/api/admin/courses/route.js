import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import { getOfflineCourses, saveOfflineCourse } from "@/lib/offlineCourseStore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const status = searchParams.get("status") || "all";
    const track = searchParams.get("track") || "all";

    const db = await connectToDatabase();
    let courses = [];
    let stats = { total: 0, published: 0, draft: 0, archived: 0 };

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

      // Compute stats
      const allCourses = await Course.find({}).lean();
      stats = {
        total: allCourses.length,
        published: allCourses.filter((c) => c.status === "published").length,
        draft: allCourses.filter((c) => c.status === "draft").length,
        archived: allCourses.filter((c) => c.status === "archived").length,
      };
    } else {
      // Offline fallback store (persists local drafts, updates, and mock courses)
      courses = getOfflineCourses({ status, track, search });
      const allOfflineCourses = getOfflineCourses({});
      stats = {
        total: allOfflineCourses.length,
        published: allOfflineCourses.filter((c) => c.status === "published").length,
        draft: allOfflineCourses.filter((c) => c.status === "draft").length,
        archived: allOfflineCourses.filter((c) => c.status === "archived").length,
      };
    }

    return NextResponse.json({
      courses,
      stats,
      source: db ? "database" : "offline-store",
    });
  } catch (error) {
    console.error("GET /api/admin/courses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin courses" },
      { status: 500 }
    );
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
      problemStatement: {
        whatProblem: "Clearly define the real-world operational problem this project solves.",
        whyImportant: "Explain why traditional or naive approaches fail in production.",
        realWorldContext: "Describe the architectural scenario and organizational requirements.",
        whatWillBuild: title.trim(),
      },
      architecture: {
        diagramUrl: null,
        dataFlow: "Ingress / Client -> Gateway -> Service -> Persistence Store",
        components: [
          { name: "Primary Gateway", role: "Ingress Controller", service: "Network Routing" },
        ],
      },
      prerequisites: [
        {
          name: "Local Development Terminal",
          description: "Access to a bash, zsh, or WSL terminal environment.",
          setupInstructions: "Open your terminal on Linux, macOS, or Windows WSL.",
          isRequired: true,
        },
      ],
      learningObjectives: [
        "Understand fundamental architecture principles.",
        "Deploy and verify resources in a live environment.",
        "Document observations and auditable proof of execution.",
      ],
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
                code: "# Verify active authentication credentials\necho 'Checking CLI toolchain...'",
                explanation: "Runs an authentication check to confirm active credentials.",
              },
            },
            {
              id: "b-warning-1",
              type: "warning",
              data: {
                title: "Least Privilege Notice",
                message: "Ensure your credentials have only the specific permissions needed for this lab.",
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
      // In offline mode, persist immediately to the offline local store
      createdCourse = saveOfflineCourse(newCourseData);
    }

    return NextResponse.json({ success: true, course: createdCourse }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/courses error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create course" },
      { status: 500 }
    );
  }
}
