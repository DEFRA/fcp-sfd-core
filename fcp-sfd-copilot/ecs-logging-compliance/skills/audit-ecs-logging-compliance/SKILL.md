---
name: audit-ecs-logging-compliance
description: "Audits a CDP Node.js service for ECS logging compliance violations. Use when: checking logging compliance, auditing log fields, finding non-compliant Pino logger calls, detecting flat top-level log keys, reviewing ECS structured logging, scanning src/ for logger violations, generating ECS audit report, checking event or error namespace usage."
---

# ECS Logging Compliance Audit

Scans the `src/` directory of a CDP-hosted Node.js service and produces a structured audit report of every non-compliant Pino logger call.

> **Why this matters:** CDP uses Pino with `@elastic/ecs-pino-format`. Flat top-level keys in merge objects are **silently dropped** by the OpenSearch ingestion pipeline. Only fields nested under approved ECS namespaces (`event`, `error`, etc.) will ever appear in logs.

See [ECS-FIELDS.md](../ecs-logging/ECS-FIELDS.md) for the full approved field reference and examples.

---

## When to Use

- Before merging a new service or feature branch that adds logging
- After a code review flags unstructured log fields
- As a periodic compliance check across the `src/` directory
- When OpenSearch logs appear empty or fields are missing

---

## Procedure

### Step 1 — Scan for logger call sites

Search all `.js` files under `src/` (excluding `test/`) for:

- `logger.(info|warn|error|debug|trace|fatal)(`
- `request.logger.(info|warn|error|debug|trace|fatal)(`

For each call, inspect the **first argument**. If it is an object literal, a variable, or a function call returning an object, apply the detection rules below.

Also scan every file matching `src/utils/build-*-log.js` and inspect the returned object from every exported function.

### Step 2 — Apply detection rules

Flag violations for each of the following rules:

#### Rule 1 — Flat top-level keys in merge objects

Any key in the merge object that is not a recognised CDP nested namespace is silently dropped.

**Non-compliant:**
```js
logger.error({ msg: 'Auth failed', reason, path: request.path, method: request.method })
```
**Compliant:**
```js
logger.error({
  event: { type: 'auth_failure', action: request.method, category: request.path, reason, outcome: 'failure' },
  error: { message: 'Auth failed', type: 'AuthenticationError' }
})
```

#### Rule 2 — Ad-hoc objects not nested under approved namespaces

Merge objects with keys like `url`, `uploadId`, `statusCode`, `body`, `file`, `fileId` that are not nested under `event`, `error`, or another approved namespace.

**Non-compliant:**
```js
logger.error({ url, uploadId }, 'CDP Uploader status request timed out')
logger.error({ statusCode: response.status, body, url }, 'Non-2xx response')
```
**Compliant:**
```js
logger.error({
  event: { type: 'status_check', outcome: 'failure', reference: uploadId },
  error: { message: 'CDP Uploader status request timed out', type: 'TimeoutError' }
}, 'CDP Uploader status request timed out')
```

#### Rule 3 — Raw Error object as first argument

Passing a raw `Error` object as the first argument outputs `err.type`, `err.message`, `err.stack` as flat `err.*` keys, which do **not** map to CDP's `error/type`, `error/message`, `error/stack_trace` paths.

**Non-compliant:**
```js
logger.error(error, 'Failed to persist metadata')
```
**Compliant:**
```js
logger.error({
  event: { type: 'metadata_persist', outcome: 'failure' },
  error: {
    code: error.code,
    message: error.message,
    stack_trace: error.stack,
    type: error.constructor.name
  }
}, 'Failed to persist metadata')
```

#### Rule 4 — Duration not in nanoseconds

Any `event.duration` value not explicitly converted from milliseconds using `ms * 1_000_000`.

#### Rule 5 — Custom namespace not in the CDP schema

Any nested object key in the merge object that is not in the approved namespace list (e.g. `file: { ... }`, `request: { ... }`, `response: { ... }` as custom top-level keys).

Approved namespaces: `event`, `error`, `http`, `client`, `url`, `user_agent`, `log`, `process`, `tenant`, `service`, `host`, `span`, `transaction`.

#### Rule 6 — Setting CDP-reserved fields

Any merge object that sets fields marked as reserved: `service/name`, `service/version`, `@timestamp`, `@ingestion_timestamp`, `ecs.version`, `container_id`, `container_name`, `trace.id`, `amazon/trace.id`.

### Step 3 — Apply exclusions

Do **not** flag:
- Plain string-only messages: `logger.info('No pending messages')` — compliant
- Template literal string-only messages: `` logger.info(`Processing ${count} messages`) `` — compliant
- The `message` parameter (second argument): `logger.info({ event: { ... } }, 'Human-readable message')` — compliant

### Step 4 — Write the audit report

Output all findings to `ECS-LOGGING-AUDIT.md` in the **repo root** using this format for each violation:

```markdown
### `[file path relative to repo root]` — Line N

**Offending code:**
```js
// exact code snippet
```

**Violation:** Rule N — [rule name]

**Why it's non-compliant:** Specific explanation of which fields are dropped or misplaced.

**Suggested fix:**
```js
// corrected code using event:/error: nesting
```
```

After all violations, append a **Summary** section:

```markdown
## Summary

- **Total violations:** N
- **Breakdown by rule:**
  - Rule 1 (flat top-level keys): N
  - Rule 2 (ad-hoc unnested objects): N
  - Rule 3 (raw Error objects): N
  - Rule 4 (duration not in nanoseconds): N
  - Rule 5 (custom namespaces): N
  - Rule 6 (CDP-reserved fields): N
- **Fully compliant files:** [list]
- **Recommended fix priority:**
  1. Rule 3 — raw Error objects (stack traces are lost entirely)
  2. Rule 1/2 — flat/unnested keys (all context silently dropped)
  3. Rule 5 — custom namespaces (fields won't reach OpenSearch)
  4. Rule 4 — duration units (metrics are incorrect)
  5. Rule 6 — reserved fields (overridden by pipeline anyway)
```

### Step 5 — Update `.gitignore`

Check if `ECS-LOGGING-AUDIT.md` is already listed in `.gitignore`. If not, add it and inform the user so the report is not committed.

---

## Reference

| Resource | Purpose |
|----------|---------|
| [ECS-FIELDS.md](../ecs-logging/ECS-FIELDS.md) | Approved field reference with examples |
| [ecs-logging skill](../ecs-logging/SKILL.md) | Creating compliant log builders and tests |
