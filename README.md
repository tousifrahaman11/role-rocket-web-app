RoleRocket is a modern, animated SaaS job board and career platform built with:

- Next.js App Router (TypeScript)
- PostgreSQL + Prisma
- Tailwind CSS
- Framer Motion
- Recharts

It includes candidate, employer, and admin dashboards, RocketScore ATS scoring, RoleMatch AI-style job matching, Rocket Alerts, and analytics.

### 1. Local setup

```bash
cd role-rocket
npm install

# Run Prisma migrations (after setting DATABASE_URL)
npx prisma migrate dev --name init

npm run dev
```

App runs at `http://localhost:3000`.

### 2. Environment variables

Create a `.env` file in the project root (a template exists as `.env.example`):

```bash
DATABASE_URL="postgresql://user:password@host:5432/rolerocket?schema=public"
JWT_SECRET="a-strong-random-secret"
APP_BASE_URL="http://localhost:3000"

# Cloudinary (resume storage)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# SMTP for Rocket Alerts email
SMTP_HOST="smtp.yourprovider.com"
SMTP_PORT="587"
SMTP_USER="username"
SMTP_PASS="password"
SMTP_FROM="alerts@rolerocket.app"
```

For production (Vercel + Neon/Supabase), set the same keys in the Vercel dashboard and use the Neon/Supabase connection string for `DATABASE_URL`.

**Registration fails with "Something went wrong"?** You need a working PostgreSQL database:

- **Free cloud DB (recommended):** Sign up at [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com), create a project, copy the connection string into `DATABASE_URL` in `.env`, then run `npx prisma migrate dev --name init`.
- **Local PostgreSQL:** Ensure PostgreSQL is running and `DATABASE_URL` has the correct user/password. Create a database named `rolerocket` (or adjust the URL), then run `npx prisma migrate dev --name init`.

### 3. Database & Prisma

- Schema lives in `prisma/schema.prisma` with `User`, `Company`, `Job`, `Resume`, `Application`, `SavedJob`, `JobAlertSubscription`, and `JobAnalytics`.
- Run:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Use Neon or Supabase PostgreSQL in production.

### 4. Deployment

- **Frontend + API**: Deploy this Next.js app directly to Vercel.
- **Database**: Create a PostgreSQL database on Neon or Supabase and set `DATABASE_URL`.
- **Cloudinary**: Create a Cloudinary account and configure the three Cloudinary env vars.
- **SMTP**: Point `SMTP_*` to your provider (e.g. Resend SMTP, SendGrid, Mailgun, or a transactional SMTP).

After env vars are set on Vercel:

```bash
npx prisma migrate deploy
```

### 5. Features checklist

- Role-based auth (candidate, employer, admin) with JWT in HttpOnly cookies.
- Candidate dashboard: resume upload + PDF parsing, RocketScore ATS scoring, RoleMatch-style job matching, saved jobs, applications, Rocket Alerts.
- Employer dashboard: job posting, applicants list, Mission Control analytics charts (applications per job, funnel overview).
- Admin dashboard: manage users, companies, jobs, and remove fake jobs.
- Animated, responsive UI with dark/light mode, page transitions, hover states, and micro-interactions using Framer Motion.
