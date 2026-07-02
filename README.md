# NascentAI

<p align="center">
  <img src="../nascent-fe/public/og-image.png" alt="Nascent Banner" width="100%">
</p>

<h3 align="center">
Modern Interface for the Autonomous AI Software Engineering Agent
</h3>

<p align="center">
A sleek, responsive frontend for Nascent that enables developers to connect GitHub, manage repositories, interact with the AI agent, review generated plans, inspect Git diffs, and track Pull Requests—all from a single interface.
</p>

<p align="center">
  <a href="https://nascentai.vercel.app/">🌐 Live Demo</a>
  ·
  <a href="https://github.com/shaurya-afk/nascent">⚙️ Backend</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript">
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss">
  <img src="https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge">
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge">
  <img src="https://img.shields.io/badge/MIT-License-success?style=for-the-badge">
</p>

---

# Overview

Nascent Frontend is the user interface for interacting with the autonomous software engineering agent.

Instead of relying on terminals or CLI tools, developers can authenticate with GitHub, manage repositories, submit engineering tasks, review implementation plans, inspect generated Git diffs, and approve changes before they're committed.

The application is designed around a clean, modern developer experience while remaining tightly integrated with the backend agent workflow.

---


```
Login
   │
   ▼
Connect GitHub
   │
   ▼
Select Repository
   │
   ▼
Describe Task
   │
   ▼
Review Plan
   │
   ▼
Approve
   │
   ▼
View Generated Diff
   │
   ▼
Approve Changes
   │
   ▼
Pull Request Created
```

---

# Features

| Capability | Status |
|------------|:------:|
| Modern Landing Page | ✅ |
| GitHub OAuth Authentication | ✅ |
| Repository Dashboard | ✅ |
| Repository Selection | ✅ |
| AI Task Submission | ✅ |
| Live Agent Workflow | ✅ |
| Plan Review UI | ✅ |
| Git Diff Viewer | ✅ |
| Pull Request Status | ✅ |
| Responsive Design | ✅ |
| Dark Theme | ✅ |
| Smooth Animations | ✅ |
| Real-time Streaming | 🚧 |
| Team Dashboard | 🚧 |

---

# Pages

## Landing Page

A modern landing page introducing Nascent with:

- Hero section
- Feature highlights
- Workflow overview
- Product vision
- Responsive design

---

## Authentication

Secure authentication using GitHub OAuth.

Users can:

- Sign in with GitHub
- Connect repositories
- Manage access

---

## Dashboard

After authentication, users can:

- View connected repositories
- Start new engineering tasks
- Track agent executions
- Review previous Pull Requests

---

## Task Workflow

Developers submit prompts such as:

```
Implement OAuth Login

Fix API authentication

Add Redis caching

Optimize SQL queries
```

The frontend communicates with the backend agent and displays every stage of execution.

---

## Plan Approval

Before any code is generated, the implementation plan is displayed for review.

Example:

```
✓ Analyze repository

✓ Identify affected files

✓ Create implementation strategy

Waiting for approval...
```

---

## Git Diff Viewer

Generated code changes are presented as Git diffs before execution.

```
+ Added OAuth callback

+ Updated middleware

+ Created authentication service

Proceed?

[Y/N]
```

---

## Pull Request Tracking

Once approved, the frontend displays:

- Branch name
- Commit status
- Push progress
- Pull Request link
- Execution summary

---

# Workflow

```text
Login
   │
   ▼
GitHub OAuth
   │
   ▼
Repository Selection
   │
   ▼
Task Submission
   │
   ▼
Planning
   │
   ▼
Approval
   │
   ▼
Live Agent Progress
   │
   ▼
Git Diff
   │
   ▼
Approval
   │
   ▼
Pull Request Created
```

---

# Tech Stack

| Category | Technologies |
|-----------|--------------|
| Framework | Next.js |
| Language | TypeScript |
| UI | React |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Animation | Framer Motion |
| Icons | Lucide React |
| Authentication | GitHub OAuth |
| API Communication | Fetch API |
| Deployment | Vercel |

---

# Project Structure

```
src/

├── app/
├── components/
├── hooks/
├── lib/
├── services/
├── types/
├── utils/
└── styles/
```

---

# Getting Started

## Clone Repository

```bash
git clone https://github.com/shaurya-afk/nascentai.git

cd nascentai
```

---

## Install Dependencies

```bash
npm install
```

or

```bash
pnpm install
```

---

## Configure Environment Variables

Create a `.env.local` file.

```env
NEXT_PUBLIC_API_URL=

NEXT_PUBLIC_GITHUB_CLIENT_ID=
```

---

## Run Development Server

```bash
npm run dev
```

or

```bash
pnpm dev
```

Open:

```
http://localhost:3000
```

---

# Current Capabilities

- Responsive Landing Page
- GitHub OAuth
- Repository Dashboard
- Task Submission
- Planning Interface
- Human Approval Flow
- Git Diff Viewer
- Pull Request Tracking
- Backend Integration

---

# Roadmap

## Completed

- [x] Landing page
- [x] GitHub authentication
- [x] Repository dashboard
- [x] AI workflow UI
- [x] Git diff interface
- [x] Pull Request tracking

## In Progress

- [ ] Streaming execution updates
- [ ] Repository search
- [ ] Better execution logs
- [ ] Enhanced dashboard
- [ ] Notifications

## Planned

- [ ] Team workspaces
- [ ] Repository analytics
- [ ] VS Code integration
- [ ] Mobile responsive improvements
- [ ] Command palette
- [ ] Settings dashboard

---

# Why Nascent Frontend?

| Traditional Developer UI | Nascent Frontend |
|--------------------------|------------------|
| Multiple disconnected tools | Unified workflow |
| Manual Git operations | Guided automation |
| Terminal-heavy workflow | Clean visual interface |
| Static status updates | Live execution tracking |
| Minimal context | Repository-aware interactions |
| Manual Pull Request flow | End-to-end AI-assisted workflow |

---

<!-- # Screenshots

> Coming Soon

- Landing Page
- Dashboard
- Repository Selection
- Planning Interface
- Git Diff Viewer
- Pull Request Summary -->

---

# Contributing

Contributions are welcome.

```text
Fork the repository

↓

Create a feature branch

↓

Commit your changes

↓

Push your branch

↓

Open a Pull Request
```

---

# License

Licensed under the MIT License.

See the `LICENSE` file for more information.

---

# Author

**Shaurya Sharma**

- Portfolio: https://shauryasha.com
- GitHub: https://github.com/shaurya-afk
- LinkedIn: https://linkedin.com/in/shaurya-afk

---

<p align="center">
Built to make autonomous software engineering accessible through a modern developer experience.
</p>