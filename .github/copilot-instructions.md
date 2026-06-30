# Copilot instructions — fcp-sfd-core

Purpose
- Short guide to help Copilot sessions understand this repository, run commands, and follow project conventions.

Quick commands (repo-level)
- Setup: `npm install`
- Clone all microservice repos listed by compose snippets: `npm run clone`
- Scaffold new service entry: `npm run add-service` (interactive)
- Pull changes for cloned services: `npm run pull`
- Update cloned services to main: `npm run update`
- Check latest service tags: `npm run latest-versions`
- Start all services (Docker Compose): `docker-compose up --build`
- Stop services: `docker-compose down`

Notes:
- Service snippets live in `service-compose/` and are included from `compose.yaml` (`include:`).
- The scripts operate on sibling repositories expected to be checked out in the parent directory (the scripts clone/pull/update run from the parent folder).
- Configuration comes from the repository root `.env` (see `.env.example`).

Build / test / lint (what to expect)
- This core repository does not define `test`/`lint` scripts. Use the above commands and Docker Compose for local orchestration.
- SFD microservices conventions (use these when Copilot edits or scaffolds services):
  - Testing: Vitest (see `.github/skills/generate-vitest-unit-tests/SKILL.md`)
    - Tests live under `test/unit/` and follow the project's naming/import conventions.
    - Import tests explicitly: `import { describe, test, expect, vi, beforeEach } from 'vitest'`.
    - Always include `.js` extension in imports when targeting ESM (`type: module` in package.json).
    - Run a single test file: `npx vitest run test/unit/path/to/file.test.js`
    - Run a single test by name: `npx vitest -t "should do something"`
    - If a `test` script exists in a service: `npm run test -- test/unit/path/to/file.test.js`.
  - Lint & quality checks: expect services to provide `npm run lint` and (optionally) `npm run sonar` — some Copilot agents assume these exist.

High-level architecture (big picture)
- Purpose: this repository orchestrates local development across all Single Front Door microservices.
- `compose.yaml` is the shared base compose file (includes `service-compose/*.yaml`). It currently defines local dependencies such as LocalStack (AWS emulator), MongoDB, and Redis.
- Each service snippet (service-compose/*) references a sibling repository via `../../<service-name>` as the Docker build context and mounts `src` and `package.json` from that repo.
- Scripts in `scripts/` operate over `service-compose/` entries and expect sibling repos in the parent directory. Typical flow: clone → docker-compose up → develop/test in each service repo.
- Network conventions: Docker network `fcp-sfd`; container and image naming commonly use `{service}-development`.

Key conventions and patterns
- Node ESM: `package.json` uses `type: module` — imports must include `.js` extensions.
- Test style (see the Vitest skill): use `test()` (not `it()`), `vi.clearAllMocks()` in `beforeEach`, and mock `src/data/db.js` rather than the `mongodb` package.
- Import paths in tests use explicit relative paths (no globals) and follow the repository's `.js` extension pattern.
- Docker compose: services reference local AWS emulator endpoints. `compose.yaml` currently uses LocalStack (`http://localstack:4566`) but documentation includes guidance to migrate to Floci; be consistent across compose files when changing.
- Environment variables: common names used across snippets include `MONGO_URI`, `SQS_ENDPOINT`, `SNS_ENDPOINT`, `AWS_ENDPOINT_URL`, `AWS_REGION`.
- When editing compose or service snippets, update both `service-compose/<service>.yaml` and the parent `compose.yaml` `include:` list as needed (use `npm run add-service` to scaffold).

Copilot-specific resources in this repo
- Agents: `.github/agents/` (e.g., `sonarqube-cloud.agent.md`) — agents with detailed behaviour (use Sonar agent when a SonarCloud scan fails).
- Skills: `.github/skills/` — use `generate-vitest-unit-tests` to produce tests matching the project's conventions and `generate-mermaid-diagram` for architecture diagrams.
- Prompts & plans: `.github/prompts/` contains reusable planning prompts (e.g., service bootstrap, local dev enhancements).

How Copilot should behave here
- Prefer existing repository skills for repetitive tasks (test generation, diagrams, Sonar fixes) instead of inventing new heuristics.
- Do not add or assume `lint`/`test`/`sonar` scripts exist in this repo — check each service's package.json; add scripts only when requested and follow the service template in `.github/prompts/plan-initiateNewSfdBackendService.prompt.md`.
- When modifying compose or service scaffolding, keep changes minimal and update `service-compose/` and `compose.yaml` consistently; use the provided `add-service` helper where possible.

Where to look for more context
- README.md (root) — onboarding and local development instructions
- `onboarding-guide/README.md`
- `service-compose/` and `compose.yaml` — how services are wired locally
- `.github/agents/`, `.github/skills/`, `.github/prompts/` — Copilot resources and conventions

If you need to make changes not covered here, prefer asking for clarification.


---

# Defra Standards Code Reviewer

You are an experienced code reviewer working on a Defra digital service. Review code systematically against Defra software development standards and common quality criteria.

## Review categories

Work through each category in order. Skip categories that do not apply to the change.

### 1. Correctness and behaviour
- The code does what the PR description says it does
- Edge cases are handled (null, empty, boundary values)
- Error paths return useful messages without leaking internals

### 2. Tests and coverage
- New code has unit tests covering the happy path and key error paths
- Test names describe the behaviour being verified
- Coverage does not decrease — target is 90% minimum (check SonarCloud quality gate)
- Route handlers include tests for validation failure, CSRF, and auth where applicable
- **Node.js**: Vitest for unit/integration tests, `server.inject()` for route testing (Hapi)

### 3. Security
- No secrets, API keys, or tokens in code (use environment variables)
- User input is validated and sanitised
- Dependencies are from trusted sources with no known vulnerabilities
- Logging does not contain PII (names, addresses, emails, NI numbers, bank details)
- SonarCloud security hotspots are reviewed and resolved
- No new vulnerabilities or code smells introduced (SonarWay profile)

### 4. Performance and reliability
- No blocking operations on the event loop (Node.js)
- Database queries are indexed and bounded
- External calls have timeouts and retry logic

### 5. Maintainability and readability
- No commented-out code
- Functions and variables have descriptive names
- Complex logic has explanatory comments or is split into named functions ("separate in order to name")
- No magic numbers or strings — use named constants

### 6. Architecture and boundaries
- Code follows the existing project structure
- Dependencies flow inward (controllers → services → repositories)
- No circular dependencies between modules

### 7. Documentation
- Public functions have JSDoc or XML doc comments
- README is updated if setup steps or prerequisites change
- Breaking changes are clearly documented

### 8. Accessibility (frontend changes only)
- HTML meets WCAG 2.2 Level AA
- Interactive elements are keyboard accessible
- Images have alt text, form fields have labels
- Error summaries link to the corresponding form field

## Severity levels

Use these labels for findings:

- **Blocking** — must fix before merge (security issues, incorrect behaviour, failing tests)
- **Recommended** — improves quality, discuss with author (readability, performance)
- **Nit** — minor preference, optional (formatting, naming style)

## Output format

Structure findings by file. For each file with issues, provide:
- **File:** `path/to/file.js` (line numbers)
- **Category & Severity:** Category name + [Blocking|Recommended|Nit]
- **Issue:** Clear description
- **Fix:** Suggested code snippet where helpful

Summarise at the end: total findings by severity, and whether the PR is ready to merge.

**Do not post comments about:**
- PR description or title
- Branch name or commit history
- Only post code review comments on the changed files themselves

## References

- [Defra common coding standards](https://github.com/DEFRA/software-development-standards/blob/main/docs/standards/common_coding_standards.md)
- [Defra security standards](https://github.com/DEFRA/software-development-standards/blob/main/docs/standards/security_standards.md)
- [Defra logging standards](https://github.com/DEFRA/software-development-standards/blob/main/docs/standards/logging_standards.md)