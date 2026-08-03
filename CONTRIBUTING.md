# 🤝 CONTRIBUTING.md — Contribution Guidelines

Thank you for contributing to ALMAS CERAM! Please adhere to these guidelines.

## 📌 Commit Message Format (Conventional Commits)
Please format all git commit messages using Conventional Commits:
- `feat: add new tile texture lightbox viewer`
- `fix: correct UTF-8 BOM encoding on CSV export`
- `docs: update API endpoints in Document.md`
- `style: refine gold border hover effect on ProductCard`
- `refactor: extract useTileCompare custom hook`
- `chore: update luxury UI components`

## 🌿 Branching Strategy
- `main` — Production branch automatically deployed to Vercel.
- `feat/feature-name` — Feature branches.
- `fix/bug-description` — Bug fix branches.
- `design/luxury-update` — Design system and UI improvements.

## ✅ Pre-PR Checklist
- [ ] Run `npm run build` locally to verify TypeScript compilation.
- [ ] Ensure no API secrets or `.env` files are committed.
- [ ] Verify responsive layout on mobile (375px) and desktop.
- [ ] Test multi-language direction (RTL for FA/AR, LTR for EN).
- [ ] Check accessibility (keyboard navigation, contrast ratios).
- [ ] Verify luxury UI components are used consistently.
- [ ] Test animations with `prefers-reduced-motion` enabled.

## 🎨 Design System Guidelines
When contributing to the UI:
1. Use existing luxury components from `src/components/ui/`
2. Follow the color palette in `design.md` (Dark Slate + Almas Gold)
3. Maintain smooth transitions (300-700ms duration)
4. Respect RTL/LTR directionality for all text elements
5. Test glass morphism effects on various backgrounds

## 📚 Documentation Updates
When adding new features:
- Update `README.md` with new sections or capabilities
- Add component documentation to `design.md`
- Update `ARCHITECTURE.md` for structural changes
- Reflect changes in `SUMMARY.md`
