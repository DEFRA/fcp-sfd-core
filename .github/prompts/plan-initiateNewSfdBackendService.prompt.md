# Plan: Initiate New Single Front Door (fcp-sfd) Backend Service

Set up a new `fcp-sfd` backend project from the CDP (Core Delivery Platform) Node.js Backend Template. This plan covers: GitHub workflows, test structure, pre-commit hooks, Docker Compose, npm scripts, VS Code tasks, ESLint/Vitest config, and README — all aligned with the SFD team conventions and wider FCP standards.

**Service name**: Derive automatically from the project directory name (e.g. `fcp-sfd-comms`, `fcp-sfd-frontend`). All references to `{service-name}` below should be replaced with this value at execution time.

---

## Phase 1: Clean Up Template Tooling (Prettier, Babel, Husky, .vite)

The CDP template ships with Prettier, Babel, and Husky. These are not used by fcp-sfd projects and should be removed.

1. Delete Prettier config files if they exist: `.prettierrc.js` (or any `.prettier*`), `.prettierignore`
2. Delete Babel config if it exists: `babel.config.cjs`
3. Delete `.husky/` directory if it exists
4. Delete `.vite/` directory if it exists
5. In `package.json`, remove from `devDependencies` (if present): `prettier`, `@babel/core`, `@babel/preset-env`, `husky`, `autoprefixer`, `npm-run-all`
6. In `package.json`, remove any leftover template scripts (if present): `format`, `format:check`, `git:pre-commit-hook`, `postinstall`, `setup:husky`, `security-audit`, `server:debug`, `server:watch`, `dev`, `dev:debug`, `docker:dev`

---

## Phase 2: Restructure Tests & Remove Example Files

Tests must live in a dedicated `test/` directory (not alongside source in `src/`), following the [Microservice test approach and repository structure](https://eaflood.atlassian.net/wiki/spaces/FPS/pages/1845396477/Microservice+test+approach+and+repository+structure). Test subfolders should be **flat** — do not mirror `src/` structure. File names should make it clear which module they relate to (e.g. `helpers-fail-action.test.js`).

6. Create directory structure: `test/unit/`
7. Move all `.test.js` files from `src/` into `test/unit/` using flat naming:
   - Derive the test file name from the module path. For example:
     - `src/common/helpers/fail-action.test.js` → `test/unit/helpers-fail-action.test.js`
     - `src/common/helpers/proxy/setup-proxy.test.js` → `test/unit/helpers-setup-proxy.test.js`
     - `src/common/helpers/convict/validate-mongo-uri.test.js` → `test/unit/convict-validate-mongo-uri.test.js`
8. Update import paths in each moved test file so they resolve to `../../src/...` and ensure tests import test functions or test case definitions where needed e.g. `describe`, `test`, `expect`, `beforeAll`, `afterEach` etc.
9. Delete all example/template files from `src/`: any file with `example` in the name (e.g. `src/example-find.js`, `src/routes/example.js`)
10. Update `src/plugins/router.js` to remove any example route imports/registrations
11. Update `sonar-project.properties`:
    - `sonar.tests=test/`
    - `sonar.test.inclusions=test/**/*.test.js`
    - Remove `sonar.exclusions` for test files in `src/` (no longer needed)

---

## Phase 3: Docker Compose & Environment Setup

Standardise Docker Compose to use `.yaml` extension, the `fcp-sfd` network name, and a root `.env` file. Use `compose.yaml` as the shared base and `compose.override.yaml` for local development overrides (ports and bind mounts), following the same pattern as the `fcp-sfd-object-processor` example.

12. Rename `compose.yml` → `compose.yaml` (if `.yml` extension exists)
13. Edit `compose.yaml`:
    - Remove any commented-out frontend service block
    - Remove `redis` service (not used)
    - Rename network from `cdp-tenant` to `fcp-sfd`
    - Remove all `env_file` references from `compose/aws.env` so that Docker Compose uses the default `.env` in the project's root
    ```
    services:
      govuk-notify-universal-comms:
        build:
          target: development
        image: govuk-notify-universal-comms-development
        container_name: govuk-notify-universal-comms-development
        depends_on:
          localstack:
            condition: service_healthy
          mongodb:
            condition: service_started
        environment:
          PORT: 3001
          NODE_ENV: development
          LOCALSTACK_ENDPOINT: http://localstack:4566
          MONGO_URI: mongodb://mongodb:27017/
          AWS_REGION: eu-west-2
          AWS_DEFAULT_REGION: eu-west-2
          AWS_ACCESS_KEY_ID: test
          AWS_SECRET_ACCESS_KEY: test
        volumes:
          - ./src:/home/node/src
          - ./package.json:/home/node/package.json
        networks:
          - fcp-sfd

      localstack:
        image: localstack/localstack:3.0.2
        ports:
          - '4566:4566' # LocalStack Gateway
          - '4510-4559:4510-4559' # external services port range
        environment:
          DEBUG: ${DEBUG:-1}
          LS_LOG: WARN # Localstack DEBUG Level
          SERVICES: s3,sqs,sns,firehose
          LOCALSTACK_HOST: 127.0.0.1
        volumes:
          - '${TMPDIR:-/tmp}/localstack:/var/lib/localstack'
          - ./compose/start-localstack.sh:/etc/localstack/init/ready.d/start-localstack.sh
        healthcheck:
          test: ['CMD', 'curl', 'localhost:4566']
          interval: 5s
          start_period: 5s
          retries: 3
        networks:
          - fcp-sfd

      mongodb:
        image: mongo:6.0.13
        networks:
          - fcp-sfd
        ports:
          - '27017:27017'
        volumes:
          - mongodb-data:/data
        restart: always

    volumes:
      mongodb-data:

    networks:
      fcp-sfd:
        driver: bridge
        name: fcp-sfd
    ```
  - Keep `compose.yaml` as shared/base configuration and avoid local-only host port mappings and source bind mounts where possible
  - Move local development ports and bind mounts to `compose.override.yaml`:
    ```
    services:
      {service-name}:
        ports:
          - "3001:3001"
          - "9229:9229"
        volumes:
          - ./src:/home/node/src
          - ./package.json:/home/node/package.json
        networks:
          - fcp-sfd

      localstack:
        ports:
          - '4566:4566' # LocalStack Gateway
          - '4510-4559:4510-4559' # external services port range
        volumes:
          - '${TMPDIR:-/tmp}/localstack:/var/lib/localstack'
          - ./compose/start-localstack.sh:/etc/localstack/init/ready.d/start-localstack.sh
      mongodb:
        ports:
          - '27017:27017'
        networks:
          - fcp-sfd
        volumes:
          - mongodb-data:/data

    networks:
      fcp-sfd:
        driver: bridge
        name: fcp-sfd
    ```
14. Delete `compose/aws.env` (values move to root `.env`)
15. Create `.env` at project root with only values that cannot have a default set in the Docker Compose configuration:
    ```
    SONAR_TOKEN=your-personal-sonar-token
    ```
16. Create `.env.example` with the same keys (for committed reference — `.env` is gitignored)
17. Create `compose.test.yaml`:
    ```yaml
    services:
      {service-name}:
        build:
          target: development
        image: {service-name}-development
        container_name: {service-name}-test
        command: npm test
        volumes:
          - ./test:/home/node/test
          - ./coverage:/home/node/coverage
    ```
18. Create `compose.test.watch.yaml`:
    ```yaml
    services:
      {service-name}:
        command: npm run test:watch
    ```
19. Create `compose.debug.yaml`:
    ```yaml
    services:
      {service-name}:
        command: npm run start:debug
    ```
19a. Create `compose.override.yaml` for local development overrides:
    ```yaml
    services:
      {service-name}:
        ports:
          - '3001:3001'
          - '9242:9229'
        networks:
          - fcp-sfd
        volumes:
          - ./src:/home/node/src
          - ./package.json:/home/node/package.json

      localstack:
        ports:
          - '4566:4566' # LocalStack Gateway
          - '4510-4559:4510-4559' # external services port range
        volumes:
          - '${TMPDIR:-/tmp}/localstack:/var/lib/localstack'
          - ./compose/start-localstack.sh:/etc/localstack/init/ready.d/start-localstack.sh

      mongodb:
        ports:
          - '27017:27017'
        networks:
          - fcp-sfd
        volumes:
          - mongodb-data:/data

    volumes:
      mongodb-data:

    networks:
      fcp-sfd:
        driver: bridge
        name: fcp-sfd
    ```
20. Replace the Dockerfile with the fcp-sfd standard Dockerfile:
    ```dockerfile
    # development
    ARG PARENT_VERSION=latest-24
    ARG PORT=3001
    ARG PORT_DEBUG=9229

    FROM defradigital/node-development:${PARENT_VERSION} AS development
    ARG PARENT_VERSION
    LABEL uk.gov.defra.ffc.parent-image=defradigital/node-development:${PARENT_VERSION}

    ARG PORT
    ARG PORT_DEBUG
    ENV PORT=${PORT}
    EXPOSE ${PORT} ${PORT_DEBUG}

    COPY --chown=node:node package*.json .
    RUN npm install
    COPY --chown=node:node . .

    CMD [ "npm", "run", "start:watch" ]

    # production
    FROM defradigital/node:${PARENT_VERSION} AS production
    ARG PARENT_VERSION
    LABEL uk.gov.defra.ffc.parent-image=defradigital/node:${PARENT_VERSION}

    # Add curl to template.
    # CDP PLATFORM HEALTHCHECK REQUIREMENT
    USER root
    RUN apk add --no-cache curl
    USER node

    COPY --from=development /home/node/package*.json .
    COPY --from=development /home/node/src ./src/

    RUN npm ci --omit=dev

    ARG PORT
    ENV PORT=${PORT}
    EXPOSE ${PORT}

    CMD [ "node", "." ]
    ```

---

## Phase 4: GitHub Workflows & Agents

Set up CI/CD workflows and a GitHub Copilot agent for SonarQube Cloud.

21. Rename all workflow files from `.yml` → `.yaml`
22. Set `check-pull-request.yaml` to the following content exactly (replacing `{service-name}` with the derived service name):
    ```yaml
    name: Check Pull Request

    on:
      pull_request:
        branches:
          - main
        types:
          - opened
          - edited
          - reopened
          - synchronize
          - ready_for_review

      workflow_dispatch:

    jobs:
      pr-validator:
        name: Run Pull Request Checks
        runs-on: ubuntu-latest
        steps:
          - name: Checkout code
            uses: actions/checkout@v4
            with:
              fetch-depth: 0 # Full history required for SonarCloud to detect changes

          - name: Test code and Create Test Coverage Reports
            uses: actions/setup-node@v4
            with:
              node-version: 24
              cache: npm
          - run: |
              npm ci

          - name: Build Docker Image
            run: |
              set +e
              docker build --no-cache --tag {service-name} .
              exit $?

          - name: Run Tests
            run: |
              mkdir -p coverage
              chmod -R a+rw ./coverage
              docker compose -f compose.yaml -f compose.test.yaml run --build --rm '{service-name}'

          - name: Verify Coverage Generation
            run: |
              if [ ! -f "./coverage/lcov.info" ]; then
                echo "WARNING: Coverage file not found at ./coverage/lcov.info"
                ls -la ./coverage/ || echo "Coverage directory does not exist"
              else
                echo "Coverage file found: $(wc -l < ./coverage/lcov.info) lines"
              fi

          - name: SonarQubeScan
            uses: SonarSource/sonarqube-scan-action@v7
            env:
              SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
              GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
              SONAR_SCANNER_OPTS: "-Dsonar.verbose=true"
    ```
23. Set `publish.yaml` to the following content exactly (replacing `{service-name}` with the derived service name):
    ```yaml
    name: Publish

    on:
      push:
        branches:
          - main
      workflow_dispatch:

    permissions:
      id-token: write
      contents: write
      pull-requests: write

    env:
      AWS_REGION: eu-west-2
      AWS_ACCOUNT_ID: "094954420758"

    jobs:
      build:
        if: github.run_number != 1
        name: CDP-build-workflow
        runs-on: ubuntu-latest
        steps:
          - name: Check out code
            uses: actions/checkout@v4

          - name: Create Test Coverage Reports
            run: |
              npm ci
          - name: Run Tests
            run: |
              mkdir -p coverage
              chmod -R a+rw ./coverage
              docker compose -f compose.yaml -f compose.test.yaml run --build --rm '{service-name}'

          - name: SonarQubeScan
            uses: SonarSource/sonarqube-scan-action@v7
            env:
              SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

          - name: Build and Publish
            uses: DEFRA/cdp-build-action/build@main
            with:
              github-token: ${{ secrets.GITHUB_TOKEN }}
    ```
24. Set `publish-hotfix.yaml` to the following content exactly (replacing `{service-name}` with the derived service name):
    ```yaml
    name: Publish Hot Fix

    on:
      workflow_dispatch:

    permissions:
      id-token: write
      contents: write
      pull-requests: write

    env:
      AWS_REGION: eu-west-2
      AWS_ACCOUNT_ID: "094954420758"

    jobs:
      build:
        name: CDP-build-hotfix-workflow
        runs-on: ubuntu-latest
        steps:
          - name: Check out code
            uses: actions/checkout@v4
            with:
              fetch-depth: 0 # Depth 0 is required for branch-based versioning

          - uses: actions/setup-node@v4
            with:
              node-version: 22
              cache: npm

          - run: npm ci

          - name: Run Tests
            run: |
              mkdir -p coverage
              chmod -R a+rw ./coverage
              docker compose -f compose.yaml -f compose.test.yaml run --build --rm '{service-name}'

          - name: Publish Hot Fix
            uses: DEFRA/cdp-build-action/build-hotfix@main
            with:
              github-token: ${{ secrets.GITHUB_TOKEN }}

          - name: SonarQubeScan
            uses: SonarSource/sonarqube-scan-action@v7
            env:
              SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    ```
25. Create `.github/workflows/pr-approval-bot.yaml` (posts merge guidance on PR approval) with the exact content as follows:
```yaml
name: PR Approval Bot

on:
  pull_request_review:
    types: [submitted]

jobs:
  comment-on-approval:
    if: github.event.review.state == 'approved'
    runs-on: ubuntu-latest
    steps:
      - name: Post a comment on approval
        uses: peter-evans/create-or-update-comment@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.pull_request.number }}
          body: |
            **Your PR is now approved ✅**  
            Before merging, be sure to include `#patch` or `#major` in your commit message if merging either a patch or major version. This will ensure CDP deploys the correct version.  
            If merging a minor version, nothing needs to be done as these are automatically handled and deployed by CDP.  
            Full details can be found in the [CDP documentation](https://portal.cdp-int.defra.cloud/documentation/how-to/microservices.md?q=bump%20a%20either%20the%20major%20or%20patch%20version%2C%20push%20a%20commit%20with#versioning-your-microservice).  
```
26. Delete `.github/example.dependabot.yml` (if it exists)
27. Create `.github/agents/sonarqube-cloud.agents.md` with the SonarQube Cloud Fix Agent definition exactly as shown below
```md
---
description: "Use when: SonarQube Cloud code scan fails, Sonar issues need fixing, code quality gate failed, fix issues, resolve violations, security hotspots, code smells, bugs found by SonarQube Cloud. Checks for existing scan results in the terminal first, then parses the output and implements fixes for all identified issues using SonarQube Cloud recommendations where applicable."
tools: [execute, read, edit, search, todo, agent]
---

You are a **SonarQube Cloud Fix Agent** — a specialist at running SonarQube Cloud scans, interpreting their output, and implementing fixes for all identified code quality and security issues.

## Purpose

Your job is to:

1. Check the terminal for existing SonarQube Cloud scan results before doing anything else — never re-run if results already exist
2. If the quality gate passed with 0 issues and 0 hotspots, report the clean result and STOP
3. If there are issues, parse the scan output to identify all issues (bugs, vulnerabilities, code smells, security hotspots, failed quality gate conditions)
4. For each issue, locate the affected source file and line
5. Implement the fix directly in the codebase, following SonarQube Cloud's recommendations
6. Re-run the scan to verify all issues are resolved

## Constraints

- DO NOT skip issues — fix every issue reported by the scan
- DO NOT introduce new issues while fixing existing ones
- DO NOT modify test files unless the issue is specifically in a test file
- DO NOT change application behaviour — fixes must be functionally equivalent
- DO NOT weaken security (e.g. suppressing warnings, disabling rules) instead of fixing the root cause
- DO NOT re-run `npm run sonar` just because terminal output is truncated — truncation is normal and the quality gate summary is always visible at the end
- ALWAYS prefer the fix recommended by SonarQube Cloud for each rule violation
- ALWAYS run `npm run lint` after making changes to ensure no linting regressions and fix any that appear

## Approach

### Phase 1 — Check for Existing Results

1. **First**, check for existing scan results using `#tool:terminal_last_command` to inspect recent terminal output
2. **Terminal output is often truncated — this is normal and expected.** The truncation notice does NOT mean you need to re-run the scan. The quality gate summary block appears at the end of the scan output, so it will be visible even when earlier output is truncated.
3. Look for the quality gate summary block — it contains everything needed: quality gate status (`✅ PASSED` or `❌ FAILED`), New Issues count, Security Hotspots count, and the SonarCloud dashboard URL
4. **If the quality gate shows `✅ PASSED` with 0 New Issues and 0 Security Hotspots** — report the clean result to the user and STOP. There is nothing to fix. Do NOT re-run the scan.
5. **If the quality gate shows `❌ FAILED`** or there are issues/hotspots — use whatever issue details are visible in the terminal output for Phase 2. If some issues are truncated, use the SonarCloud dashboard URL from the summary to review the full list. Do NOT re-run the scan.
6. **Only if** no quality gate summary block (`SonarCloud Quality Gate:`) is found in the terminal output at all, run the SonarQube scan: `npm run sonar`

### Phase 2 — Triage

1. If the scan showed 0 issues and 0 security hotspots, skip to Phase 4 (report clean result)
2. Parse every issue from the output. For each issue extract:
   - Severity (BLOCKER, CRITICAL, MAJOR, MINOR, INFO)
   - File path and line number
   - Issue message and rule ID (e.g. `javascript:S1234`)
   - SonarQube Cloud issue URL (for additional context)
3. Create a todo list of all issues, ordered by severity (BLOCKER first)
4. Group issues by file where possible to minimise context switches

### Phase 3 — Fix

6. For each issue:
   a. Read the affected file and surrounding context
   b. Use `#tool:sonarqube_analyze_file` on the file to get the full SonarQube Cloud rule description and recommended fix
   c. Use `#tool:sonarqube_list_potential_security_issues` for any security hotspots or taint vulnerabilities
   d. Implement the fix following SonarQube Cloud's recommendation
   e. Mark the issue as completed in the todo list
7. After all fixes, run `npm run lint` to check for linting regressions and fix any that appear

### Phase 4 — Verify

8. Re-run `npm run sonar` to confirm the quality gate now passes
9. If new issues appear, repeat Phase 2–3 for those issues
10. Report the final result to the user

## Output Format

When finished, provide a summary:

```
## SonarQube Fix Summary

**Quality Gate**: PASSED / FAILED
**Issues Fixed**: <count>
**Files Modified**: <list>

### Changes Made
- <file>: <brief description of fix> (rule: <rule-id>)
- ...

### Remaining Issues (if any)
- <issue description and why it could not be auto-fixed>
```

## Parsing Scan Output

The scan output from `scripts/sonar-scan.js` follows this structure:

- **Quality Gate block**: Bordered section with `SonarQube Cloud Quality Gate: ✅ PASSED` or `❌ FAILED`
- **Metrics**: New Issues count, Coverage, Duplication, Security Hotspots
- **Failed Conditions**: Listed under `⛔ Failed Conditions` with metric name, actual value, and threshold
- **Issues block**: Headed by `🐛 Issues (<count> total)`, grouped by file (`📄 path/to/file`), each issue on a line like `🟡 L42 <message> (<rule>)` followed by a SonarQube Cloud URL
- **Hotspots block**: Headed by `🔥 Security Hotspots`, each with probability rating, file, line, and message

Use these patterns to reliably extract every issue from the output.
```

---

## Phase 5: Project Config Files

28. Set `eslint.config.js` to: `export default neostandard({})`
29. Set `vitest.config.js` to:
    ```js
    import { defineConfig } from 'vitest/config'

    export default defineConfig({
      test: {
        include: ['**/test/**/*.test.js'],
        coverage: {
          reportOnFailure: true,
          clean: false,
          reporter: ['lcov'],
          include: ['src/**/*.js'],
          exclude: [
            '**/node_modules/**',
            '**/test/**',
            '.server',
            'index.js'
          ]
        }
      }
    })
    ```
30. Replace `package.json` scripts with:
    ```json
    {
      "docker:build": "docker compose build",
      "docker:up": "docker compose up",
      "docker:up:d": "docker compose up -d",
      "docker:down": "docker compose down",
      "docker:down:v": "docker compose down -v",
      "docker:test": "npm run lint && (mkdir -p coverage 2>/dev/null || true) && docker compose -p {service-name}-test down -v && docker compose -f compose.yaml -f compose.test.yaml -p {service-name}-test run --build --rm {service-name}",
      "docker:test:watch": "docker compose -p {service-name}-test down -v && docker compose -f compose.yaml -f compose.test.yaml -f compose.test.watch.yaml -p {service-name}-test run --build --rm {service-name}",
      "docker:debug": "docker compose -f compose.yaml -f compose.debug.yaml -p '{service-name}' up",
      "sonar": "node scripts/sonar-scan.js",
      "test": "rm -rf ./coverage/** && vitest run --coverage",
      "test:watch": "vitest watch",
      "lint": "npx eslint . --ext .js",
      "lint:fix": "npx eslint . --ext .js --fix",
      "start:watch": "nodemon --watch src --exec 'node --experimental-vm-modules --inspect=0.0.0.0 src/index.js'",
      "start:debug": "nodemon --watch src --exec 'node --experimental-vm-modules --inspect-brk=0.0.0.0 src/index.js'",
      "start": "node --experimental-vm-modules src/index.js"
    }
    ```
31. Remove unused devDependencies: `prettier`, `@babel/core`, `@babel/preset-env`, `husky`, `autoprefixer`, `npm-run-all`
32. Update `.gitignore` — remove `.vscode` line so `.vscode/tasks.json` and `.vscode/launch.json` can be committed

---

## Phase 6: Pre-commit Hooks, VS Code Config, README

33. Create `.pre-commit-config.yaml`:
    ```yaml
    repos:
    - repo: https://github.com/Yelp/detect-secrets
      rev: v1.5.0
      hooks:
        - id: detect-secrets
          args: ['--baseline', '.secrets.baseline']

    - repo: local
      hooks:
        - id: eslint-fix
          name: ESLint with neostandard
          entry: npm run lint:fix
          language: node
    ```
34. Run `detect-secrets scan > .secrets.baseline`
35. Run `pre-commit install` then `pre-commit run --all-files`
36. Create `.vscode/tasks.json` with tasks for all npm scripts (use correct script names: `docker:up`, `docker:up:d`, `docker:down`, `docker:down:v`, etc.):
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "label": "🛠️ Build Docker container",
      "script": "docker:build"
    },
    {
      "type": "npm",
      "label": "🏁 Start Docker container",
      "script": "docker:up",
      "problemMatcher": []
    },
    {
      "type": "npm",
      "label": "✂️ Start Docker container (detached mode)",
      "script": "docker:up:d",
      "problemMatcher": []
    },
    {
      "type": "npm",
      "label": "🛑 Stop Docker container",
      "script": "docker:down",
      "problemMatcher": []
    },
    {
      "type": "npm",
      "label": "😵 Stop Docker container + delete volumes",
      "script": "docker:down:v",
      "problemMatcher": []
    },
    {
      "type": "npm",
      "label": "🧪 Run tests",
      "script": "docker:test",
      "problemMatcher": []
    },
    {
      "type": "npm",
      "label": "👀 Run tests (watch mode)",
      "script": "docker:test:watch"
    },
    {
      "type": "npm",
      "label": "🪲 Run debugger",
      "problemMatcher": [],
      "script": "docker:debug"
    },
    {
      "type": "npm",
      "label": "📋 Run linter",
      "script": "lint",
      "problemMatcher": []
    },
    {
      "type": "npm",
      "label": "🧹 Run linter + auto fix known issues",
      "script": "lint:fix",
      "problemMatcher": []
    },
    {
      "type": "npm",
      "label": "☁️ SonarQube Cloud scan",
      "problemMatcher": [],
      "script": "sonar"
    }
  ]
}
```
37. Create `.vscode/launch.json` (Docker attach, port 9242)
38. Replace `README.md` with the fcp-sfd standard README (substitute `{service-name}` throughout, ensure npm script references match Phase 5)

---

## Phase 8: Add Scripts

39. Create a `scripts` folder
40. Inside the `scripts` folder create a file called `sonar-scan.js` and ensure this file includes the content below exactly:
```js
import { readFileSync } from 'node:fs'
import { execFileSync, spawn } from 'node:child_process'
import { resolve } from 'node:path'
import dotenv from 'dotenv'

const SONARCLOUD_BASE_URL = 'https://sonarcloud.io'
const BORDER = '═'.repeat(51)
const THIN_BORDER = '─'.repeat(51)
const MAX_ISSUES_DISPLAYED = 30

const SEVERITY_ORDER = ['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR', 'INFO']
const SEVERITY_ICONS = {
  BLOCKER: '🔴',
  CRITICAL: '🟠',
  MAJOR: '🟡',
  MINOR: '🔵',
  INFO: '⚪'
}

const HOTSPOT_ICONS = {
  HIGH: '🔴',
  MEDIUM: '🟠',
  LOW: '🟡'
}

const METRIC_LABELS = {
  new_reliability_rating: 'Reliability Rating',
  new_security_rating: 'Security Rating',
  new_maintainability_rating: 'Maintainability Rating',
  new_coverage: 'Coverage on New Code',
  new_duplicated_lines_density: 'Duplication on New Code',
  new_violations: 'New Issues',
  new_security_hotspots_reviewed: 'Security Hotspots Reviewed',
  new_blocker_violations: 'Blocker Issues',
  new_critical_violations: 'Critical Issues'
}

const COMPARATOR_SYMBOLS = {
  GT: '>',
  LT: '<',
  EQ: '=',
  NE: '≠'
}

const getCurrentBranch = () =>
  execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim()

const runScanner = (sonarToken, cwd, branch) =>
  new Promise((resolve, reject) => {
    const args = [
      'run',
      '--rm',
      '--name',
      'sonar-scan',
      '-v',
      `${cwd}:/usr/src`,
      '-e',
      `SONAR_TOKEN=${sonarToken}`,
      'sonarsource/sonar-scanner-cli',
      '-Dsonar.issuesReport.console.enable=true',
      '-Dsonar.qualitygate.wait=true',
      `-Dsonar.branch.name=${branch}`,
      '-Dsonar.verbose=true'
    ]

    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    const message = 'Code scan in progress using sonar-scanner-cli (to view logs in real-time a Docker client can be used e.g. Docker Desktop)'
    let i = 0

    const spinner = setInterval(() => {
      process.stdout.write(`\r ${frames[i++ % frames.length]} ${message}`)
    }, 80)

    const child = spawn('docker', args, { stdio: 'ignore' })

    child.on('error', (err) => {
      clearInterval(spinner)
      process.stdout.write('\r')
      reject(err)
    })
    // Always resolve with the exit code — a non-zero exit may simply mean the
    // quality gate failed (analysis was still uploaded). We check the gate
    // status via the API after the scan and exit accordingly.
    child.on('close', (code) => {
      clearInterval(spinner)
      process.stdout.write(`\r ${message}\n`)
      console.log('\n ✔ Code scan complete. See below for the results.\n')
      resolve(code)
    })
  })

const sonarcloudFetch = async (path, sonarToken) => {
  const url = `${SONARCLOUD_BASE_URL}${path}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${sonarToken}`
    }
  })

  if (!response.ok) {
    throw new Error(`SonarCloud API error ${response.status}: ${response.statusText} (${url})`)
  }

  return response.json()
}

const fetchQualityGate = (projectKey, sonarToken, branch) =>
  sonarcloudFetch(
    `/api/qualitygates/project_status?projectKey=${encodeURIComponent(projectKey)}&branch=${encodeURIComponent(branch)}`,
    sonarToken
  )

const fetchMeasures = (projectKey, sonarToken, branch) =>
  sonarcloudFetch(
    `/api/measures/component?component=${encodeURIComponent(projectKey)}&branch=${encodeURIComponent(branch)}&metricKeys=new_violations,accepted_issues,security_hotspots,new_coverage,new_duplicated_lines_density`,
    sonarToken
  )

const fetchIssues = (projectKey, sonarToken, branch) =>
  sonarcloudFetch(
    `/api/issues/search?componentKeys=${encodeURIComponent(projectKey)}&branch=${encodeURIComponent(branch)}&resolved=false&inNewCodePeriod=true&ps=500&statuses=OPEN,CONFIRMED,REOPENED`,
    sonarToken
  )

const fetchSecurityHotspots = (projectKey, sonarToken, branch) =>
  sonarcloudFetch(
    `/api/hotspots/search?projectKey=${encodeURIComponent(projectKey)}&branch=${encodeURIComponent(branch)}&inNewCodePeriod=true&ps=500&status=TO_REVIEW`,
    sonarToken
  )

const getMeasureValue = (measures, key) => {
  const measure = measures.find((m) => m.metric === key)
  if (!measure) return 'N/A'

  return measure.value ?? measure.periods?.[0]?.value ?? 'N/A'
}

const formatPercent = (value) => (value === 'N/A' ? 'N/A' : `${parseFloat(value).toFixed(1)}%`)

const row = (label, value) => ` ${`  ${label}`.padEnd(28)}${value}`

const extractFilePath = (component, projectKey) => {
  const prefix = `${projectKey}:`
  return component.startsWith(prefix) ? component.slice(prefix.length) : component
}

const printFailedConditions = (qualityGate) => {
  const conditions = qualityGate.projectStatus?.conditions ?? []
  const failed = conditions.filter((c) => c.status === 'ERROR')

  if (failed.length === 0) return

  console.log(THIN_BORDER)
  console.log(' ⛔ Failed Conditions')

  for (const condition of failed) {
    const label = METRIC_LABELS[condition.metricKey] ?? condition.metricKey
    const comparator = COMPARATOR_SYMBOLS[condition.comparator] ?? condition.comparator

    const actual = condition.metricKey.includes('coverage') || condition.metricKey.includes('duplicat')
      ? formatPercent(condition.actualValue)
      : condition.actualValue

    const threshold = condition.metricKey.includes('coverage') || condition.metricKey.includes('duplicat')
      ? formatPercent(condition.errorThreshold)
      : condition.errorThreshold

    console.log(`    ${label}: ${actual} (threshold ${comparator} ${threshold})`)
  }
}

const printIssues = (issuesResponse, projectKey) => {
  const issues = issuesResponse?.issues ?? []
  const total = issuesResponse?.total ?? issues.length

  if (issues.length === 0) return

  // Sort by severity
  issues.sort((a, b) =>
    SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  )

  // Group by file
  const byFile = new Map()

  for (const issue of issues) {
    const filePath = extractFilePath(issue.component, projectKey)
    if (!byFile.has(filePath)) byFile.set(filePath, [])
    byFile.get(filePath).push(issue)
  }

  const issuesUrl = `${SONARCLOUD_BASE_URL}/project/issues?id=${encodeURIComponent(projectKey)}&resolved=false&inNewCodePeriod=true`

  console.log(`\n${BORDER}`)
  console.log(` 🐛 Issues (${total} total)`)
  console.log(BORDER)

  let displayed = 0

  for (const [filePath, fileIssues] of [...byFile.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    if (displayed >= MAX_ISSUES_DISPLAYED) break

    console.log(`\n  📄 ${filePath}`)

    for (const issue of fileIssues) {
      if (displayed >= MAX_ISSUES_DISPLAYED) break

      const icon = SEVERITY_ICONS[issue.severity] ?? '⚪'
      const rule = issue.rule ? ` (${issue.rule})` : ''

      console.log(`    ${icon} L${issue.line ?? '?'} ${issue.message}${rule}`)

      const issueUrl = `${SONARCLOUD_BASE_URL}/project/issues?id=${encodeURIComponent(projectKey)}&open=${encodeURIComponent(issue.key)}`

      console.log(`       ${issueUrl}`)

      displayed++
    }
  }

  if (total > MAX_ISSUES_DISPLAYED) {
    console.log(`\n  ... and ${total - MAX_ISSUES_DISPLAYED} more`)
  }

  console.log(THIN_BORDER)
  console.log(` 🔗 ${issuesUrl}`)
  console.log(`${BORDER}\n`)
}

const printHotspots = (hotspotsResponse, projectKey) => {
  const hotspots = hotspotsResponse?.hotspots ?? []

  if (hotspots.length === 0) return

  const total = hotspotsResponse?.paging?.total ?? hotspots.length

  console.log(`\n${BORDER}`)
  console.log(` 🔥 Security Hotspots (${total} to review)`)
  console.log(BORDER)

  let displayed = 0

  for (const hotspot of hotspots) {
    if (displayed >= MAX_ISSUES_DISPLAYED) break

    const filePath = extractFilePath(hotspot.component, projectKey)
    const icon = HOTSPOT_ICONS[hotspot.vulnerabilityProbability] ?? '🟡'
    const probability = hotspot.vulnerabilityProbability ?? 'UNKNOWN'

    console.log(`\n  📄 ${filePath}`)
    console.log(`    ${icon} [${probability}] L${hotspot.line ?? '?'} ${hotspot.message}`)

    const hotspotUrl = `${SONARCLOUD_BASE_URL}/security_hotspots?id=${encodeURIComponent(projectKey)}&hotspots=${encodeURIComponent(hotspot.key)}`

    console.log(`       ${hotspotUrl}`)

    displayed++
  }

  if (total > MAX_ISSUES_DISPLAYED) {
    console.log(`\n  ... and ${total - MAX_ISSUES_DISPLAYED} more`)
  }

  const hotspotsUrl = `${SONARCLOUD_BASE_URL}/security_hotspots?id=${encodeURIComponent(projectKey)}&inNewCodePeriod=true`

  console.log(THIN_BORDER)
  console.log(` 🔗 ${hotspotsUrl}`)
  console.log(`${BORDER}\n`)
}

const printSummary = (qualityGate, measuresResponse, projectKey, branch) => {
  const measures = measuresResponse.component?.measures ?? []
  const status = qualityGate.projectStatus?.status

  const passed = status === 'OK'
  const statusLabel = passed ? '✅ PASSED' : status === 'WARN' ? '⚠️  WARN' : '❌ FAILED'

  // Issues
  const newIssues = getMeasureValue(measures, 'new_violations')
  const acceptedIssues = getMeasureValue(measures, 'accepted_issues')

  // Measures
  const securityHotspots = getMeasureValue(measures, 'security_hotspots')
  const coverageOnNew = formatPercent(getMeasureValue(measures, 'new_coverage'))
  const duplicationOnNew = formatPercent(getMeasureValue(measures, 'new_duplicated_lines_density'))

  const dashboardUrl = `${SONARCLOUD_BASE_URL}/summary/overall?id=${encodeURIComponent(projectKey)}`

  console.log(`\n${BORDER}`)
  console.log(` SonarCloud Quality Gate: ${statusLabel}`)
  console.log(BORDER)
  console.log(' Issues')
  console.log(row('New Issues:', newIssues))
  console.log(row('Accepted Issues:', acceptedIssues))
  console.log(' Measures')
  console.log(row('Security Hotspots:', securityHotspots))
  console.log(row('Coverage on New Code:', coverageOnNew))
  console.log(row('Duplication on New Code:', duplicationOnNew))

  if (!passed) {
    printFailedConditions(qualityGate)
  }

  console.log(BORDER)
  console.log(` 🔀 Branch: ${branch}`)
  console.log(` 🔗 ${dashboardUrl}`)
  console.log(`${BORDER}\n`)

  return passed || status === 'WARN'
}

const sonarScan = async () => {
  const cwd = resolve('.')

  // Load .env if present (mirrors `source .env` from the old npm script)
  dotenv.config()
  const sonarToken = process.env.SONAR_TOKEN

  if (!sonarToken) {
    console.error(
      'Error: SONAR_TOKEN is not set. Add it to your .env file.'
    )

    process.exit(1)
  }

  // Read project config from sonar-project.properties
  const propsPath = resolve(cwd, 'sonar-project.properties')
  const props = dotenv.parse(readFileSync(propsPath))
  const projectKey = props['sonar.projectKey']

  if (!projectKey) {
    console.error('Error: sonar.projectKey not found in sonar-project.properties')
    process.exit(1)
  }

  // Detect current branch so the scan targets it on SonarCloud
  const branch = getCurrentBranch()
  console.log(`\n🔀 Branch: ${branch}\n`)

  // Run the scanner — resolves with exit code (0 = success, non-zero = quality
  // gate failed or scan error). We always attempt to fetch the summary.
  const scanCode = await runScanner(sonarToken, cwd, branch)

  // Fetch quality gate + metrics and print summary
  let qualityGate, measuresResponse

  try {
    ;[qualityGate, measuresResponse] = await Promise.all([
      fetchQualityGate(projectKey, sonarToken, branch),
      fetchMeasures(projectKey, sonarToken, branch)
    ])
  } catch (apiErr) {
    // API fetch failed — the scan likely didn't upload (e.g. auth error, network)
    if (scanCode !== 0) {
      console.error(`\nSonar scanner exited with code ${scanCode}. No results to display.`)
      process.exit(scanCode)
    }

    throw apiErr
  }

  const passed = printSummary(qualityGate, measuresResponse, projectKey, branch)

  if (!passed) {
    // Fetch detailed issues and hotspots to help developers fix problems locally
    try {
      const measures = measuresResponse.component?.measures ?? []
      const hotspotCount = getMeasureValue(measures, 'security_hotspots')
      const shouldFetchHotspots = hotspotCount !== 'N/A' && parseInt(hotspotCount, 10) > 0

      const fetches = [fetchIssues(projectKey, sonarToken, branch)]

      if (shouldFetchHotspots) {
        fetches.push(fetchSecurityHotspots(projectKey, sonarToken, branch))
      }

      const [issuesResponse, hotspotsResponse] = await Promise.all(fetches)

      printIssues(issuesResponse, projectKey)

      if (hotspotsResponse) {
        printHotspots(hotspotsResponse, projectKey)
      }
    } catch (detailErr) {
      console.error(`\nCould not fetch issue details: ${detailErr.message}`)
    }

    process.exit(1)
  }
}

sonarScan().catch((err) => {
  console.error(`\nSonar scan failed: ${err.message}`)
  process.exit(1)
})
```
41. Install dependencies as needed for the above code scanning script

---

## Phase 9: Update .gitignore

42. Ignore `.github/agents`
43. Ignore `.github/prompts`
44. Ignore `.github/skills`

---

## Phase 10: Ask for Application Port and Debug Port Numbers

The service port number is set in the following places:
- `compose.yaml`
- `Dockerfile`
- The `serviceConfig`  

Additionally a debug port is set in the `Dockerfile`.

45. Ask the user what port and debug ports they want to use for this service and then update all port references to match their answer

---

## Phase 11: Assemble Post-setup To-Do List for the User

As there are certain tasks I cannot perform, I will provide the user with a to-do list of next/final steps to complete the setup of a new SFD service.

The to-do list will have the following:
- Generate a `SONAR_TOKEN` and add this as a secret to the GitHub repository
- As shown in the README regarding the local SonarQube Cloud scan, the user can generate a second `SONAR_TOKEN` which they store in their `.env`
- Create a Ruleset via GitHub to protect the `main` branch if rules are not already implemented:
  - Call the Ruleset `main`
  - Set the Ruleset to Active
  - Set Branch targeting criteria to `Default`
  - Apply the following Branch rules:
    - Restrict deletions
    - Require signed commits
    - Require a pull request before merging
      - Required approvals: 1
      - Dismiss stale pull request approvals when new commits are pushed
      - Require conversation resolution before merging
    - Require status checks to pass:
      - Run Pull Request Checks
      - SonarCloud Code Analysis
    - Block force pushes

## Verification

After all phases are complete:

1. `npm install` — installs cleanly without babel/prettier/husky
2. `npm run lint` — ESLint runs without errors
3. `npm run test` — Vitest discovers tests in `test/unit/`
4. `docker compose -f compose.yaml config` — valid YAML
5. `docker compose -f compose.yaml -f compose.override.yaml config` — valid local override
6. `docker compose -f compose.yaml -f compose.test.yaml config` — valid test overlay
7. `pre-commit run --all-files` — hooks pass
8. Confirm: no `.test.js` in `src/`, no example files, no prettier/babel/husky config, no `.vite/`
