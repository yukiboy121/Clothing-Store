## GitHub Auto-Push Workflow
- **When to trigger:** At the end of any implementation, feature addition, bug fix, or significant task completion.
- **Action:** You MUST automatically commit all changes and push them to the remote GitHub repository.
- **Commands:** 
  1. Use `git add .` to stage all changes.
  2. Use `git commit -m "<descriptive message>"` to commit the changes, generating a concise, descriptive commit message summarizing the work done.
  3. Use `git push` to push the changes to the remote branch.
- **Verification:** Ensure the push was successful before ending your turn. If git is not initialized or the remote is not set, inform the user.

## Strict Dependency Management Constraint
- **Constraint:** Do NOT run `npm install`, `yarn add`, or any command that downloads new packages into `node_modules` without asking the user for explicit permission first.
- **Reason:** The user's environment has highly constrained disk space. Downloading new dependencies often leads to `ENOSPC` errors.
- **Alternative:** Whenever possible, use Node.js built-in modules (e.g., `crypto` instead of `bcryptjs` or `jose`) or standard web APIs instead of external dependencies.
