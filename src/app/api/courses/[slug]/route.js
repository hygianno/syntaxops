import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import { mockCourses } from "@/data/mockCourses";

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const db = await connectToDatabase();
    let course = null;

    if (db) {
      course = await Course.findOne({ slug }).lean();
    }

    if (!course) {
      const mock = mockCourses.find((c) => c.slug === slug || c._id === slug);
      if (mock) {
        course = {
          ...mock,
          status: "published",
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
      }
    }

    if (!course) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // SANITIZATION: Never leak correct answers to public learner client
    const sanitizedCourse = { ...course };

    if (sanitizedCourse.steps) {
      sanitizedCourse.steps = sanitizedCourse.steps.map((step) => {
        const sanitizedStep = { ...step };
        if (sanitizedStep.quiz) {
          sanitizedStep.quiz = {
            question: sanitizedStep.quiz.question,
            options: sanitizedStep.quiz.options,
            // answerIndex is hidden from public client
          };
        }
        if (sanitizedStep.blocks) {
          sanitizedStep.blocks = sanitizedStep.blocks.map((block) => {
            if (block.type === "quiz") {
              const quizData = { ...(block.data || {}) };
              delete quizData.correctAnswer;
              delete quizData.answerIndex;
              return { ...block, data: quizData };
            }
            return block;
          });
        }
        return sanitizedStep;
      });
    }

    if (sanitizedCourse.assessment?.questions) {
      sanitizedCourse.assessment = {
        ...sanitizedCourse.assessment,
        questions: sanitizedCourse.assessment.questions.map((q) => {
          const sanitizedQ = { ...q };
          delete sanitizedQ.correctAnswer;
          return sanitizedQ;
        }),
      };
    }

    return NextResponse.json({ course: sanitizedCourse });
  } catch (error) {
    console.error("GET /api/courses/[slug] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
