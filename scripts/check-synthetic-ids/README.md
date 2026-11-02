# Synthetic ID check (`sfd-id-check`)

Stops real customer identifiers being committed to SFD repositories. It checks **added lines only** and fails if they contain:

- a 10-digit number (possible CRN) outside the synthetic CRN ranges
- a 9-digit number (possible SBI) outside the synthetic SBI ranges

It reports the file and line, never the number, so a real identifier isn't copied into logs.

It runs in two places:

- **Pre-commit hook** (Husky): checks staged changes before each commit.
- **Pull request check** (GitHub Actions): checks the pull request's changes. This also catches commits made with `--no-verify` or without the hook installed.

A number check can't tell a real identifier from any other number of the same length. It reduces the risk of leaking real data but doesn't remove it.

## Synthetic ranges

The ranges are defined in [`ranges.json`](./ranges.json). All ranges are inclusive.

| Range | Identifier | From | To | Status |
| --- | --- | --- | --- | --- |
| Synthetic CRNs | CRN (10 digits) | 9000000000 | 9999999999 | Current |
| Synthetic SBIs | SBI (9 digits) | 800000000 | 899999999 | Current |
| SFD edge-case CRNs | CRN (10 digits) | 3000000000 | 3099999999 | Legacy |
| SFD edge-case SBIs | SBI (9 digits) | 300900001 | 300999999 | Legacy |

- **Current** ranges were agreed with the DAL team: all synthetic identifiers use the 9XX (CRN) and 8XX (SBI) ranges. The DAL mock performance data uses person IDs 9500001 to 9500606, giving CRNs 9500001000 to 9500606000 (person ID with `000` on the end), and SBIs 850000001 to 850000614.
- **Legacy** ranges cover existing SFD edge-case test data. They're accepted until that data moves to the current ranges. Don't use them for new data.

Placeholders such as `123456789`, `1234567890` or `111111111` are flagged on purpose. They fall inside the real identifier number space and could match a real customer. Replace them with a value from a current range, for example `9000000001` or `800000001`. <!-- sfd-id-check: allow -->

## Allowing numbers that aren't CRNs or SBIs

Some 9 and 10-digit numbers are not identifiers, for example Unix timestamps, phone numbers or fixed IDs. Allow them explicitly in one of two ways.

### Inline marker

Add `sfd-id-check: allow` anywhere on the same line, usually in a comment:

```js
const createdAt = 1700000000 // sfd-id-check: allow - Unix timestamp
```

### Allow file

Add a `.sfd-id-check-allow` file to the repository root. Use it where comments aren't possible, such as JSON.

```text
# Lines starting with # are comments.

# Allow one specific number anywhere in the repository.
value:1700000000

# Skip files or directories (gitignore-style globs).
test/fixtures/timestamps.json
**/*.snap
```

Every change to the allow file is shown as a warning on the pull request, so reviewers can check new entries aren't real identifiers. Prefer `value:` entries or the inline marker over skipping whole files.

Lockfiles (`package-lock.json`, `npm-shrinkwrap.json`, `*.lock`) and the allow file itself are always skipped.

## Adding the check to a repository

### Pull request check

Add a step straight after checkout in the pull request workflow:

```yaml
- name: Checkout code
  uses: actions/checkout@<sha>

- name: Check for real-looking CRNs and SBIs
  uses: DEFRA/fcp-sfd-core/.github/actions/check-synthetic-ids@<sha>
```

The action works with the default shallow checkout. It skips with a notice on events that aren't pull requests, unless a `base` input is given.

### Pre-commit hook

1. Install Husky and this package as dev dependencies:

   ```bash
   npm install --save-dev --save-exact husky@9.1.7 github:DEFRA/fcp-sfd-core#<sha>
   ```

2. Add a script to set up Husky. SFD repositories set `ignore-scripts=true` in `.npmrc`, so this doesn't run automatically on `npm install`:

   ```json
   "setup:husky": "node -e \"try { (await import('husky')).default() } catch (e) { if (e.code !== 'ERR_MODULE_NOT_FOUND') throw e }\" --input-type module"
   ```

3. Add `.husky/pre-commit`:

   ```sh
   npx --no-install sfd-id-check --staged
   ```

Each developer then runs this once per clone:

```bash
npm install
npm run setup:husky
```

## Running it manually

```bash
# Staged changes
npx sfd-id-check --staged

# Changes between two commits
npx sfd-id-check --base origin/main --head HEAD
```

Exit codes: `0` no problems, `1` possible real identifiers found, `2` usage or git error.

The hook skips merge commits, because their changes come from branches that were already checked. The pull request check still covers them.

## Changing the ranges

Update [`ranges.json`](./ranges.json) and the table above, and run `npm test`. Agree any change with the DAL team first so ranges never overlap real values.
