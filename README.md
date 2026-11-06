# gunnarwrld.com — Personal Portfolio

> The source for [**gunnarwrld.com**](https://gunnarwrld.com) — a single-page React + TypeScript portfolio with motion design, glass UI, and a working contact form backed by a Vercel serverless function.

<p align="center">
  <a href="https://gunnarwrld.com">
    <img src=".github/assets/preview.png" alt="gunnarwrld.com hero screenshot" width="820" />
  </a>
</p>

<p align="center">
  <a href="https://gunnarwrld.com"><img alt="Live site" src="https://img.shields.io/badge/live-gunnarwrld.com-0a0a0a?style=for-the-badge"></a>
  <a href="https://github.com/gunnarwrld/PersonalPortfolio/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/gunnarwrld/PersonalPortfolio/actions/workflows/ci.yml/badge.svg"></a>
  <img alt="React" src="https://img.shields.io/badge/React-18-149ECA?style=for-the-badge&logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
  <img alt="Deployed on Vercel" src="https://img.shields.io/badge/Vercel-deployed-000000?style=for-the-badge&logo=vercel&logoColor=white">
</p>

---

## Highlights

- 🎬 **Motion-first hero** — scroll-linked Framer Motion with parallax, springs, and 3D card reveals.
- 🪟 **Glass UI on a dark grid** — Syne / Inter / JetBrains Mono type stack with a numbered section rhythm (`01 — About`, `02 — Skills`, …).
- 📨 **Real contact form** — React Hook Form + Zod on the client, validated again on a Vercel serverless function that sends mail through [Resend](https://resend.com), with a honeypot and per-IP rate limiting.
- ⚡ **Vite + SWC + TypeScript** — fast dev loop, strict types, ESLint flat config.
- 🧪 **Tested with Vitest + Testing Library + Playwright** for unit and end-to-end coverage.
- ♿ **Accessible by default** — semantic landmarks, labelled controls, focus-visible affordances.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build | Vite 5 (`@vitejs/plugin-react-swc`) |
| Styling | Tailwind CSS 3 + `tailwindcss-animate` + custom design tokens |
| UI primitives | [shadcn/ui](https://ui.shadcn.com) on top of Radix |
| Motion | Framer Motion 12 |
| Forms & validation | React Hook Form + Zod |
| API | Vercel Serverless Functions (Node 20) |
| Email | [Resend](https://resend.com) |
| Hosting | Vercel |
| Testing | Vitest, @testing-library/react, Playwright |

## Project structure

```
.
├── .github/workflows/
│   ├── ci.yml                    # Lint, types, Vitest, build, Playwright
│   ├── sync-github-projects.yml  # Refresh facts and open a review PR
│   └── portfolio-dispatch.yml    # Reusable notifier other repos call
├── api/
│   ├── contact.ts          # Vercel serverless route — validates + sends email via Resend
│   └── og.tsx              # Edge OG image for /api/og (social cards)
├── e2e/
│   └── smoke.spec.ts       # Playwright smoke tests
├── public/                 # Static assets served at the site root
├── scripts/
│   └── sync-github.ts      # Reads the public GitHub API and writes github-sync.json
├── src/
│   ├── components/         # Hero, About, Skills, Projects, Contact, Navbar, …
│   ├── data/
│   │   ├── projects.ts      # Hand-written cards. Set `repo` to link a GitHub project.
│   │   ├── watchedRepos.ts  # Repos the daily sync refreshes
│   │   ├── github-sync.json # Generated GitHub facts. Do not edit by hand.
│   │   └── skills.ts        # Edit me to update the skill matrix
│   ├── hooks/              # Reusable hooks (use-mobile, use-toast)
│   ├── lib/                # Utilities (cn helper, github sync)
│   ├── pages/              # Index + 404
│   ├── test/               # Vitest setup + unit tests
│   ├── App.tsx             # Routes
│   └── main.tsx            # App entry
├── templates/
│   └── notify-portfolio.yml # Copy into another repo's .github/workflows/
├── tailwind.config.ts
├── vite.config.ts
└── playwright.config.ts
```

## Quick start

```bash
git clone https://github.com/gunnarwrld/PersonalPortfolio.git
cd PersonalPortfolio
npm install
cp .env.example .env.local
npm run dev            # http://localhost:8080
```

For local API testing the easiest path is the Vercel CLI, which runs the SPA and the `/api/*` functions side by side:

```bash
npm i -g vercel
vercel dev             # http://localhost:3000
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | ✅ | Server-side API key from [Resend](https://resend.com/api-keys). |
| `CONTACT_TO` | ✅ | Address that receives form submissions, e.g. `ariasgunnar@gmail.com`. |
| `CONTACT_FROM` | optional | Verified sender. Defaults to `Portfolio <onboarding@resend.dev>`. In production, verify a domain on Resend and use, e.g., `Gunnar <contact@gunnarwrld.com>`. |

In Vercel, add these under **Project → Settings → Environment Variables** for the **Production** and **Preview** environments. Locally, copy `.env.example` to `.env.local`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR. |
| `npm run build` | Production build with Vite (no type-check; CI type-checks in a separate job). |
| `npm run typecheck` | TypeScript check of the app and the `api/` functions. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | ESLint over the whole project. |
| `npm test` | Vitest in CI mode. |
| `npm run test:watch` | Vitest in watch mode. |
| `npm run sync:github` | Refresh `src/data/github-sync.json` from the public GitHub API. |

## Contact form architecture

```
Browser ──POST /api/contact──► Vercel func ──► api/contact.ts (Node 20)
                                                  │
                                                  ├── Zod parse + length caps
                                                  ├── Per-IP rate limit (5/min)
                                                  ├── Honeypot check
                                                  └── resend.emails.send → Resend ──► your inbox
```

- Validation runs **twice**: once on the client (`zodResolver` in React Hook Form) for instant UX, once on the server so the route can't be bypassed by curl.
- All user-supplied strings are HTML-escaped before being interpolated into the outgoing email.
- The honeypot field (`website`) is rendered far off-screen with `aria-hidden` and `tabIndex={-1}`. Real users never touch it; bots almost always fill it, and we silently 200 those submissions.

## Deployment

The site auto-deploys from `main` to Vercel. Pushing to a feature branch creates a preview deploy with its own URL. Production domain is `gunnarwrld.com`.

To deploy your own fork:

1. [Import the repo into Vercel](https://vercel.com/new) — framework auto-detected as **Vite**, no overrides needed.
2. Add the three environment variables above.
3. Push to `main`.

## Syncing project facts from GitHub

Pushes to the default branch of a project repo open a pull request here that refreshes GitHub-derived facts. Nothing in this flow pushes to `main`. You merge the PR when the diff looks right.

The sync reads each watched repo from the public API and writes `src/data/github-sync.json`:

- description, topics, and language breakdown
- homepage, default branch, last push, archived flag, and stars

Cards that set `repo` in [`src/data/projects.ts`](src/data/projects.ts) use that file for languages, last push, the live link, the repo link, and the archived flag. Blurbs, feature lists, screenshots, and the order of the cards stay in `projects.ts`. A watched repo with no `repo` field does not get a card. The pull request lists it under **Not on the site yet**.

Watched repos live in [`src/data/watchedRepos.ts`](src/data/watchedRepos.ts). The daily run refreshes that list only. A `repository_dispatch` for one repo updates that repo in the file. The next daily run drops a repo that is not on the list, so add a keeper to `WATCHED_REPOS`.

`repository_dispatch` only starts workflows that are already on the default branch. Merge this setup before you expect notifiers to do anything.

### Workflows

| File | When it runs |
|---|---|
| [`.github/workflows/sync-github-projects.yml`](.github/workflows/sync-github-projects.yml) | `repository_dispatch` type `project-updated`, **Actions → Sync GitHub project facts → Run workflow**, and a daily sweep at 06:17 UTC. |
| [`.github/workflows/portfolio-dispatch.yml`](.github/workflows/portfolio-dispatch.yml) | Called by other repos. Posts the dispatch event. |
| [`templates/notify-portfolio.yml`](templates/notify-portfolio.yml) | The file you copy into a project repo. |

If the generated file matches `main`, the sync workflow stops and does not open a pull request. When something changed, it force-pushes the rolling branch `github-sync` (rebuilt from `main` each run) and opens or updates one PR.

### Token

Create one fine-grained personal access token:

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Resource owner: **gunnarwrld**. Repository access: **Only select repositories → PersonalPortfolio**.
3. Permissions:
   - **Contents: Read and write.** This is the minimum `repository_dispatch` needs. GitHub lists `POST /repos/{owner}/{repo}/dispatches` under Contents write, with no extra permission beside it. **Metadata: Read-only** is selected automatically.
   - **Pull requests: Read and write.** The dispatch call does not need this. Add it so the same token, stored on PersonalPortfolio, can open the review PR. A pull request opened that way runs lint, tests, Playwright, and the Vercel preview. The default `GITHUB_TOKEN` does not start those workflows.
4. Copy the token once. It is a secret. Do not commit it and do not paste it into a workflow file.

Classic tokens can dispatch to a public repository with the **`public_repo`** scope. Prefer the fine-grained token above.

Add the token as an Actions secret named **`PORTFOLIO_DISPATCH_TOKEN`**:

| Repository | Settings → Secrets and variables → Actions | Why |
|---|---|---|
| Each project repo that should notify the site | `PORTFOLIO_DISPATCH_TOKEN` | Sends `project-updated` to this repo. Contents write on PersonalPortfolio is enough here. |
| **PersonalPortfolio** | `PORTFOLIO_DISPATCH_TOKEN` | Pushes `github-sync` and opens the PR as you, so CI runs. Needs Contents write and Pull requests write. |

The sync job reads other repos without this token. Their metadata is public. A token limited to PersonalPortfolio cannot see those repos, so the workflow does not use it for the API read.

### Repository setting

You do **not** have to change Actions permissions if `PORTFOLIO_DISPATCH_TOKEN` is set on PersonalPortfolio.

If that secret is missing, the workflow falls back to `GITHUB_TOKEN`. That path needs:

**PersonalPortfolio → Settings → Actions → General → Workflow permissions → Allow GitHub Actions to create and approve pull requests.**

Leave it off unless you are using the fallback. Pull requests opened with `GITHUB_TOKEN` do not start the workflows in this repo (lint, Vitest, Playwright). Vercel can still build a preview, because that check comes from the Vercel GitHub App.

Do not grant Actions write access to `main`. This workflow never pushes the default branch.

### Notifier for a project repo

Actions has to be enabled on that repo (the default). Copy [`templates/notify-portfolio.yml`](templates/notify-portfolio.yml) to `.github/workflows/notify-portfolio.yml`:

```yaml
name: Notify portfolio

on:
  push:

permissions: {}

jobs:
  dispatch:
    if: github.ref == format('refs/heads/{0}', github.event.repository.default_branch)
    uses: gunnarwrld/PersonalPortfolio/.github/workflows/portfolio-dispatch.yml@main
    secrets:
      PORTFOLIO_DISPATCH_TOKEN: ${{ secrets.PORTFOLIO_DISPATCH_TOKEN }}
```

The `if` limits the job to the repo's default branch, including repos whose default branch is not `main`. Pushes to other branches start the workflow and skip the job.

Then add `PORTFOLIO_DISPATCH_TOKEN` on that repo. To show the project on the site, add a card in `src/data/projects.ts` with `repo` set to `gunnarwrld/<name>`, and add the name to `WATCHED_REPOS` if it is not already there. The sync will not create the card for you.

Run the refresh locally with `npm run sync:github`. `npm run sync:github -- --repo ledger-api` refreshes one repo. Unauthenticated requests are enough for public repos; the script uses `GITHUB_TOKEN` only when it is already set.

## Roadmap

- [x] Dynamic `og:image` via [`api/og.tsx`](api/og.tsx) — the homepage meta tags already point at `/api/og` (1200×630, edge runtime)
- [ ] Per-project case-study pages with screenshots, decisions, and trade-offs
- [ ] `/blog` route with MDX
- [ ] Lighthouse CI in GitHub Actions

## License

MIT © Gunnar Arias — see [LICENSE](./LICENSE).

---

<sub>Built in Sweden 🇸🇪 with too much coffee. Reach me at [ariasgunnar@gmail.com](mailto:ariasgunnar@gmail.com) · [LinkedIn](https://linkedin.com/in/gunnararias) · [GitHub](https://github.com/gunnarwrld).</sub>
