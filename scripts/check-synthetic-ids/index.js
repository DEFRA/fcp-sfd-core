#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import {
  ALLOW_FILE,
  describeViolation,
  findViolations,
  loadRanges,
  parseAllowFile,
  parseDiff
} from './scan.js'

const USAGE = `Usage:
  sfd-id-check --staged               Check staged changes (pre-commit hook)
  sfd-id-check --base <ref> [--head <ref>]  Check changes between two commits (CI)

Fails if added lines contain a 9-digit (SBI) or 10-digit (CRN) number outside the
synthetic ranges. Reports file and line only, never the number.`

const HELP = `
Use synthetic identifiers only:
  CRNs: 9000000000 to 9999999999
  SBIs: 800000000 to 899999999

If the number is not a CRN or SBI (e.g. a Unix timestamp or phone number), either:
  - add "sfd-id-check: allow" in a comment on the same line, or
  - add "value:<number>" or a path glob to ${ALLOW_FILE} in the repository root.

See https://github.com/DEFRA/fcp-sfd-core/tree/main/scripts/check-synthetic-ids`

const git = (args, cwd) => execFileSync('git', args, {
  cwd,
  encoding: 'utf8',
  maxBuffer: 1024 * 1024 * 1024,
  stdio: ['ignore', 'pipe', 'pipe']
})

const hasMergeHead = (cwd) => {
  try {
    git(['rev-parse', '-q', '--verify', 'MERGE_HEAD'], cwd)
    return true
  } catch {
    return false
  }
}

const escapeAnnotation = (value) => value.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A')
const escapeAnnotationProperty = (value) => escapeAnnotation(value).replace(/:/g, '%3A').replace(/,/g, '%2C')

const fail = (message) => {
  console.error(`sfd-id-check: ${message}`)
  process.exit(2)
}

const main = () => {
  let options

  try {
    ({ values: options } = parseArgs({
      options: {
        staged: { type: 'boolean', default: false },
        base: { type: 'string' },
        head: { type: 'string', default: 'HEAD' },
        help: { type: 'boolean', short: 'h', default: false }
      }
    }))
  } catch (error) {
    fail(`${error.message}\n\n${USAGE}`)
  }

  if (options.help) {
    console.log(USAGE)
    return
  }

  if (options.staged === Boolean(options.base)) {
    fail(`use either --staged or --base\n\n${USAGE}`)
  }

  let root

  try {
    root = git(['rev-parse', '--show-toplevel']).trim()
  } catch {
    fail('not inside a git repository')
  }

  // Merge commits bring in lines already reviewed on another branch; the pull request check still covers them.
  if (options.staged && hasMergeHead(root)) {
    console.log('sfd-id-check: skipping merge commit (changes are checked on the pull request)')
    return
  }

  const diffArgs = [
    '-c', 'core.quotePath=false',
    'diff', '--unified=0', '--no-color', '--no-ext-diff', '--no-textconv',
    '--src-prefix=a/', '--dst-prefix=b/', '--diff-filter=d',
    ...(options.staged ? ['--cached'] : [options.base, options.head])
  ]

  let diff

  try {
    diff = git(diffArgs, root)
  } catch (error) {
    fail(`git diff failed: ${error.stderr?.toString().trim() || error.message}`)
  }

  const allowPath = path.join(root, ALLOW_FILE)
  const allow = existsSync(allowPath)
    ? parseAllowFile(readFileSync(allowPath, 'utf8'))
    : { globs: [], values: new Set(), errors: [] }

  if (allow.errors.length) {
    fail(allow.errors.join('\n'))
  }

  const addedLines = parseDiff(diff)
  const violations = findViolations(addedLines, { ranges: loadRanges(), allow })
  const inActions = process.env.GITHUB_ACTIONS === 'true'

  if (inActions && addedLines.some(({ file }) => file === ALLOW_FILE)) {
    console.log(`::warning file=${ALLOW_FILE},title=Synthetic ID check::${ALLOW_FILE} changed. Reviewers: check new entries are not real CRNs or SBIs.`)
  }

  if (!violations.length) {
    console.log(`sfd-id-check: no real-looking CRNs or SBIs found in ${addedLines.length} added line(s)`)
    return
  }

  for (const violation of violations) {
    console.error(describeViolation(violation))

    if (inActions) {
      const file = escapeAnnotationProperty(violation.file)
      const message = escapeAnnotation(describeViolation(violation))
      console.log(`::error file=${file},line=${violation.line},title=Possible real CRN or SBI::${message}`)
    }
  }

  console.error(`\nsfd-id-check: found ${violations.length} possible real CRN(s) or SBI(s).${HELP}`)

  if (inActions && process.env.GITHUB_STEP_SUMMARY) {
    const rows = violations.map((violation) => `- \`${violation.file}\` line ${violation.line}: ${violation.type.toUpperCase()}`).join('\n')
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Possible real CRNs or SBIs\n\n${rows}\n\`\`\`${HELP}\n\`\`\`\n`)
  }

  process.exitCode = 1
}

main()
