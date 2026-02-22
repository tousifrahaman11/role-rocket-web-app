// @ts-ignore
import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || "alerts@rolerocket.app";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return transporter;
}

export async function sendJobAlertEmail(params: {
  to: string;
  jobTitle: string;
  companyName: string;
  jobId: string;
}) {
  const t = getTransporter();
  if (!t) {
    console.warn("SMTP is not configured; skipping email send.");
    return;
  }

  const url = `${process.env.APP_BASE_URL || "http://localhost:3000"}/jobs/${params.jobId}`;

  await t.sendMail({
    from: SMTP_FROM,
    to: params.to,
    subject: `New RoleRocket match: ${params.jobTitle} at ${params.companyName}`,
    html: `
      <p>You have a new job match on <strong>RoleRocket</strong>.</p>
      <p>
        <strong>${params.jobTitle}</strong> at <strong>${params.companyName}</strong>
      </p>
      <p>
        View details and apply here:
        <a href="${url}">${url}</a>
      </p>
    `,
  });
}

