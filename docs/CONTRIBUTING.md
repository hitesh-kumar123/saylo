## Contributing to SayLO

Thanks for your interest in contributing! This document contains minimal, practical guidelines to help you open a clean pull request.

1. Fork the repository and create a feature branch

```powershell
git checkout -b feature/short-description
```

2. Keep changes small and focused

- One logical change per PR. Small PRs are reviewed faster.

3. Run tests and linters locally

```powershell
npm install
npm test
npm run lint
```

4. Write tests for new behavior

- Add unit tests under `test/` using Vitest and Testing Library.

5. Update documentation

- If your change affects usage, add or update README or files in `docs/`.

6. Commit and push

```powershell
git add .
git commit -m "feat: short description"
git push origin feature/short-description
```

7. Open a Pull Request

- Use a descriptive title and include a short description and screenshots (if applicable).
- List any migration steps or important notes for reviewers.

Code style & PR checklist
- Follow TypeScript and React best practices.
- Add/modify tests for new or changed behavior.
- Ensure linting passes (`npm run lint`).
- Use meaningful commit messages (conventional commits recommended).

Review process
- Expect at least one review. Address review comments by pushing commits to the same branch.

Thank you — your contributions make SayLO better!
