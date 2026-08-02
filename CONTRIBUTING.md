# 🤝 CONTRIBUTING.md — Contribution Guidelines

Thank you for contributing to ALMAS CERAM! Please adhere to these guidelines.

## 📌 Commit Message Format (Conventional Commits)
Please format all git commit messages using Conventional Commits:
- `feat: add new tile texture lightbox viewer`
- `fix: correct UTF-8 BOM encoding on CSV export`
- `docs: update API endpoints in Document.md`
- `style: refine gold border hover effect on ProductCard`
- `refactor: extract useTileCompare custom hook`

## 🌿 Branching Strategy
- `main` — Production branch automatically deployed to Vercel.
- `feat/feature-name` — Feature branches.
- `fix/bug-description` — Bug fix branches.

## ✅ Pre-PR Checklist
- [ ] Run `npm run build` locally to verify TypeScript compilation.
- [ ] Ensure no API secrets or `.env` files are committed.
- [ ] Verify responsive layout on mobile (375px) and desktop.
- [ ] Test multi-language direction (RTL for FA/AR, LTR for EN).
