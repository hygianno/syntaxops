import React from "react";
import {
  Heading,
  FileText,
  Image as ImageIcon,
  Code2,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  Video,
  CheckSquare,
  Terminal,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Camera,
  Paperclip,
} from "lucide-react";
import Modal from "@/components/ui/Modal";

export const BLOCK_TYPES = [
  {
    type: "heading",
    label: "Heading",
    description: "Section subdivision header (H2, H3, H4)",
    icon: Heading,
    category: "Structure",
    defaultData: { text: "Section Title", level: "h3" },
  },
  {
    type: "rich-text",
    label: "Rich Text / Instructions",
    description: "Detailed operational instructions and markdown",
    icon: FileText,
    category: "Content",
    defaultData: { content: "Explain the procedure and architectural intent here." },
  },
  {
    type: "code",
    label: "Code / CLI Command",
    description: "Syntax-highlighted executable code with 1-click copy",
    icon: Code2,
    category: "Technical",
    defaultData: {
      language: "bash",
      code: "aws ec2 describe-vpcs --query 'Vpcs[*].VpcId' --output table",
      explanation: "Verify active VPC identifiers in your region.",
    },
  },
  {
    type: "definition",
    label: "Technical Definition",
    description: "Term, simple definition, and real-world example",
    icon: BookOpen,
    category: "Pedagogy",
    defaultData: {
      term: "CIDR Block",
      simpleDefinition: "Classless Inter-Domain Routing allocation for IP address ranges.",
      detailedExplanation: "A method for allocating IP addresses and routing IP packets in isolated subnets.",
      realWorldExample: "10.0.0.0/16 provides 65,536 private IP addresses across AWS VPC subnets.",
      docUrl: "",
    },
  },
  {
    type: "warning",
    label: "Warning / Hazard",
    description: "Cloud billing, blast radius, or security hazard alert",
    icon: AlertTriangle,
    category: "Safety",
    defaultData: {
      title: "Cost Warning",
      message: "Do not leave unattached Elastic IPs or idle NAT Gateways running.",
      severity: "billing",
    },
  },
  {
    type: "tip",
    label: "Pro Tip / Shortcut",
    description: "Best practice recommendation or terminal shortcut",
    icon: Lightbulb,
    category: "Pedagogy",
    defaultData: {
      title: "CLI Shortcut",
      message: "Use `--output json | jq .` to quickly filter nested API responses.",
    },
  },
  {
    type: "image",
    label: "Image / Screenshot",
    description: "Cloud console screenshot, topology diagram, or visual proof",
    icon: ImageIcon,
    category: "Media",
    defaultData: {
      url: "",
      title: "AWS Console View",
      caption: "VPC Route Tables Overview",
      altText: "Route Table Configuration",
    },
  },
  {
    type: "video",
    label: "Video Briefing",
    description: "YouTube or external video stream walkthrough",
    icon: Video,
    category: "Media",
    defaultData: {
      url: "",
      caption: "Step Walkthrough",
      description: "Briefing for this milestone.",
    },
  },
  {
    type: "checklist",
    label: "Task Checklist",
    description: "Interactive tasks the learner must complete",
    icon: CheckSquare,
    category: "Interaction",
    defaultData: {
      tasks: [
        { id: "c-1", text: "Create isolated VPC 10.0.0.0/16" },
        { id: "c-2", text: "Tag resource with Project=SyntaxOps" },
        { id: "c-3", text: "Verify CIDR block state is Available" },
      ],
    },
  },
  {
    type: "expected-output",
    label: "Expected Terminal Output",
    description: "Sample successful response (HTTP 200, BUILD SUCCESS)",
    icon: Terminal,
    category: "Technical",
    defaultData: {
      outputType: "terminal",
      content: "{\n  \"Vpc\": {\n    \"VpcId\": \"vpc-0a1b2c3d4e5f\",\n    \"State\": \"available\"\n  }\n}",
      note: "Confirm your output reflects the `available` state.",
    },
  },
  {
    type: "external-resource",
    label: "Documentation Link",
    description: "Reference to official documentation or RFCs",
    icon: ExternalLink,
    category: "Reference",
    defaultData: {
      title: "AWS VPC User Guide",
      url: "https://docs.aws.amazon.com/vpc/latest/userguide/",
      description: "Official AWS documentation on subnets and route tables.",
    },
  },
  {
    type: "reflection",
    label: "Step Reflection",
    description: "Prompts the learner to articulate their architectural discoveries",
    icon: MessageSquare,
    category: "Pedagogy",
    defaultData: {
      prompt: "What is the primary architectural justification for isolating this subnet?",
      minWords: 20,
    },
  },
  {
    type: "quiz",
    label: "Sanity Quiz",
    description: "Multiple choice question testing conceptual comprehension",
    icon: HelpCircle,
    category: "Assessment",
    defaultData: {
      question: "Which component allows instances in a private subnet to access the internet while blocking inbound traffic?",
      options: [
        "Internet Gateway",
        "NAT Gateway",
        "Customer Gateway",
        "Virtual Private Gateway",
      ],
      answerIndex: 1,
      explanation: "NAT Gateways provide outbound-only connectivity for private subnets.",
    },
  },
  {
    type: "evidence",
    label: "Evidence Submission Gate",
    description: "Mandatory screenshot or terminal log proof requirement",
    icon: Camera,
    category: "Verification",
    defaultData: {
      evidenceType: "screenshot",
      instructions: "Upload a screenshot showing your terminal executing `aws ec2 describe-vpcs`.",
      isRequired: true,
    },
  },
  {
    type: "attachment",
    label: "Starter File / Attachment",
    description: "Downloadable starter code, Terraform template, or configs",
    icon: Paperclip,
    category: "Reference",
    defaultData: {
      name: "main.tf",
      url: "",
      description: "Starter Terraform manifest for this milestone.",
    },
  },
];

export default function ContentBlockSelector({ isOpen, onClose, onSelect }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Content Block"
      description="Choose a structured block type to add to this milestone."
      size="lg"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1 mt-2">
        {BLOCK_TYPES.map((block) => {
          const Icon = block.icon;
          return (
            <button
              key={block.type}
              type="button"
              onClick={() => {
                onSelect(block.type, block.defaultData);
                onClose();
              }}
              className="flex items-start gap-3 p-3 text-left rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--accent)] hover:bg-[var(--surface-3)] transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0 group-hover:bg-[var(--accent-subtle)] transition-colors">
                <Icon className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[var(--text-primary)] leading-snug">
                  {block.label}
                </div>
                <div className="text-[11px] text-[var(--text-muted)] line-clamp-2 mt-0.5">
                  {block.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
