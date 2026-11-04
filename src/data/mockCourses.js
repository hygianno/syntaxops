export const mockCourses = [
  {
    _id: "course_aws_vpc_01",
    slug: "production-aws-vpc-architecture",
    title: "Production-Grade AWS VPC Network Architecture",
    track: "Cloud & DevOps",
    level: "Intermediate",
    isPaid: false,
    priceNGN: 0,
    summary:
      "Design, provision, and audit an enterprise multi-tier AWS VPC network across 3 Availability Zones with strict public/private subnet isolation and cost-aware NAT routing.",
    estimatedHours: 3,
    prerequisites: ["AWS Free Tier Account", "AWS CLI installed & authenticated", "Basic CIDR notation knowledge"],
    steps: [
      {
        stepNumber: 1,
        title: "VPC Topology & Dual-AZ Subnet Allocation",
        objective: "Carve a 10.0.0.0/16 VPC block into segregated Public and Application subnets across 2 AZs.",
        contentMarkdown: `### Enterprise Context
In cloud production environments, placing compute resources directly in public subnets is a severe security failure. In this step, you will provision an isolated Virtual Private Cloud (VPC) with intentional subnets.

\`\`\`bash
# 1. Provision your primary isolated VPC
aws ec2 create-vpc \\
  --cidr-block 10.0.0.0/16 \\
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=syntaxops-prod-vpc}]'

# Note your VpcId from the output (e.g. vpc-0a1b2c3d4e5f67890)
\`\`\`

### Key Architectural Guidelines
1. Allocate \`10.0.1.0/24\` (Public AZ-A) and \`10.0.2.0/24\` (Public AZ-B) for Load Balancers.
2. Allocate \`10.0.10.0/24\` (Private App AZ-A) and \`10.0.20.0/24\` (Private App AZ-B) for internal workloads.`,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        hasVideo: true,
        costAlert: "Provisioning a VPC and Subnets is 100% free on AWS. No NAT Gateways are provisioned yet.",
        promptQuestion: "What is the primary architectural justification for separating public ingress subnets from private application subnets?",
        requiresScreenshot: true,
        quiz: {
          question: "Which of the following describes why an application backend should not reside in a public subnet?",
          options: [
            "Public subnets do not support SSL/TLS encryption",
            "Any resource with an auto-assigned public IP and route table entry to an IGW has an exposed attack surface",
            "Private subnets run on faster physical AWS hardware than public subnets",
            "AWS charges double ingress bandwidth fees for public subnets"
          ],
          answerIndex: 1,
        },
      },
      {
        stepNumber: 2,
        title: "Internet Gateway & Route Table Isolation",
        objective: "Attach an Internet Gateway (IGW) and configure explicit Route Tables so only public subnets can route outbound traffic directly.",
        contentMarkdown: `### Ingress Routing Control
An Internet Gateway provides the target in your VPC route tables for internet-routable traffic.

\`\`\`bash
# 1. Create the Internet Gateway
aws ec2 create-internet-gateway \\
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=syntaxops-prod-igw}]'

# 2. Attach to your VPC
aws ec2 attach-internet-gateway \\
  --internet-gateway-id <your-igw-id> \\
  --vpc-id <your-vpc-id>
\`\`\`

Verify route table associations:
\`\`\`bash
aws ec2 describe-route-tables --filters "Name=vpc-id,Values=<your-vpc-id>"
\`\`\``,
        videoUrl: null,
        hasVideo: false,
        costAlert: "Attaching an Internet Gateway has $0 standing cost. Data transfer charges only apply to active egress bandwidth.",
        promptQuestion: "Explain the consequence if an engineer mistakenly associates the private subnet route table with the 0.0.0.0/0 target pointed at the IGW.",
        requiresScreenshot: true,
        quiz: {
          question: "What route target must 0.0.0.0/0 point to in a public subnet route table for two-way internet reachability?",
          options: [
            "An Elastic Network Interface (eni-xxxx)",
            "The Internet Gateway (igw-xxxx)",
            "The local VPC CIDR block (10.0.0.0/16)",
            "A Virtual Private Gateway (vgw-xxxx)"
          ],
          answerIndex: 1,
        },
      },
      {
        stepNumber: 3,
        title: "Security Group Layering & Teardown Verification",
        objective: "Create least-privilege security groups and teardown all lab resources to ensure zero lingering costs.",
        contentMarkdown: `### Principle of Least Privilege
Security groups are stateful virtual firewalls. Enforce rules that only allow HTTP port 80/443 from the ALB security group into the application tier.

\`\`\`bash
# Create Application Security Group
aws ec2 create-security-group \\
  --group-name syntaxops-app-sg \\
  --description "Security group for internal application services" \\
  --vpc-id <your-vpc-id>
\`\`\`

### Teardown Directive
Run the following cleanup sequence to guarantee you leave no active billable resources:
\`\`\`bash
aws ec2 detach-internet-gateway --internet-gateway-id <igw-id> --vpc-id <vpc-id>
aws ec2 delete-internet-gateway --internet-gateway-id <igw-id>
aws ec2 delete-vpc --vpc-id <vpc-id>
\`\`\``,
        videoUrl: null,
        hasVideo: false,
        costAlert: "CRITICAL: Follow the teardown commands immediately after capturing your terminal proof to prevent accidental billing.",
        promptQuestion: "Describe the stateful nature of AWS Security Groups and how it differs from stateless Network ACLs (NACLs).",
        requiresScreenshot: true,
        quiz: {
          question: "When a request is permitted inbound through a Security Group, what outbound rule is required to return response traffic?",
          options: [
            "An explicit outbound rule matching the client's ephemeral port range",
            "No outbound rule is needed because Security Groups are stateful",
            "An outbound rule with priority number 100",
            "A bidirectional IGW authorization policy"
          ],
          answerIndex: 1,
        },
      },
    ],
  },
  {
    _id: "course_k8s_canary_02",
    slug: "kubernetes-production-canary-deployments",
    title: "Kubernetes Production Canary Deployments with Argo Rollouts",
    track: "Cloud & DevOps",
    level: "Advanced",
    isPaid: true,
    priceNGN: 15000,
    summary:
      "Implement zero-downtime progressive traffic shifting on Kubernetes using Argo Rollouts, Prometheus metric analysis, and automated rollbacks.",
    estimatedHours: 4,
    prerequisites: ["Local Docker daemon or Minikube/KinD", "kubectl v1.28+", "Basic Helm experience"],
    steps: [
      {
        stepNumber: 1,
        title: "Cluster Bootstrap & Argo Rollouts Controller Installation",
        objective: "Spin up a local KinD cluster and install the Argo Rollouts custom resource definitions and controller.",
        contentMarkdown: `### Cluster Setup
Spin up a local multi-node KinD cluster with ingress ports forwarded:

\`\`\`bash
cat <<EOF | kind create cluster --config=-
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
EOF

# Install Argo Rollouts
kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
\`\`\``,
        videoUrl: null,
        hasVideo: false,
        costAlert: "Runs entirely on your local machine using KinD or Minikube ($0 cloud cost).",
        promptQuestion: "Why is a custom controller needed to orchestrate Canary releases instead of standard Kubernetes Deployments?",
        requiresScreenshot: true,
        quiz: {
          question: "What native Kubernetes object does an Argo Rollout resource replace?",
          options: ["DaemonSet", "Deployment", "StatefulSet", "ConfigMap"],
          answerIndex: 1,
        },
      },
    ],
  },
  {
    _id: "course_docker_security_03",
    slug: "docker-container-security-auditing",
    title: "Docker Container Hardening & Distroless Audits",
    track: "Full-Stack Web Dev",
    level: "Beginner",
    isPaid: false,
    priceNGN: 0,
    summary:
      "Hardening container runtimes, non-root user execution, multi-stage compilation, and vulnerability scanning with Trivy.",
    estimatedHours: 2,
    prerequisites: ["Docker installed locally", "Familiarity with basic Dockerfile syntax"],
    steps: [
      {
        stepNumber: 1,
        title: "Multi-Stage Dockerfile & Distroless Image Base",
        objective: "Refactor a bloated Node.js container from 1.2GB down to 65MB using Google Distroless and multi-stage builds.",
        contentMarkdown: `### Minimal Attack Surface
Default Node.js base images include package managers (apt, apk), shells (bash, sh), and build tools that attackers exploit upon remote code execution.

\`\`\`dockerfile
# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Production Distroless Stage
FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=builder /app /app
USER nonroot
CMD ["server.js"]
\`\`\``,
        videoUrl: null,
        hasVideo: false,
        costAlert: "100% free local execution.",
        promptQuestion: "Why does eliminating the shell (/bin/sh) from a production container image dramatically impede attacker post-exploitation?",
        requiresScreenshot: true,
        quiz: {
          question: "What is the primary security advantage of running a container as a non-root user?",
          options: [
            "It speeds up Node.js V8 execution",
            "It prevents container breakout payloads from having root privileges on the host kernel",
            "It encrypts the container layer files on disk",
            "It automatically assigns a TLS certificate"
          ],
          answerIndex: 1,
        },
      },
    ],
  },
];
