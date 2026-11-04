"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { formatCredentialId } from "@/lib/hmac";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#0B0F19",
    color: "#E2E8F0",
    padding: 36,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
    paddingBottom: 16,
    marginBottom: 20,
  },
  logoBrand: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#38BDF8",
    letterSpacing: 1,
  },
  logoSubtitle: {
    fontSize: 8,
    color: "#94A3B8",
    marginTop: 2,
  },
  credentialBox: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
    padding: 8,
    borderRadius: 4,
    alignItems: "flex-end",
  },
  credentialTitle: {
    fontSize: 7,
    color: "#38BDF8",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  credentialHash: {
    fontSize: 9,
    fontFamily: "Courier",
    color: "#F8FAFC",
    marginTop: 2,
  },
  titleSection: {
    marginBottom: 16,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F8FAFC",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    fontSize: 8,
    color: "#38BDF8",
  },
  authorSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  authorLabel: {
    fontSize: 7,
    color: "#94A3B8",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  authorValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#F1F5F9",
  },
  calloutContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 6,
  },
  calloutTitle: {
    fontSize: 8,
    color: "#38BDF8",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  calloutBody: {
    fontSize: 9,
    lineHeight: 1.4,
    color: "#CBD5E1",
  },
  archImage: {
    marginTop: 8,
    maxHeight: 160,
    objectFit: "contain",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#334155",
  },
  stepContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 6,
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
    paddingBottom: 8,
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#38BDF8",
  },
  stepTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#F8FAFC",
  },
  sectionLabel: {
    fontSize: 8,
    color: "#38BDF8",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 4,
  },
  reflectionBody: {
    fontSize: 9,
    lineHeight: 1.45,
    color: "#CBD5E1",
  },
  screenshotImage: {
    marginTop: 8,
    maxHeight: 160,
    objectFit: "contain",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#334155",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    paddingTop: 8,
    fontSize: 7,
    color: "#64748B",
  },
});

export default function ProjectReportDoc({ submission }) {
  const {
    userFullName = "Engineer",
    userEmail = "",
    courseTitle = "Cloud Lab",
    courseProblemStatement = "",
    architectureDiagramUrl = null,
    track = "Cloud & DevOps",
    level = "Intermediate",
    completedAt = new Date().toISOString(),
    verificationHash = "",
    stepResponses = [],
    openingReflection = null,
    finalReflection = null,
  } = submission || {};

  const credentialId = formatCredentialId(verificationHash);

  return (
    <Document title={`Syntax_Ops_Proof_of_Work_${credentialId}`}>
      <Page size="A4" style={styles.page}>
        {/* Brand Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoBrand}>SYNTAX_OPS</Text>
            <Text style={styles.logoSubtitle}>
              Auditable Proof of Work (PoW) Engineering Dossier
            </Text>
          </View>
          <View style={styles.credentialBox}>
            <Text style={styles.credentialTitle}>Cryptographic Credential</Text>
            <Text style={styles.credentialHash}>{credentialId}</Text>
          </View>
        </View>

        {/* Project Title & Badges */}
        <View style={styles.titleSection}>
          <Text style={styles.courseTitle}>{courseTitle}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.badge}>Track: {track}</Text>
            <Text style={styles.badge}>Level: {level}</Text>
            <Text style={styles.badge}>Status: VERIFIED & AUDITED</Text>
          </View>
        </View>

        {/* Author Verification Block */}
        <View style={styles.authorSection}>
          <View>
            <Text style={styles.authorLabel}>Verified Engineer</Text>
            <Text style={styles.authorValue}>{userFullName}</Text>
          </View>
          <View>
            <Text style={styles.authorLabel}>Registered Email</Text>
            <Text style={styles.authorValue}>{userEmail}</Text>
          </View>
          <View>
            <Text style={styles.authorLabel}>Execution Timestamp</Text>
            <Text style={styles.authorValue}>
              {new Date(completedAt).toUTCString()}
            </Text>
          </View>
        </View>

        {/* Real-World Problem Statement (if present) */}
        {courseProblemStatement && (
          <View style={styles.calloutContainer} wrap={false}>
            <Text style={styles.calloutTitle}>Engineering Problem Statement</Text>
            <Text style={styles.calloutBody}>{courseProblemStatement}</Text>
          </View>
        )}

        {/* Architecture Topology Diagram (if present) */}
        {architectureDiagramUrl && (
          <View style={styles.calloutContainer} wrap={false}>
            <Text style={styles.calloutTitle}>Audited System Architecture</Text>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={architectureDiagramUrl} style={styles.archImage} />
          </View>
        )}

        {/* Opening Reflection (if present) */}
        {openingReflection && (
          <View style={styles.calloutContainer} wrap={false}>
            <Text style={styles.calloutTitle}>Pre-Implementation Discovery & Hypotheses</Text>
            <Text style={styles.calloutBody}>{openingReflection}</Text>
          </View>
        )}

        {/* Milestones Evidence Walkthrough */}
        {stepResponses.map((step, idx) => (
          <View key={step.stepNumber || idx} style={styles.stepContainer} wrap={false}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>
                Milestone {step.stepNumber}: {step.title || `Step ${step.stepNumber}`}
              </Text>
              <Text style={styles.stepNumber}>PASSED</Text>
            </View>

            <Text style={styles.sectionLabel}>Cognitive Discovery Analysis:</Text>
            <Text style={styles.reflectionBody}>
              {step.reflectionText || "No reflection submitted."}
            </Text>

            {step.screenshotUrl && (
              <View>
                <Text style={styles.sectionLabel}>Auditable Terminal / Cloud Proof:</Text>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={step.screenshotUrl} style={styles.screenshotImage} />
              </View>
            )}
          </View>
        ))}

        {/* Final Reflection / Post-Mortem (if present) */}
        {finalReflection && (
          <View style={styles.calloutContainer} wrap={false}>
            <Text style={styles.calloutTitle}>Post-Mortem & Synthesis</Text>
            <Text style={styles.calloutBody}>{finalReflection}</Text>
          </View>
        )}

        {/* Legal Sign-off Footer */}
        <View style={styles.footer} fixed>
          <Text>
            Syntax_Ops • Issued under HMAC SHA-256 Verification Protocol
          </Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
