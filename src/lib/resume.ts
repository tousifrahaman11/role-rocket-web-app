import type { Job, Resume } from "@prisma/client";

export const BASELINE_SKILLS = [
  "javascript",
  "typescript",
  "react",
  "next.js",
  "node.js",
  "sql",
  "postgresql",
  "rest",
  "api",
  "testing",
  "jest",
  "cicd",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "gcp",
  "product management",
  "agile",
  "scrum",
];

export function extractSkillsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const matches = new Set<string>();

  for (const skill of BASELINE_SKILLS) {
    if (lower.includes(skill.toLowerCase())) {
      matches.add(skill);
    }
  }

  return Array.from(matches);
}

export function calculateRocketScore({
  resumeSkills,
  jobSkills,
}: {
  resumeSkills: string[];
  jobSkills: string[];
}): number {
  if (!jobSkills.length) return 50;

  const resumeSet = new Set(resumeSkills.map((s) => s.toLowerCase()));
  const normalizedJob = jobSkills.map((s) => s.toLowerCase());

  const matched = normalizedJob.filter((s) => resumeSet.has(s));
  const score = (matched.length / normalizedJob.length) * 100;

  return Math.round(score);
}

export function matchJobsToResume({
  jobs,
  resume,
}: {
  jobs: (Job & { company?: { name: string } | null })[];
  resume: Resume;
}) {
  return jobs
    .map((job) => {
      const match = calculateRocketScore({
        resumeSkills: resume.skills,
        jobSkills: job.skills,
      });

      return {
        job,
        match,
      };
    })
    .sort((a, b) => b.match - a.match);
}

export function getResumeFeedback({
  resumeSkills,
  jobSkills,
}: {
  resumeSkills: string[];
  jobSkills: string[];
}) {
  const resumeSet = new Set(resumeSkills.map((s) => s.toLowerCase()));
  const normalizedJob = jobSkills.map((s) => s.toLowerCase());

  const matched = normalizedJob.filter((s) => resumeSet.has(s));
  const missing = normalizedJob.filter((s) => !resumeSet.has(s));

  return {
    matched,
    missing,
    suggestions: missing.map(
      (skill) =>
        `Strengthen your resume with a concrete example that demonstrates ${skill} (project, metric, or impact).`
    ),
  };
}


