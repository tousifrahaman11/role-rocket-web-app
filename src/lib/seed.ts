import { prisma } from "./prisma";
import { Role } from "@prisma/client";

export async function seedJobsIfEmpty() {
  const count = await prisma.job.count();
  if (count > 0) return;

  console.log("Seeding 10 jobs...");

  let company = await prisma.company.findFirst({
    where: { name: "RoleRocket Labs" },
  });

  if (!company) {
    company = await prisma.company.create({
      data: {
        name: "RoleRocket Labs",
        description: "Launching careers into orbit with the best roles.",
        location: "San Francisco, CA",
        website: "https://rolerocket.com",
      },
    });
  }

  // Create an employer user to own the jobs, if needed, though company relation is enough for job
  const employerEmail = "employer@rolerocket.com";
  let employer = await prisma.user.findUnique({
    where: { email: employerEmail },
  });

  if (!employer) {
    employer = await prisma.user.create({
      data: {
        email: employerEmail,
        passwordHash: "seed", // dummy
        name: "RoleRocket Employer",
        role: Role.EMPLOYER,
        companyId: company.id,
      },
    });
  }

  const jobsData = [
    {
      title: "Frontend Engineer Intern",
      description: "Join our core team to build responsive and performant web interfaces using React and Next.js.",
      location: "Remote",
      salaryMin: 40000,
      salaryMax: 60000,
      jobType: "INTERNSHIP",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      title: "Senior Full Stack Developer",
      description: "Looking for an experienced engineer to lead our product development across the stack.",
      location: "San Francisco, CA",
      salaryMin: 140000,
      salaryMax: 180000,
      jobType: "FULL_TIME",
      skills: ["Node.js", "React", "PostgreSQL", "AWS", "TypeScript"],
    },
    {
      title: "Backend SWE Intern",
      description: "Help scale our API platform. You'll work with Node.js, databases, and message queues.",
      location: "New York, NY",
      salaryMin: 50000,
      salaryMax: 70000,
      jobType: "INTERNSHIP",
      skills: ["Node.js", "Express", "PostgreSQL", "API"],
    },
    {
      title: "DevOps Engineer",
      description: "Manage and improve our cloud infrastructure, CI/CD pipelines, and monitoring systems.",
      location: "Remote",
      salaryMin: 120000,
      salaryMax: 160000,
      jobType: "FULL_TIME",
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
    },
    {
      title: "Product Manager",
      description: "Drive product strategy and execution for our core enterprise offerings.",
      location: "London, UK",
      salaryMin: 110000,
      salaryMax: 150000,
      jobType: "FULL_TIME",
      skills: ["Product Management", "Agile", "Scrum", "Data Analysis"],
    },
    {
      title: "Data Scientist Intern",
      description: "Analyze large datasets to extract actionable insights and build predictive models.",
      location: "Remote",
      salaryMin: 45000,
      salaryMax: 65000,
      jobType: "INTERNSHIP",
      skills: ["Python", "SQL", "Machine Learning", "Data Analysis"],
    },
    {
      title: "React Native Developer",
      description: "Build beautiful and fast mobile applications for iOS and Android.",
      location: "Berlin, Germany",
      salaryMin: 90000,
      salaryMax: 130000,
      jobType: "FULL_TIME",
      skills: ["React Native", "JavaScript", "TypeScript", "Mobile"],
    },
    {
      title: "Cloud Architect",
      description: "Design and implement scalable, resilient cloud architectures for our enterprise clients.",
      location: "Remote",
      salaryMin: 160000,
      salaryMax: 200000,
      jobType: "FULL_TIME",
      skills: ["AWS", "Azure", "GCP", "Architecture", "Kubernetes"],
    },
    {
      title: "UX/UI Designer Intern",
      description: "Create intuitive and engaging user experiences for our web platform.",
      location: "San Francisco, CA",
      salaryMin: 40000,
      salaryMax: 55000,
      jobType: "INTERNSHIP",
      skills: ["Figma", "UI Design", "UX Research", "Prototyping"],
    },
    {
      title: "QA Automation Engineer",
      description: "Develop automated test suites to ensure the quality and reliability of our applications.",
      location: "Remote",
      salaryMin: 80000,
      salaryMax: 110000,
      jobType: "FULL_TIME",
      skills: ["Testing", "Jest", "Cypress", "Automation"],
    },
  ];

  for (const job of jobsData) {
    await prisma.job.create({
      data: {
        ...job,
        companyId: company.id,
        analytics: {
          create: {}, // Also create JobAnalytics row
        },
      },
    });
  }

  console.log("Successfully seeded 10 jobs.");
}
