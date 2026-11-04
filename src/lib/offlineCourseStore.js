import fs from "fs";
import path from "path";
import { mockCourses } from "../data/mockCourses.js";

const DATA_FILE = path.join(process.cwd(), "src", "data", "offlineCourses.json");

// Ensure global cache across Next.js dev server fast-reloads
if (!globalThis.__syntaxops_local_courses) {
  globalThis.__syntaxops_local_courses = null;
}

function normalizeMockCourse(mc) {
  return {
    ...mc,
    status: mc.status || "published",
    category: mc.track === "Cloud & DevOps" ? "AWS & Kubernetes" : "Software Engineering",
    estimatedDuration: `${mc.estimatedHours || 2} hours`,
    buildCost: mc.buildCost || { min: 0, max: 0, currency: "USD", freeTierSufficient: true },
    problemStatement: mc.problemStatement || {
      whatProblem: "Production engineering systems require clean architecture, high reliability, and clear cost management.",
      whyImportant: "Deploying unmanaged or poorly isolated infrastructure leads to security vulnerabilities and outage risks.",
      realWorldContext: "Modern tech startups and cloud operations teams demand auditable configuration and automated deployments.",
      whatWillBuild: mc.title,
    },
    architecture: mc.architecture || {
      diagrams: [],
      dataFlow: "Client / Ingress -> Gateway / ALB -> Internal Services -> Data Store",
      components: [
        { name: "Primary Gateway", role: "Ingress Routing", service: "Network Gateway" },
        { name: "Application Tier", role: "Core Workloads", service: "Compute Instance" },
      ],
    },
    prerequisites: Array.isArray(mc.prerequisites)
      ? mc.prerequisites.map((p) =>
          typeof p === "string"
            ? { name: p, description: `Prerequisite setup: ${p}`, isRequired: true }
            : p
        )
      : [],
    learningObjectives: mc.learningObjectives || [
      "Understand production architecture principles.",
      "Deploy and verify resources in a live environment.",
      "Document observations and proof of execution.",
    ],
    openingReflection: mc.openingReflection || {
      question:
        "In your own words, what do you think we are going to build, and what do you hope to understand by the end of this project?",
      instructions: "Document your initial perspective before running commands.",
      isRequired: true,
      minWords: 20,
    },
    finalReflection: mc.finalReflection || {
      questions: [
        { id: "fr-1", question: "What was the most challenging technical failure mode you encountered?", isRequired: true },
        { id: "fr-2", question: "How would you automate this deployment in a production CI/CD pipeline?", isRequired: true },
      ],
    },
    version: mc.version || 1,
    createdAt: mc.createdAt || new Date("2026-01-01").toISOString(),
    updatedAt: mc.updatedAt || new Date().toISOString(),
  };
}

function loadLocalCoursesFromDisk() {
  if (globalThis.__syntaxops_local_courses !== null) {
    return globalThis.__syntaxops_local_courses;
  }

  let fileCourses = [];
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf8");
      fileCourses = JSON.parse(content || "[]");
    }
  } catch (err) {
    console.warn("Could not read offlineCourses.json, using in-memory cache:", err.message);
  }

  globalThis.__syntaxops_local_courses = fileCourses;
  return globalThis.__syntaxops_local_courses;
}

function persistLocalCoursesToDisk(courses) {
  globalThis.__syntaxops_local_courses = courses;
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(courses, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist to offlineCourses.json (using in-memory):", err.message);
  }
}

export function getOfflineCourses(filters = {}) {
  const localCourses = loadLocalCoursesFromDisk();
  const normalizedMocks = mockCourses.map(normalizeMockCourse);

  // Map local courses by ID / slug to override mocks if edited
  const localCourseMap = new Map();
  localCourses.forEach((c) => {
    if (c._id) localCourseMap.set(c._id, c);
    if (c.slug) localCourseMap.set(c.slug, c);
  });

  // Combine: local courses first, then mock courses that haven't been replaced
  const combined = [...localCourses];
  normalizedMocks.forEach((mc) => {
    if (!localCourseMap.has(mc._id) && !localCourseMap.has(mc.slug)) {
      combined.push(mc);
    }
  });

  let result = combined;

  if (filters.status && filters.status !== "all") {
    result = result.filter((c) => c.status === filters.status);
  }

  if (filters.track && filters.track !== "all") {
    result = result.filter((c) => c.track === filters.track);
  }

  if (filters.search) {
    const s = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.title?.toLowerCase().includes(s) ||
        c.summary?.toLowerCase().includes(s) ||
        c.slug?.toLowerCase().includes(s)
    );
  }

  // Sort by updatedAt descending
  return result.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
}

export function getOfflineCourseById(idOrSlug) {
  if (!idOrSlug) return null;
  const localCourses = loadLocalCoursesFromDisk();

  // 1. Look in local courses by _id or slug
  const foundLocal = localCourses.find(
    (c) => c._id === idOrSlug || c.slug === idOrSlug
  );
  if (foundLocal) return foundLocal;

  // 2. Look in mockCourses
  const foundMock = mockCourses.find(
    (c) => c._id === idOrSlug || c.slug === idOrSlug
  );
  if (foundMock) return normalizeMockCourse(foundMock);

  return null;
}

export function saveOfflineCourse(courseData) {
  const localCourses = [...loadLocalCoursesFromDisk()];
  const now = new Date().toISOString();

  // Identify course
  const targetId = courseData._id;
  const targetSlug = courseData.slug;

  const existingIdx = localCourses.findIndex(
    (c) =>
      (targetId && c._id === targetId) ||
      (targetSlug && c.slug === targetSlug)
  );

  let savedCourse;

  if (existingIdx >= 0) {
    savedCourse = {
      ...localCourses[existingIdx],
      ...courseData,
      updatedAt: now,
    };
    localCourses[existingIdx] = savedCourse;
  } else {
    // Also check if it's an edited mockCourse being saved for the first time
    const mockMatch = mockCourses.find(
      (c) => (targetId && c._id === targetId) || (targetSlug && c.slug === targetSlug)
    );

    const base = mockMatch ? normalizeMockCourse(mockMatch) : {};

    savedCourse = {
      ...base,
      ...courseData,
      _id: courseData._id || `course_local_${Date.now()}`,
      status: courseData.status || "draft",
      createdAt: courseData.createdAt || now,
      updatedAt: now,
    };
    localCourses.unshift(savedCourse);
  }

  persistLocalCoursesToDisk(localCourses);
  return savedCourse;
}

export function deleteOfflineCourse(idOrSlug) {
  let localCourses = loadLocalCoursesFromDisk();
  localCourses = localCourses.filter(
    (c) => c._id !== idOrSlug && c.slug !== idOrSlug
  );
  persistLocalCoursesToDisk(localCourses);
  return true;
}
