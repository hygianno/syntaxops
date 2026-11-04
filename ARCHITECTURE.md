# SYNTAX_OPS PLATFORM SPECIFICATION & ARCHITECTURE DESIGN DOCUMENT

> **Document Version:** 1.0.0  
> **Target Environment:** Production MVP  
> **Classification:** Core System Architecture & Engineering Rationale  
> **Author:** Folarin Favour Olaoluwapo  
> **Repository:** `syntaxops-app`  

---

## 1. Executive Summary & Problem Statement

### 1.1 The African Cloud & Software Engineering Talent Reality
The developer ecosystem across Africa—spearheaded by high-density tech hubs in Lagos, Nairobi, Cape Town, Accra, and Kigali—is experiencing a structural paradox. While demand for cloud engineers, DevOps practitioners, and robust backend engineers is surging globally, entry-level and transitioning African engineers face acute hiring friction.

The root cause is a crisis of credibility. Hundreds of thousands of candidates graduate from generic bootcamps or amass certificates of completion by passively watching 60-hour video series on Udemy, Coursera, or YouTube. This has triggered two compounding dysfunctions:
* **"Tutorial Hell":** Learners become adept at passively following along as an instructor codes in a pristine, pre-configured development environment. When confronted with real-world failure states—IAM permission misconfigurations, subnet routing errors, broken package manager dependencies, or merge conflicts—they stall.
* **Credential Inflation:** A PDF certificate stating that a student "watched" a course carries near-zero signal for hiring managers, technical leads, and overseas recruiters. Employers now demand verifiable, auditable Proof of Work (PoW).

### 1.2 The NextWork Benchmark & The Syntax_Ops Evolution
Platforms like NextWork (`nextwork.ai`) pioneered the shift toward hands-on, micro-step documentation in the cloud space. However, Syntax_Ops advances this concept specifically for production-grade engineering while dismantling friction points common to emerging markets:

| Dimension | Standard Video Platforms (Udemy, Coursera) | NextWork Model | Syntax_Ops Approach |
| :--- | :--- | :--- | :--- |
| **Pedagogical Model** | Passive video consumption | Guided lab steps + screenshots | Dual-Pane Active Lab + Reflection Notebook + Evidentiary Audit |
| **Verification** | Passive timestamp tracking | Community forum posts | Auditable Step Evidence (Terminal Outputs, CLI Hashes, Console Shots) |
| **Portfolio Output** | Generic completion certificate | Basic community post / web view | Self-Contained, Client-Compiled PDF Project Dossier + Verified Credential |
| **Infrastructure Economics** | High subscription fees ($30–$50/mo) | USD subscription gating | Dual-Tier: Free Foundational Labs + Low-Barrier Pan-African Fiat (Paystack) |
| **Bandwidth Footprint** | Massive continuous video streaming | Low-to-medium video | Zero-Egress Responsive Markdown-First + Optional Low-Bitrate Micro-Briefings |

Syntax_Ops transforms learning from a passive spectator sport into an active engineering engagement. The platform serves as an interactive IDE-like workspace where users build in their own AWS/Linux/Node environments, submit proof at every critical architectural junction, and emerge with a standardized, auditable portfolio piece that proves competence to any technical auditor.

---

## 2. The Learning Workflow Architecture

The platform operates on a deterministic, four-phase execution loop designed to enforce comprehension before progression.

```
       [ PHASE 1: EXPLORATION ]
                  |
                  v
       +---------------------------------------------+
       | - High-level architectural objective        |
       | - Micro-briefing video (Optional / Streamed)|
       | - Cloud cost & blast-radius warning alert   |
       +---------------------------------------------+
                  |
                  v
       [ PHASE 2: REAL-ENVIRONMENT EXECUTION ]
                  |
                  v
       +---------------------------------------------+
       | - Real infrastructure provisioning          |
       | - Local CLI / AWS Console / Terraform / App |
       | - Failure debugging in learner's account    |
       +---------------------------------------------+
                  |
                  v
       [ PHASE 3: REFLECTION & AUDITABLE PROOF ]
                  |
                  v
       +---------------------------------------------+
       | - Mandatory reflection write-up (>20 words) |
       | - Terminal output / Screenshot upload       |
       | - Inline conceptual sanity quiz (1-click)   |
       +---------------------------------------------+
                  |
                  v
       [ PHASE 4: ARTIFACT GENERATION ]
                  |
                  v
       +---------------------------------------------+
       | - Client-side vector compilation (@react-pdf)|
       | - Cryptographic Verification Hash (HMAC)    |
       | - Direct social sharing package (LinkedIn)  |
       +---------------------------------------------+
```

### Phase 1: Exploration
The learner enters an isolated lab environment. The workspace displays:
* **Architectural Objective:** The business context and engineering problem being solved.
* **Media Module:** An optional video briefing (under 3 minutes) embedded from an unlisted YouTube source or an architecture diagram hosted on CloudFront.
* **Cost & Blast Radius Alert:** Prominent notices detailing whether a step uses AWS Free Tier resources or incurs hourly charges (e.g., explicit warnings against provisioning idle NAT Gateways or unattached Elastic IPs).

### Phase 2: Real-Environment Execution
No synthetic, simulated terminal sandbox is provided. The learner opens their own terminal, connects to their own AWS account, or configures their local development machine. They execute commands, run into environment-specific nuances (Linux permissions, SSH keys, network firewalls), and resolve them firsthand.

### Phase 3: Reflection & Proof of Work (PoW)
The learner cannot advance to the next step by merely clicking "Next". The right-hand pane of the lab workspace enforces three inputs:
1. **Conceptual Discovery Write-Up:** A required text field prompting the learner to articulate why an action was performed (e.g., *"Why did we set file permissions to chmod 400 on the private key?"*). Validation blocks empty or trivial inputs (minimum 20 words).
2. **Evidentiary Screenshot/Log:** The learner uploads an image or pastes terminal output demonstrating successful execution (e.g., terminal output showing `HTTP/1.1 200 OK` or `BUILD SUCCESS`).
3. **Conceptual Sanity Quiz:** A single targeted multiple-choice question verifying comprehension of the underlying architectural concept.

### Phase 4: Automated Artifact Generation
Upon completing all steps:
* The client-side runtime collects the step reflections, uploaded proof images, project metadata, and timestamps.
* The `@react-pdf/renderer` engine compiles a multi-page, publication-grade Project Completion Dossier.
* A unique Verification ID is generated, binding the student's name, completion timestamp, and project hash.
* The learner receives a formatted summary with 1-click hooks to post their verifiable portfolio artifact directly to LinkedIn, Twitter/X, and GitHub.

---

## 3. Tech Stack Justification & Trade-Off Analysis

```
+-----------------------------------------------------------------------------------------+
|                                    CLIENT LAYER                                         |
|  Next.js App Router (React 19) • Tailwind CSS • Lucide Icons • @react-pdf/renderer      |
+-----------------------------------------------------------------------------------------+
                                 |                                 |
           Static Assets / MDX   |                     API Routes  | JSON Payloads
                                 v                                 v
+------------------------------------+    +-----------------------------------------------+
|      EDGE CONTENT DELIVERY         |    |              COMPUTE LAYER                    |
|  - Vercel Edge Network             |    |  - Vercel Serverless Functions (Node.js 20.x) |
|  - CloudFront CDN + S3             |    |  - Paystack Webhook Ingestion Engine          |
|  - YouTube Native CDN Engine       |    |  - NextAuth / Stateless Session Tokens        |
+------------------------------------+    +-----------------------------------------------+
                                                                   |
                                                      Mongoose /   | Cached Connection Pool
                                                      TLS Socket   | (maxPoolSize: 10)
                                                                   v
                                          +-----------------------------------------------+
                                          |               PERSISTENCE LAYER               |
                                          |  MongoDB Atlas (M0 Shared Cluster)            |
                                          |  - Document Polymorphism for Lab Structures   |
                                          |  - Transactional Enrolment & Proof Tracking   |
                                          +-----------------------------------------------+
```

### 3.1 Framework: Next.js App Router (React)
* **Rationale:** A solo engineer building an end-to-end platform cannot afford the operational drag of maintaining separate repositories, deployment pipelines, CORS configurations, and API Gateway bindings for decoupled frontend and backend services. The App Router provides:
  * Server Components (RSC) for fast initial catalog and lab documentation loading.
  * Server Actions and Route Handlers (`src/app/api/`) for co-located backend logic.
  * Universal TypeScript/JavaScript code sharing across validation schemas, data models, and client components.
* **Trade-Off:** Cold-start overhead on serverless API routes is managed by keeping function payloads lean and stripping heavy libraries from the backend path.

### 3.2 Hosting & Edge Infrastructure: Vercel (.vercel.app to Custom Domain)
* **Rationale:** Vercel delivers zero-maintenance CI/CD linked directly to GitHub commits, automated preview deployments, edge asset caching, and automatic SSL termination.
* **Domain Strategy:** Starting on `syntaxops.vercel.app` allows immediate staging and MVP testing with ₦0 domain registration costs. Once the payment pipeline is verified, a custom `.com` or `.ng` domain is bound to Vercel via CNAME/A records without any infrastructure refactoring.
* **Trade-Off:** Vendor lock-in to Vercel's serverless primitives is mitigated by writing standards-compliant Web API Request/Response handlers inside `/app/api/`.

### 3.3 Media Delivery Strategy: Unlisted YouTube & AWS S3/CloudFront
* **Rationale:** Video hosting and bandwidth egress are the fastest ways to bankrupt an early-stage EdTech platform. Video files served directly from standard cloud storage can cost hundreds of dollars in data transfer fees.
* **Video Walkthroughs:** Hosted as unlisted videos on YouTube. This offloads transcoding, adaptive bitrate streaming, and multi-device video player optimization to Google’s infrastructure at zero cost. YouTube’s edge peering with African Internet Exchange Points (IXPN in Lagos, KIXP in Nairobi, NAPAfrica in Johannesburg) guarantees low-latency playback across local mobile networks (MTN, Airtel, Safaricom).
* **Static Architecture Diagrams & Cheatsheets:** Hosted on AWS S3 and distributed via Amazon CloudFront. CloudFront provides 1TB of free data transfer out per month, ensuring diagrams and assets load near-instantly without hitting origin S3 bucket quotas.
* **The Trade-Off (Security vs. Survival):** Unlisted YouTube videos can technically be shared via direct link by a malicious paid user. For an MVP, distribution and low operational costs supersede bulletproof DRM. Watermarking and private video hosting (via Cloudflare Stream or Bunny.net at $5/month) are slated for Phase 2 once paid revenue exceeds infrastructure costs.

### 3.4 Database: MongoDB Atlas (M0 Free Tier)
* **Rationale:** Educational platforms require polymorphic data modeling. A cloud lab step may contain bash snippets, markdown documentation, an embedded video, multiple-choice quizzes, or terminal validation regexes. MongoDB’s document model accommodates this schema variation without requiring complex relational schema migrations.
* **Serverless Connection Pooling Challenge:** Serverless functions spin up and down dynamically. If 50 users load the site simultaneously, 50 serverless function instances could open 50 separate database connections, rapidly exhausting MongoDB Atlas M0’s strict ceiling of 500 concurrent connections.
* **Mitigation:** Implement global connection caching in `src/lib/mongodb.js`. The connection promise is cached across function invocations, and `maxPoolSize` is capped at 10:

```javascript
// Connection caching pattern
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

### 3.5 Artifact Generation Engine: Client-Side @react-pdf/renderer vs. Serverless Headless Browsers
* **Rationale:** Traditional PDF generation relies on running headless Chrome (via Puppeteer or Playwright) on a server to print a web page to PDF.
* **The Serverless Failure Mode:** Headless Chrome binaries require ~150MB–300MB of disk space and consume 512MB–1GB of RAM. Deploying Puppeteer on Vercel Serverless Functions immediately trips:
  * The 50MB zipped function size limit.
  * The 10-second execution timeout on the hobby tier.
  * Serverless memory exhaustion crashes.
* **The Syntax_Ops Solution:** Use `@react-pdf/renderer` to construct the document purely within the client's browser using SVG and vector canvas primitives. The client machine executes the layout calculations and PDF compilation.
* **Result:** Zero server load, zero memory consumption on Vercel, zero financial cost per generated PDF, and instant client downloads even under heavy concurrency.

### 3.6 Payment Infrastructure: Paystack Inline & Webhooks
* **Rationale:** Paystack is the standard for developer monetization across Nigeria, Ghana, Kenya, and South Africa. It supports local debit cards (Mastercard, Visa, Verve), direct bank transfers, USSD, and mobile money.
* **Architecture:**
  * The frontend initiates Paystack Popup for frictionless checkout.
  * The backend never grants course access on client-side success callbacks (which can be spoofed).
  * All access provisioning is driven asynchronously by the `/api/webhooks/paystack` endpoint, protected by HMAC SHA-512 signature validation and strict idempotency checks.

---

## 4. Security, Performance & Scalability Principles

```
[ PAYSTACK SERVER ]                     [ NEXT.JS /api/webhooks/paystack ]             [ MONGODB ATLAS ]
        |                                                 |                                     |
        | --- 1. POST Event (charge.success) -----------> |                                     |
        |        x-paystack-signature: <HMAC_HASH>        |                                     |
        |                                                 |                                     |
        |                                                 | --- 2. Verify HMAC SHA-512 -------- |
        |                                                 |        Hash(body, SECRET_KEY)       |
        |                                                 |        Match?                       |
        |                                                 |        YES: Continue                |
        |                                                 |        NO: 401 Unauthorized         |
        |                                                 |                                     |
        |                                                 | --- 3. Check Idempotency Table ---> |
        |                                                 |        Transaction Reference Exists?|
        |                                                 |        YES: Return 200 OK (Skip)    |
        |                                                 |        NO: Process Enrolment        |
        |                                                 |                                     |
        |                                                 | --- 4. Atomic Update -------------> |
        |                                                 |        $addToSet: enrolledCourses   |
        |                                                 |        Insert Order Record          |
        |                                                 |                                     |
        | <-- 5. 200 OK Acknowledgment -------------------|                                     |
```

### 4.1 Payment Webhook Security & Idempotency
Payment providers guarantee at-least-once delivery, meaning network retries can send the identical `charge.success` payload multiple times. Syntax_Ops enforces:
* **Cryptographic Verification:** Every incoming webhook payload is hashed using `crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)` and compared against the `x-paystack-signature` header using timing-safe string comparison.
* **Idempotency Guard:** The transaction reference is checked against an `Orders` collection. If the order has already been processed, the endpoint returns a `200 OK` immediately without duplicating database writes or corrupting user access state.
* **Atomic User Updates:** The course ID is pushed to the user’s `enrolledCourses` array using MongoDB’s `$addToSet` operator, preventing duplicate course entries.

### 4.2 Data Loss Prevention: Optimistic Local State Persistence
Learners spend 15–45 minutes troubleshooting a cloud step. If a network drops or a browser tab crashes, unsaved reflections would cause frustration.
* **Mechanism:** Every keystroke in the student's notebook pane writes to `localStorage` under a namespaced key (`syntaxops:draft:[courseId]:[stepNumber]`).
* When the learner returns or refreshes the page, the workspace automatically restores the working draft.
* On successful API synchronization with `/api/submissions/save`, the local draft is cleared.

### 4.3 Environment Isolation & Secrets Guardrails
* All third-party secrets (`PAYSTACK_SECRET_KEY`, `MONGODB_URI`, `AWS_SECRET_ACCESS_KEY`) are stripped from client bundles.
* Next.js public variables are restricted exclusively to `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`.
* Cloud storage uploads for student screenshots utilize short-lived S3 Pre-Signed URLs, preventing the platform from exposing AWS root or IAM write credentials to the browser.

---

## 5. Complete Directory Structure & System Boundaries

```
syntaxops-app/
├── public/
│   ├── branding/
│   │   ├── logo.svg
│   │   └── favicon.ico
│   └── images/
│       └── courses/
│           ├── vpc-architecture-diagram.png
│           └── ci-cd-pipeline-preview.png
├── src/
│   ├── app/
│   │   ├── layout.jsx                        # Global root layout, metadata & fonts
│   │   ├── page.jsx                          # Marketing landing page & platform ethos
│   │   ├── courses/
│   │   │   └── page.jsx                      # Course catalog with tier/track filtering
│   │   ├── learn/
│   │   │   └── [courseSlug]/
│   │   │       └── page.jsx                  # Interactive dual-pane lab workspace
│   │   ├── portfolio/
│   │   │   └── [submissionId]/
│   │   │       └── page.jsx                  # Verified portfolio report & PDF export
│   │   ├── admin/
│   │   │   └── courses/
│   │   │       └── new/
│   │   │           └── page.jsx              # Admin course authoring & validation
│   │   └── api/
│   │       ├── courses/
│   │       │   └── route.js                  # GET all courses, POST new course (admin)
│   │       ├── submissions/
│   │       │   ├── save/
│   │       │   │   └── route.js              # POST auto-save step reflection & evidence
│   │       │   └── finalize/
│   │       │       └── route.js              # POST complete lab & generate verification hash
│   │       └── webhooks/
│   │           └── paystack/
│   │               └── route.js              # POST HMAC-verified payment capture
│   ├── components/
│   │   ├── catalog/
│   │   │   ├── CourseCard.jsx                # Course item with price, level & track badges
│   │   │   └── FilterBar.jsx                 # Track & tier filter toggles
│   │   ├── lab/
│   │   │   ├── StepInstructionPane.jsx       # Left pane: Markdown, alerts & YouTube embed
│   │   │   ├── StudentNotebookPane.jsx       # Right pane: Reflection input & evidence upload
│   │   │   ├── CodeBlock.jsx                 # Syntax-highlighted code block with 1-click copy
│   │   │   ├── CostWarningAlert.jsx          # Cloud cost & teardown warning banner
│   │   │   └── SanityQuiz.jsx                # Single-question step verification check
│   │   ├── portfolio/
│   │   │   ├── CertificateBadge.jsx          # SVG-rendered verified credential badge
│   │   │   └── ShareButtons.jsx              # Pre-formatted LinkedIn/Twitter share links
│   │   ├── pdf/
│   │   │   └── ProjectReportDoc.jsx          # Vector PDF definition for @react-pdf/renderer
│   │   ├── layout/
│   │   │   ├── Navbar.jsx                    # Global header & authentication status
│   │   │   └── Footer.jsx                    # System status, links & community channels
│   │   └── ui/
│   │       ├── Button.jsx                    # Polymorphic design button
│   │       ├── Input.jsx                     # Form inputs with accessible validation states
│   │       └── Modal.jsx                     # Modal dialogues for checkout & alerts
│   ├── data/
│   │   └── mockCourses.js                    # Offline development seed data & schemas
│   ├── hooks/
│   │   ├── useLocalStorage.js                # Resilient local draft auto-save hook
│   │   └── useLabProgress.js                 # State machine managing active step & completion
│   ├── lib/
│   │   ├── mongodb.js                        # Cached serverless Mongoose connector
│   │   ├── paystack.js                       # Paystack initialization & signature verification
│   │   └── utils.js                          # Class merging (cn) & currency formatters
│   └── models/
│       ├── Course.js                         # Course & nested Step Mongoose models
│       ├── User.js                           # User profile & enrolledCourses mapping
│       ├── Submission.js                     # Step evidence, reflections & certificate hashes
│       └── Order.js                          # Idempotent payment audit logs
├── .env.example                              # Template for required environment variables
├── .env.local                                # Local runtime secrets (untracked)
├── jsconfig.json                             # Path alias mapping (@/* -> ./src/*)
├── next.config.mjs                           # Next.js compiler & external image domain config
├── package.json                              # Project scripts and pinned dependencies
├── postcss.config.mjs                        # PostCSS configuration for Tailwind
└── tailwind.config.js                        # Dark-mode first design tokens & typography
```

---

## 6. Target Production Data Schemas

```
+------------------------------------+          +------------------------------------+
|               Course               |          |                User                |
+------------------------------------+          +------------------------------------+
| _id: ObjectId                      |          | _id: ObjectId                      |
| slug: String (Indexed)             |          | email: String (Unique)             |
| title: String                      |          | fullName: String                   |
| track: String                      |          | enrolledCourses: [CourseId]        |
| level: Enum                        |          +------------------------------------+
| isPaid: Boolean                    |                            |
| priceNGN: Number                   |                            |
| steps: [StepSchema]                |                            |
+------------------------------------+                            v
                 |                              +------------------------------------+
                 |                              |             Submission             |
                 v                              +------------------------------------+
+------------------------------------+          | _id: ObjectId                      |
|             StepSchema             |          | userId: Ref(User)                  |
+------------------------------------+          | courseId: Ref(Course)              |
| stepNumber: Number                 |          | isCompleted: Boolean               |
| title: String                      |          | verificationHash: String (Unique)  |
| contentMarkdown: String            |          | completedAt: Date                  |
| videoUrl: String (Nullable)        |          | stepResponses: [StepResponse]      |
| costAlert: String (Nullable)       |          +------------------------------------+
| promptQuestion: String             |                            |
| quiz: { question, options, answer }|                            v
+------------------------------------+          +------------------------------------+
                                                |            StepResponse            |
                                                +------------------------------------+
                                                | stepNumber: Number                 |
                                                | reflectionText: String             |
                                                | screenshotUrl: String              |
                                                | quizPassed: Boolean                |
                                                | submittedAt: Date                  |
                                                +------------------------------------+
```

### 6.1 Mongoose Model Definitions (`src/models/Course.js`)
```javascript
import mongoose from "mongoose";

const StepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  objective: { type: String, required: true },
  contentMarkdown: { type: String, required: true },
  videoUrl: { type: String, default: null },
  hasVideo: { type: Boolean, default: false },
  costAlert: { type: String, default: null },
  promptQuestion: { type: String, required: true },
  requiresScreenshot: { type: Boolean, default: true },
  quiz: {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    answerIndex: { type: Number, required: true }
  }
});

const CourseSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  track: { 
    type: String, 
    required: true, 
    enum: ["Cloud & DevOps", "Full-Stack Web Dev", "AI & Automation"] 
  },
  level: { 
    type: String, 
    required: true, 
    enum: ["Beginner", "Intermediate", "Advanced"], 
    default: "Beginner" 
  },
  isPaid: { type: Boolean, default: false },
  priceNGN: { type: Number, default: 0 },
  summary: { type: String, required: true },
  estimatedHours: { type: Number, default: 2 },
  prerequisites: [{ type: String }],
  steps: [StepSchema]
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
```

### 6.2 Submission & Verification Model (`src/models/Submission.js`)
```javascript
import mongoose from "mongoose";

const StepResponseSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  reflectionText: { type: String, required: true },
  screenshotUrl: { type: String, default: null },
  quizPassed: { type: Boolean, required: true },
  submittedAt: { type: Date, default: Date.now }
});

const SubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
  isCompleted: { type: Boolean, default: false },
  verificationHash: { type: String, unique: true, sparse: true },
  completedAt: { type: Date, default: null },
  stepResponses: [StepResponseSchema]
}, { timestamps: true });

// Prevent duplicate active submissions per user per course
SubmissionSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
```

---

## 7. Immediate Execution Directives

With the repository initialized and the engineering specifications documented, proceed with the following build order:
1. **Persist this Document:** Saved directly to `ARCHITECTURE.md` in the project root (`syntaxops-app/ARCHITECTURE.md`).
2. **Phase 1 Implementation:** Code the foundational design tokens in `tailwind.config.js` and build the atomic UI components (`src/components/layout/Navbar.jsx`, `src/components/catalog/CourseCard.jsx`).
3. **Phase 2 Implementation:** Build the core dual-pane engine in `src/app/learn/[courseSlug]/page.jsx`, connecting the Markdown reader and local draft auto-saving hooks.
4. **Phase 3 Implementation:** Build the client-side vector compilation component (`src/components/pdf/ProjectReportDoc.jsx`) to enable instant portfolio downloads.
